import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness, CalendarDays, CheckCircle2, FileText, MoreHorizontal, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MODULE_MAP } from "@/lib/modules";
import { formatMoney, formatValue, rowLabel, useRows, useSaveRow, type Row } from "@/lib/data";
import { ResourceView } from "@/components/ResourceView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const PROJECT_TABS = [
  { slug: "programmes", label: "Programmes" },
  { slug: "partenaires", label: "Partenaires" },
  { slug: "projets", label: "Projets" },
] as const;

const PROGRAMMES_MODULE = MODULE_MAP["programmes"]!;
const PARTENAIRES_MODULE = MODULE_MAP["partenaires"]!;
const EMPLOYES_MODULE = MODULE_MAP["employes"]!;

export function ProjectManagementView({ initialTab = "programmes", allowedTabs = PROJECT_TABS.map((tab) => tab.slug) }: { initialTab?: string; allowedTabs?: string[] }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => setActiveTab(initialTab), [initialTab]);
  const visibleTabs = PROJECT_TABS.filter((tab) => allowedTabs.includes(tab.slug));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <BriefcaseBusiness className="size-6" /> Projets & partenariats
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Structurez les programmes, partenaires et projets, puis suivez les équipes, activités et budgets.
        </p>
      </header>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start overflow-x-auto sm:w-auto">
          {visibleTabs.map((tab) => <TabsTrigger key={tab.slug} value={tab.slug}>{tab.label}</TabsTrigger>)}
        </TabsList>
        {allowedTabs.includes("programmes") ? <TabsContent value="programmes" className="mt-6">
          <ResourceView mod={PROGRAMMES_MODULE} compactHeading />
        </TabsContent> : null}
        {allowedTabs.includes("partenaires") ? <TabsContent value="partenaires" className="mt-6">
          <ResourceView mod={PARTENAIRES_MODULE} compactHeading />
        </TabsContent> : null}
        {allowedTabs.includes("projets") ? <TabsContent value="projets" className="mt-6"><ProjectsPanel /></TabsContent> : null}
      </Tabs>
    </div>
  );
}

function ProjectsPanel() {
  const { data: projects = [], isLoading } = useRows("projets");
  const { data: programmes = [] } = useRows("programmes");
  const { data: partenaires = [] } = useRows("partenaires");
  const { data: employes = [] } = useRows("employes");
  const save = useSaveRow("projets");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [file, setFile] = useState<File | null>(null);
  const [detail, setDetail] = useState<Row | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((project) => [project.titre, project.statut, project.objectifs].some((value) => String(value ?? "").toLowerCase().includes(term)));
  }, [projects, query]);

  const refName = (rows: Row[], id: unknown, slug: "programmes" | "partenaires" | "employes") => {
    const mod = MODULE_MAP[slug];
    return mod ? rowLabel(mod, rows.find((row) => row.id === id)) : "—";
  };

  function openForm(project: Row = {}) {
    setEditing(project);
    setForm({ statut: "À venir", budget: 0, ...project });
    setFile(null);
  }

  async function submitProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const required = ["titre", "programme_id", "partenaire_id", "chef_projet_id", "objectifs", "description", "date_debut", "date_fin"];
    if (required.some((field) => !String(form[field] ?? "").trim())) {
      toast.error("Complétez tous les champs obligatoires.");
      return;
    }
    if (String(form.date_fin) < String(form.date_debut)) {
      toast.error("La date de fin doit être postérieure à la date de début.");
      return;
    }
    if (!editing?.id && !file) {
      toast.error("Le document du projet est obligatoire.");
      return;
    }
    try {
      let fichierPath = form.fichier_path ?? null;
      if (file) {
        if (file.size > 20 * 1024 * 1024) throw new Error("Le document dépasse la limite de 20 Mo.");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${editing?.id ?? crypto.randomUUID()}/projet/${Date.now()}-${safeName}`;
        const { error } = await supabase.storage.from("documents-projets").upload(path, file);
        if (error) throw error;
        fichierPath = path;
      }
      await save.mutateAsync({ ...form, fichier_path: fichierPath, responsable: null, zone: null, avancement: 0 });
      toast.success(editing?.id ? "Projet mis à jour." : "Projet créé.");
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.");
    }
  }

  async function openDocument(path: unknown): Promise<void> {
    if (typeof path !== "string" || !path) return;
    const { data, error } = await supabase.storage.from("documents-projets").createSignedUrl(path, 120);
    if (error) {
      toast.error("Document inaccessible.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function closeProject(project: Row) {
    if (!window.confirm(`Clôturer le projet « ${project.titre} » ?`)) return;
    try {
      await save.mutateAsync({ ...project, statut: "Clôturé" });
      toast.success("Projet clôturé.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Clôture impossible.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-lg font-semibold">Projets</h2><p className="mt-1 text-sm text-muted-foreground">Chaque projet centralise son équipe, ses activités et son budget.</p></div>
        <Button onClick={() => openForm()}><Plus className="mr-2 size-4" /> Nouveau projet</Button>
      </div>
      <div className="rounded-lg border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <div className="relative min-w-56 flex-1"><Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un projet…" className="pl-9" /></div>
          <Badge variant="secondary">{filtered.length} projet(s)</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table><TableHeader><TableRow><TableHead>Projet</TableHead><TableHead>Programme</TableHead><TableHead>Partenaire</TableHead><TableHead>Chef de projet</TableHead><TableHead>Budget restant</TableHead><TableHead>Statut</TableHead><TableHead className="w-16" /></TableRow></TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={7} className="py-10 text-center">Chargement…</TableCell></TableRow> : filtered.length === 0 ? <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">Aucun projet enregistré.</TableCell></TableRow> : filtered.map((project) => (
                <TableRow key={project.id}>
                  <TableCell><button className="text-left font-medium hover:underline" onClick={() => setDetail(project)}>{project.titre}</button><span className="block text-xs text-muted-foreground">{formatValue(project.date_debut)} — {formatValue(project.date_fin)}</span></TableCell>
                  <TableCell>{refName(programmes, project.programme_id, "programmes")}</TableCell>
                  <TableCell>{refName(partenaires, project.partenaire_id, "partenaires")}</TableCell>
                  <TableCell>{refName(employes, project.chef_projet_id, "employes")}</TableCell>
                  <TableCell><span className="font-medium">{formatMoney(Number(project.budget_restant ?? project.budget ?? 0))}</span><span className="block text-xs text-muted-foreground">sur {formatMoney(Number(project.budget ?? 0))}</span></TableCell>
                  <TableCell><Badge variant="outline">{project.statut}</Badge></TableCell>
                  <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Actions du projet"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setDetail(project)}><Users /> Participants et activités</DropdownMenuItem><DropdownMenuItem onClick={() => openForm(project)}>Modifier le projet</DropdownMenuItem>{project.fichier_path ? <DropdownMenuItem onClick={() => openDocument(project.fichier_path)}><FileText /> Voir le document</DropdownMenuItem> : null}{project.statut !== "Clôturé" ? <DropdownMenuItem onClick={() => closeProject(project)}><CheckCircle2 /> Clôturer</DropdownMenuItem> : null}</DropdownMenuContent></DropdownMenu></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{editing?.id ? "Modifier le projet" : "Nouveau projet"}</DialogTitle><DialogDescription>Rattachez le projet à son programme, son partenaire et son chef de projet.</DialogDescription></DialogHeader>
        <form onSubmit={submitProject} className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nom du projet" value={form.titre} onChange={(value) => setForm((current) => ({ ...current, titre: value }))} required />
          <SelectField label="Statut" value={form.statut} onChange={(value) => setForm((current) => ({ ...current, statut: value }))} items={["À venir", "En cours", "Terminé", "Suspendu", "Clôturé"].map((value) => ({ value, label: value }))} />
          <SelectField label="Programme" value={form.programme_id} onChange={(value) => setForm((current) => ({ ...current, programme_id: value }))} items={programmes.map((row) => ({ value: row.id, label: rowLabel(PROGRAMMES_MODULE, row) }))} />
          <SelectField label="Partenaire" value={form.partenaire_id} onChange={(value) => setForm((current) => ({ ...current, partenaire_id: value }))} items={partenaires.map((row) => ({ value: row.id, label: rowLabel(PARTENAIRES_MODULE, row) }))} />
          <SelectField label="Chef du projet" value={form.chef_projet_id} onChange={(value) => setForm((current) => ({ ...current, chef_projet_id: value }))} items={employes.map((row) => ({ value: row.id, label: rowLabel(EMPLOYES_MODULE, row) }))} />
          <TextField label="Budget initial (FBu)" type="number" value={form.budget} onChange={(value) => setForm((current) => ({ ...current, budget: Number(value) }))} required />
          <TextField label="Date de début" type="date" value={form.date_debut} onChange={(value) => setForm((current) => ({ ...current, date_debut: value }))} required />
          <TextField label="Date de fin" type="date" value={form.date_fin} onChange={(value) => setForm((current) => ({ ...current, date_fin: value }))} required />
          <div className="space-y-2 sm:col-span-2"><Label>Objectifs *</Label><Textarea value={String(form.objectifs ?? "")} onChange={(event) => setForm((current) => ({ ...current, objectifs: event.target.value }))} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Description *</Label><Textarea value={String(form.description ?? "")} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Document du projet {!editing?.id ? "*" : ""}</Label><Input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /><p className="text-xs text-muted-foreground">20 Mo maximum.</p></div>
          <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setEditing(null)}>Annuler</Button><Button type="submit" disabled={save.isPending}>Enregistrer</Button></DialogFooter>
        </form>
      </DialogContent></Dialog>

      {detail ? <ProjectDetail project={detail} employes={employes} onClose={() => setDetail(null)} /> : null}
    </div>
  );
}

function ProjectDetail({ project, employes, onClose }: { project: Row; employes: Row[]; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [participantId, setParticipantId] = useState("");
  const [activity, setActivity] = useState<Row>({ responsable_id: "", activite: "", budget: 0, date_debut: project.date_debut, date_fin: project.date_fin });
  const [engagement, setEngagement] = useState<File | null>(null);
  const participantsQuery = useQuery({ queryKey: ["project-participants", project.id], queryFn: async () => { const { data, error } = await supabase.from("projet_participants").select("*").eq("projet_id", project.id).order("date_attribution"); if (error) throw error; return data as Row[]; } });
  const activitiesQuery = useQuery({ queryKey: ["project-activities", project.id], queryFn: async () => { const { data, error } = await supabase.from("projet_activites").select("*").eq("projet_id", project.id).order("date_debut"); if (error) throw error; return data as Row[]; } });
  const participants = participantsQuery.data ?? [];
  const activities = activitiesQuery.data ?? [];
  const participantEmployees = participants.map((item) => employes.find((employee) => employee.id === item.employe_id)).filter((item): item is Row => Boolean(item));
  const remaining = Math.max(0, Number(project.budget ?? 0) - activities.reduce((sum, item) => sum + Number(item.budget ?? 0), 0));

  async function addParticipant(): Promise<void> {
    if (!participantId) {
      toast.error("Sélectionnez un participant.");
      return;
    }
    const { error } = await supabase.from("projet_participants").insert({ projet_id: project.id, employe_id: participantId });
    if (error) {
      toast.error(error.code === "23505" ? "Cet employé participe déjà au projet." : error.message);
      return;
    }
    setParticipantId("");
    await queryClient.invalidateQueries({ queryKey: ["project-participants", project.id] });
    toast.success("Participant affecté.");
  }

  async function removeParticipant(id: string): Promise<void> {
    const { error } = await supabase.from("projet_participants").delete().eq("id", id);
    if (error) {
      toast.error("Ce participant est encore responsable d’une activité.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["project-participants", project.id] });
  }

  async function addActivity(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!activity.responsable_id || !String(activity.activite ?? "").trim() || !activity.date_debut || !activity.date_fin) {
      toast.error("Complétez les informations de l’activité.");
      return;
    }
    if (Number(activity.budget) > remaining) {
      toast.error("Le budget alloué dépasse le budget restant du projet.");
      return;
    }
    if (String(activity.date_debut) < String(project.date_debut) || String(activity.date_fin) > String(project.date_fin) || String(activity.date_fin) < String(activity.date_debut)) {
      toast.error("La période de l’activité doit rester dans celle du projet.");
      return;
    }
    try {
      let engagementPath: string | null = null;
      if (engagement) {
        const safeName = engagement.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        engagementPath = `${project.id}/activites/${Date.now()}-${safeName}`;
        const { error } = await supabase.storage.from("documents-projets").upload(engagementPath, engagement);
        if (error) throw error;
      }
      const { error } = await supabase.from("projet_activites").insert({ projet_id: project.id, responsable_id: activity.responsable_id, activite: activity.activite, budget: Number(activity.budget), date_debut: activity.date_debut, date_fin: activity.date_fin, engagement_path: engagementPath });
      if (error) throw error;
      setActivity({ responsable_id: "", activite: "", budget: 0, date_debut: project.date_debut, date_fin: project.date_fin });
      setEngagement(null);
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["project-activities", project.id] }), queryClient.invalidateQueries({ queryKey: ["rows", "projets"] })]);
      toast.success("Activité ajoutée.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Ajout impossible."); }
  }

  const employeeName = (id: unknown) => rowLabel(EMPLOYES_MODULE, employes.find((row) => row.id === id));
  const activityStatus = (row: Row) => { const today = new Date().toISOString().slice(0, 10); return today < row.date_debut ? "En attente" : today > row.date_fin ? "Terminée" : "En cours"; };

  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl"><DialogHeader><DialogTitle>{project.titre}</DialogTitle><DialogDescription>{formatValue(project.date_debut)} au {formatValue(project.date_fin)} · Chef de projet : {employeeName(project.chef_projet_id)}</DialogDescription></DialogHeader>
    <div className="grid gap-3 sm:grid-cols-3"><Metric label="Budget initial" value={formatMoney(Number(project.budget ?? 0))} /><Metric label="Budget engagé" value={formatMoney(Number(project.budget ?? 0) - remaining)} /><Metric label="Budget restant" value={formatMoney(remaining)} /></div>
    <Tabs defaultValue="participants"><TabsList><TabsTrigger value="participants"><Users className="mr-2 size-4" />Participants</TabsTrigger><TabsTrigger value="activites"><CalendarDays className="mr-2 size-4" />Activités</TabsTrigger></TabsList>
      <TabsContent value="participants" className="mt-4 space-y-4"><div className="flex flex-col gap-2 sm:flex-row"><Select value={participantId} onValueChange={setParticipantId}><SelectTrigger className="flex-1"><SelectValue placeholder="Sélectionner un employé" /></SelectTrigger><SelectContent>{employes.filter((employee) => !participants.some((item) => item.employe_id === employee.id)).map((employee) => <SelectItem key={employee.id} value={employee.id}>{rowLabel(EMPLOYES_MODULE, employee)}</SelectItem>)}</SelectContent></Select><Button type="button" onClick={addParticipant}><Plus className="mr-2 size-4" />Affecter</Button></div>
        <div className="rounded-lg border"><Table><TableHeader><TableRow><TableHead>Participant</TableHead><TableHead>Date d’attribution</TableHead><TableHead className="w-24" /></TableRow></TableHeader><TableBody>{participants.length ? participants.map((item) => <TableRow key={item.id}><TableCell>{employeeName(item.employe_id)}</TableCell><TableCell>{formatValue(String(item.date_attribution ?? "").slice(0, 10))}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeParticipant(item.id)}>Retirer</Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">Aucun participant affecté.</TableCell></TableRow>}</TableBody></Table></div>
      </TabsContent>
      <TabsContent value="activites" className="mt-4 space-y-5"><form onSubmit={addActivity} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3"><TextField label="Activité" value={activity.activite} onChange={(value) => setActivity((current) => ({ ...current, activite: value }))} required /><SelectField label="Responsable" value={activity.responsable_id} onChange={(value) => setActivity((current) => ({ ...current, responsable_id: value }))} items={participantEmployees.map((employee) => ({ value: employee.id, label: rowLabel(EMPLOYES_MODULE, employee) }))} /><TextField label="Budget alloué (FBu)" type="number" value={activity.budget} onChange={(value) => setActivity((current) => ({ ...current, budget: Number(value) }))} required /><TextField label="Date de début" type="date" value={activity.date_debut} onChange={(value) => setActivity((current) => ({ ...current, date_debut: value }))} required /><TextField label="Date de fin" type="date" value={activity.date_fin} onChange={(value) => setActivity((current) => ({ ...current, date_fin: value }))} required /><div className="space-y-2"><Label>Engagement</Label><Input type="file" onChange={(event) => setEngagement(event.target.files?.[0] ?? null)} /></div><div className="sm:col-span-2 lg:col-span-3"><Button type="submit" disabled={!participantEmployees.length}><Plus className="mr-2 size-4" />Ajouter l’activité</Button>{!participantEmployees.length ? <p className="mt-2 text-xs text-muted-foreground">Affectez d’abord un participant au projet.</p> : null}</div></form>
        <div className="rounded-lg border"><Table><TableHeader><TableRow><TableHead>Activité</TableHead><TableHead>Responsable</TableHead><TableHead>Période</TableHead><TableHead>Budget</TableHead><TableHead>État</TableHead></TableRow></TableHeader><TableBody>{activities.length ? activities.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.activite}</TableCell><TableCell>{employeeName(item.responsable_id)}</TableCell><TableCell>{formatValue(item.date_debut)} — {formatValue(item.date_fin)}</TableCell><TableCell>{formatMoney(Number(item.budget ?? 0))}</TableCell><TableCell><Badge variant="outline">{activityStatus(item)}</Badge></TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Aucune activité enregistrée.</TableCell></TableRow>}</TableBody></Table></div>
      </TabsContent>
    </Tabs>
  </DialogContent></Dialog>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }

function TextField({ label, value, onChange, type = "text", required = false }: { label: string; value: unknown; onChange: (value: string) => void; type?: string; required?: boolean }) { return <div className="space-y-2"><Label>{label}{required ? " *" : ""}</Label><Input type={type} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} /></div>; }

function SelectField({ label, value, onChange, items }: { label: string; value: unknown; onChange: (value: string) => void; items: { value: string; label: string }[] }) { return <div className="space-y-2"><Label>{label} *</Label><Select value={String(value ?? "")} onValueChange={onChange}><SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger><SelectContent>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>; }