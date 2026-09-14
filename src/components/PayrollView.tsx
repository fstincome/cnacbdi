import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Download, Eye, Plus, Printer, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/data";
import { useMyAccess } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Employee = { id: string; nom: string; prenom: string | null; service: string | null };
type Salary = { id: string; employe_id: string; etat_civil: string; nombre_enfants: number; salaire_base: number };
type Detail = { id: string; employe_id: string; salaire_base: number; indemnite_deplacement: number; indemnite_logement: number; allocations_familiales: number; salaire_brut: number; inss_4: number; mutuelle_4: number; deductions: number; revenu_net_imposable: number; ipr: number; salaire_net: number; inss_6: number; inss_3: number; mutuelle_6: number; montant_supporte: number };
type Payslip = { id: string; mois: number; annee: number; document_url: string | null; auteur_nom: string | null; modificateur_nom: string | null; statut: string };

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const NEXT_STATUS: Record<string, string> = { Soumis: "Révisé", Révisé: "Validé", Validé: "Payé" };

function calculate(base: number, civil: string, children: number) {
  const travel = base * 0.15;
  const housing = base * 0.6;
  const family = children * 2000 + (civil === "Marié(e)" ? 3000 : 0);
  const gross = base + travel + housing + family;
  const inss4 = gross > 450000 ? 18000 : gross * 0.04;
  const inss6 = gross > 450000 ? 27000 : gross * 0.06;
  const inss3 = gross > 80000 ? 2400 : gross * 0.03;
  const deductions = travel + housing + inss4;
  const taxable = gross - deductions - family;
  const tax = Math.max(0, (taxable - 300000) * 0.3 + 30000);
  const mutual4 = 0;
  const net = gross - inss4 - tax - mutual4;
  const mutual6 = (gross - housing) * 0.06;
  const employerCost = inss4 + mutual4 + tax + net + inss6 + inss3 + mutual6;
  return { travel, housing, family, gross, inss4, inss6, inss3, deductions, taxable, tax, mutual4, net, mutual6, employerCost };
}

export function PayrollView() {
  const qc = useQueryClient();
  const { isAdmin } = useMyAccess();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Salary | null | undefined>(undefined);
  const [employeeId, setEmployeeId] = useState("");
  const [civil, setCivil] = useState("Célibataire");
  const [children, setChildren] = useState("0");
  const [base, setBase] = useState("0");
  const [pdfPreview, setPdfPreview] = useState<{ url: string; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["payroll"],
    queryFn: async () => {
      const [employees, salaries, details, payslips] = await Promise.all([
        supabase.from("employes").select("id, nom, prenom, service").neq("statut", "Inactif").order("nom"),
        supabase.from("salaires").select("id, employe_id, etat_civil, nombre_enfants, salaire_base").order("created_at"),
        supabase.from("details_paie").select("*").order("created_at"),
        supabase.from("fiches_paie_mensuelles").select("id, mois, annee, document_url, auteur_nom, modificateur_nom, statut").order("annee", { ascending: false }).order("mois", { ascending: false }),
      ]);
      for (const result of [employees, salaries, details, payslips]) if (result.error) throw result.error;
      return { employees: (employees.data ?? []) as Employee[], salaries: (salaries.data ?? []) as Salary[], details: (details.data ?? []) as Detail[], payslips: (payslips.data ?? []) as Payslip[] };
    },
  });

  const employeeMap = useMemo(() => new Map((data?.employees ?? []).map((e) => [e.id, `${e.nom} ${e.prenom ?? ""}`.trim()])), [data?.employees]);
  const preview = calculate(Number(base || 0), civil, Number(children || 0));
  const filteredSalaries = (data?.salaries ?? []).filter((s) => employeeMap.get(s.employe_id)?.toLowerCase().includes(query.toLowerCase()));

  const saveSalary = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const values = { employe_id: employeeId, etat_civil: civil, nombre_enfants: Number(children), salaire_base: Number(base), auteur_id: auth.user?.id ?? null };
      const result = editing?.id
        ? await supabase.from("salaires").update(values).eq("id", editing.id)
        : await supabase.from("salaires").insert(values);
      if (result.error) throw result.error;
    },
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["payroll"] }); setEditing(undefined); toast.success("Paramétrage salarial enregistré et calculé."); },
    onError: (error) => toast.error(error.message.includes("unique") ? "Cet employé possède déjà un paramétrage salarial." : error.message),
  });

  const createPayslip = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const { data: auth } = await supabase.auth.getUser();
      const name = auth.user?.user_metadata?.["nom_complet"] ?? auth.user?.email ?? "Utilisateur";
      const { error } = await supabase.from("fiches_paie_mensuelles").insert({ mois: previous.getMonth() + 1, annee: previous.getFullYear(), auteur_id: auth.user?.id ?? null, auteur_nom: name, modificateur_id: auth.user?.id ?? null, modificateur_nom: name, statut: "Soumis" });
      if (error) throw error;
    },
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["payroll"] }); toast.success("Fiche mensuelle générée et soumise."); },
    onError: (error) => toast.error(error.message.includes("unique") ? "Une fiche existe déjà pour cette période." : error.message),
  });

  const updatePayslip = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      const { data: auth } = await supabase.auth.getUser();
      const name = auth.user?.user_metadata?.["nom_complet"] ?? auth.user?.email ?? "Utilisateur";
      const { error } = await supabase.from("fiches_paie_mensuelles").update({ statut, modificateur_id: auth.user?.id ?? null, modificateur_nom: name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["payroll"] }); toast.success("Statut de la fiche mis à jour."); },
    onError: (error) => toast.error(error.message),
  });

  function openSalary(salary?: Salary) {
    setEditing(salary ?? null);
    setEmployeeId(salary?.employe_id ?? "");
    setCivil(salary?.etat_civil ?? "Célibataire");
    setChildren(String(salary?.nombre_enfants ?? 0));
    setBase(String(salary?.salaire_base ?? 0));
  }

  async function viewPayslip(payslip: Payslip) {
    const name = `fiche-paie-${String(payslip.mois).padStart(2, "0")}-${payslip.annee}.pdf`;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("CNAC MURIMA W'ISANGI", 14, 18);
    pdf.setFontSize(13);
    pdf.text(`Fiche mensuelle de paie - ${MONTHS[payslip.mois - 1] ?? payslip.mois} ${payslip.annee}`, 14, 28);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(`Statut : ${payslip.statut}`, 14, 35);
    const headers = ["Employe", "Salaire brut", "IPR", "Net a payer"];
    const widths = [76, 38, 32, 38];
    let y = 45;
    pdf.setFillColor(232, 238, 234);
    pdf.rect(14, y, 184, 8, "F");
    let x = 14;
    pdf.setFont("helvetica", "bold");
    headers.forEach((header, index) => { pdf.text(header, x + 2, y + 5.5); x += widths[index] ?? 0; });
    pdf.setFont("helvetica", "normal");
    for (const detail of data?.details ?? []) {
      y += 8;
      if (y > 278) { pdf.addPage(); y = 18; }
      x = 14;
      const values = [employeeMap.get(detail.employe_id) ?? "—", formatMoney(detail.salaire_brut), formatMoney(detail.ipr), formatMoney(detail.salaire_net)];
      values.forEach((value, index) => { pdf.rect(x, y, widths[index] ?? 0, 8); pdf.text(String(value).slice(0, 38), x + 2, y + 5.5); x += widths[index] ?? 0; });
    }
    const url = URL.createObjectURL(pdf.output("blob"));
    setPdfPreview({ url, name });
  }

  function closePdfPreview() {
    if (pdfPreview) URL.revokeObjectURL(pdfPreview.url);
    setPdfPreview(null);
  }

  function printPdf() {
    const pages = Array.from(document.querySelectorAll<HTMLCanvasElement>('[data-payroll-pdf-page="true"]'));
    if (!pages.length) return;
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) { toast.error("Autorisez les fenêtres contextuelles pour imprimer la fiche."); return; }
    const images = pages.map((page) => `<img src="${page.toDataURL("image/png")}" alt="Page de la fiche de paie">`).join("");
    printWindow.document.write(`<html><head><title>${pdfPreview?.name ?? "Fiche de paie"}</title><style>@page{size:A4;margin:0}body{margin:0;background:#fff}img{display:block;width:210mm;height:auto;page-break-after:always}</style></head><body>${images}<script>window.onload=()=>window.print()<\/script></body></html>`);
    printWindow.document.close();
  }

  return <div className="space-y-6">
    <header><h1 className="text-2xl font-semibold">Gestion des salaires</h1><p className="mt-1 text-sm text-muted-foreground">La paie est gérée séparément des dossiers Employés.</p></header>
    <Tabs defaultValue="parametres" className="space-y-4">
      <TabsList className="h-auto flex-wrap justify-start"><TabsTrigger value="parametres">Paramétrage</TabsTrigger><TabsTrigger value="details">Détails des calculs</TabsTrigger><TabsTrigger value="mensuelles">Fiches mensuelles</TabsTrigger></TabsList>
      <TabsContent value="parametres" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><SearchBox value={query} onChange={setQuery} /><Button onClick={() => openSalary()}><Plus className="mr-2 size-4" />Nouveau salaire</Button></div>
        <DataFrame loading={isLoading} empty={!filteredSalaries.length} columns={["Employé", "État civil", "Enfants", "Salaire de base", ""]}>
          {filteredSalaries.map((s) => <TableRow key={s.id}><TableCell className="font-medium">{employeeMap.get(s.employe_id) ?? "—"}</TableCell><TableCell>{s.etat_civil}</TableCell><TableCell>{s.nombre_enfants}</TableCell><TableCell>{formatMoney(s.salaire_base)}</TableCell><TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => openSalary(s)}>Modifier</Button></TableCell></TableRow>)}
        </DataFrame>
      </TabsContent>
      <TabsContent value="details">
        <div className="mb-3 text-xs text-muted-foreground">ID : indemnité de déplacement · IL : indemnité de logement · AF : allocations familiales · RNI : revenu net imposable · SNP : salaire net à payer · MS : montant supporté</div>
        <DataFrame loading={isLoading} empty={!data?.details.length} columns={["Employé", "SB", "ID", "IL", "AF", "S. brute", "INSS 4%", "M 4%", "DED", "RNI", "IPR", "SNP", "INSS 6%", "INSS 3%", "M 6%", "MS"]}>
          {(data?.details ?? []).map((d) => <TableRow key={d.id}>{[employeeMap.get(d.employe_id) ?? "—", d.salaire_base, d.indemnite_deplacement, d.indemnite_logement, d.allocations_familiales, d.salaire_brut, d.inss_4, d.mutuelle_4, d.deductions, d.revenu_net_imposable, d.ipr, d.salaire_net, d.inss_6, d.inss_3, d.mutuelle_6, d.montant_supporte].map((value, i) => <TableCell key={i} className={i === 0 ? "font-medium whitespace-nowrap" : "text-right whitespace-nowrap"}>{i === 0 ? value : formatMoney(Number(value))}</TableCell>)}</TableRow>)}
        </DataFrame>
      </TabsContent>
      <TabsContent value="mensuelles" className="space-y-4">
        <div className="flex justify-end"><Button onClick={() => createPayslip.mutate()} disabled={createPayslip.isPending || !data?.details.length}><Plus className="mr-2 size-4" />Générer le mois précédent</Button></div>
        <DataFrame loading={isLoading} empty={!data?.payslips.length} columns={["Mois", "Fiche", "Auteur", "Dernier modificateur", "Statut", "Actions"]}>
          {(data?.payslips ?? []).map((p) => { const nextStatus = NEXT_STATUS[p.statut]; return <TableRow key={p.id}><TableCell>{MONTHS[p.mois - 1]} {p.annee}</TableCell><TableCell><Button variant="ghost" size="icon" title="Consulter la fiche" onClick={() => viewPayslip(p)}><Eye className="size-4" /></Button></TableCell><TableCell>{p.auteur_nom ?? "—"}</TableCell><TableCell>{p.modificateur_nom ?? "—"}</TableCell><TableCell><StatusBadge status={p.statut} /></TableCell><TableCell className="whitespace-nowrap">{isAdmin && nextStatus ? <Button variant="outline" size="sm" onClick={() => updatePayslip.mutate({ id: p.id, statut: nextStatus })}><CheckCircle2 className="mr-2 size-4" />{nextStatus}</Button> : null}{isAdmin && p.statut !== "Annulé" && p.statut !== "Payé" ? <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updatePayslip.mutate({ id: p.id, statut: "Annulé" })}><XCircle className="mr-2 size-4" />Annuler</Button> : null}</TableCell></TableRow>; })}
        </DataFrame>
      </TabsContent>
    </Tabs>

    <Dialog open={editing !== undefined} onOpenChange={(open) => { if (!open) setEditing(undefined); }}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>{editing?.id ? "Modifier le salaire" : "Nouveau salaire"}</DialogTitle><DialogDescription>Les montants détaillés sont calculés automatiquement selon les règles du système source.</DialogDescription></DialogHeader><div className="grid gap-5 sm:grid-cols-2"><Field label="Employé"><Select value={employeeId} onValueChange={setEmployeeId} disabled={Boolean(editing?.id)}><SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger><SelectContent>{(data?.employees ?? []).filter((e) => editing?.employe_id === e.id || !(data?.salaries ?? []).some((s) => s.employe_id === e.id)).map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom}</SelectItem>)}</SelectContent></Select></Field><Field label="État civil"><Select value={civil} onValueChange={setCivil}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Célibataire">Célibataire</SelectItem><SelectItem value="Marié(e)">Marié(e)</SelectItem></SelectContent></Select></Field><Field label="Nombre d’enfants"><Input type="number" min="0" max="20" value={children} onChange={(e) => setChildren(e.target.value)} /></Field><Field label="Salaire de base (FBu)"><Input type="number" min="0" value={base} onChange={(e) => setBase(e.target.value)} /></Field></div><Card className="bg-muted/40"><CardContent className="grid gap-3 pt-5 sm:grid-cols-3"><Preview label="Salaire brut" value={preview.gross} /><Preview label="IPR" value={preview.tax} /><Preview label="Net à payer" value={preview.net} /></CardContent></Card><DialogFooter><Button variant="outline" onClick={() => setEditing(undefined)}>Annuler</Button><Button disabled={!employeeId || Number(base) <= 0 || saveSalary.isPending} onClick={() => saveSalary.mutate()}>Enregistrer et calculer</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={pdfPreview !== null} onOpenChange={(open) => { if (!open) closePdfPreview(); }}><DialogContent className="flex h-[92vh] max-w-[95vw] flex-col sm:max-w-5xl"><DialogHeader><DialogTitle>Fiche mensuelle de paie</DialogTitle><DialogDescription>Consultez le document avant de l’imprimer ou de le télécharger.</DialogDescription></DialogHeader>{pdfPreview ? <PdfPreview url={pdfPreview.url} /> : null}<DialogFooter className="flex-row justify-end gap-2"><Button variant="outline" onClick={printPdf}><Printer className="mr-2 size-4" />Imprimer</Button><Button asChild><a href={pdfPreview?.url} download={pdfPreview?.name}><Download className="mr-2 size-4" />Télécharger</a></Button></DialogFooter></DialogContent></Dialog>
  </div>;
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <div className="relative min-w-64"><Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" /><Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Rechercher un employé…" className="pl-9" /></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }
function Preview({ label, value }: { label: string; value: number }) { return <div><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold">{formatMoney(value)}</p></div>; }
function StatusBadge({ status }: { status: string }) { return <Badge variant={status === "Payé" ? "default" : status === "Annulé" ? "destructive" : "outline"}>{status}</Badge>; }
function DataFrame({ columns, children, loading, empty }: { columns: string[]; children: React.ReactNode; loading: boolean; empty: boolean }) { return <div className="overflow-x-auto rounded-lg border bg-card"><Table><TableHeader><TableRow>{columns.map((c) => <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>)}</TableRow></TableHeader><TableBody>{loading || empty ? <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">{loading ? "Chargement…" : "Aucune donnée disponible."}</TableCell></TableRow> : children}</TableBody></Table></div>; }

function PdfPreview({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    container.replaceChildren();
    setError("");
    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
        const document = await pdfjs.getDocument({ data: bytes }).promise;
        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
          if (cancelled) return;
          const page = await document.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = window.document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Aperçu indisponible");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.dataset["payrollPdfPage"] = "true";
          canvas.className = "mx-auto block h-auto w-full max-w-[794px] bg-card shadow-sm";
          container.appendChild(canvas);
          await page.render({ canvasContext: context, viewport }).promise;
        }
      } catch (renderError) {
        const detail = renderError instanceof Error ? renderError.message : "Erreur inconnue";
        if (!cancelled) setError(`Le document n’a pas pu être affiché (${detail}). Vous pouvez toujours le télécharger.`);
      }
    })();
    return () => { cancelled = true; };
  }, [url]);

  return <div className="min-h-0 flex-1 overflow-auto rounded-md border bg-muted p-3"><div ref={containerRef} className="space-y-3" />{error ? <p className="py-12 text-center text-sm text-destructive">{error}</p> : null}</div>;
}