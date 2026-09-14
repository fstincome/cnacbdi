import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { formatMoney, formatNumber } from "@/lib/data";
import { ORG_NAME } from "@/lib/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/rapports")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Rapports & statistiques — CNAC MURIMA W'ISANGI" },
      {
        name: "description",
        content:
          "Synthèses budgétaires, effectifs, carburant, cotisations et projets de CNAC MURIMA W'ISANGI.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Rapports & statistiques — CNAC MURIMA W'ISANGI" },
      { property: "og:description", content: "Indicateurs consolidés des modules de gestion." },
    ],
  }),
  component: Rapports,
});

function Rapports() {
  const { data } = useQuery({
    queryKey: ["rapports"],
    queryFn: async () => {
      const [budgets, employes, salaires, detailsPaie, carburant, membres, projets] = await Promise.all([
        supabase.from("budgets").select("intitule, exercice, montant_prevu, montant_realise"),
        supabase.from("employes").select("id, service, statut"),
        supabase.from("salaires").select("employe_id"),
        supabase.from("details_paie").select("employe_id, salaire_net"),
        supabase.from("carburant").select("litres, prix_total"),
        supabase.from("membres").select("sexe"),
        supabase.from("projets").select("titre, budget, avancement, statut"),
      ]);
      return {
        budgets: budgets.data ?? [],
        employes: employes.data ?? [],
        salaires: salaires.data ?? [],
        detailsPaie: detailsPaie.data ?? [],
        carburant: carburant.data ?? [],
        membres: membres.data ?? [],
        projets: projets.data ?? [],
      };
    },
  });

  const employes = data?.employes ?? [];
  const netParEmploye = new Map((data?.detailsPaie ?? []).map((d) => [d.employe_id, Number(d.salaire_net)]));
  const parService = Object.entries(
    employes.reduce<Record<string, { n: number; masse: number }>>((acc, e) => {
      const key = e.service || "Non affecté";
      acc[key] = {
        n: (acc[key]?.n ?? 0) + 1,
        masse: (acc[key]?.masse ?? 0) + (netParEmploye.get(e.id) ?? 0),
      };
      return acc;
    }, {}),
  );

  const litres = (data?.carburant ?? []).reduce((s, c) => s + Number(c.litres ?? 0), 0);
  const coutCarburant = (data?.carburant ?? []).reduce((s, c) => s + Number(c.prix_total ?? 0), 0);
  const femmes = (data?.membres ?? []).filter((m) => m.sexe === "F").length;

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {ORG_NAME}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Rapports & statistiques
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Indicateurs consolidés issus des modules de gestion.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Effectif total" value={String(employes.length)} />
          <Stat
            label="Salaires nets à payer"
            value={formatMoney((data?.detailsPaie ?? []).reduce((s, d) => s + Number(d.salaire_net ?? 0), 0))}
          />
          <Stat label="Carburant consommé" value={`${formatNumber(litres)} L`} />
          <Stat label="Coût carburant" value={formatMoney(coutCarburant)} />
          <Stat label="Membres — femmes" value={`${femmes}/${(data?.membres ?? []).length}`} />
          <Stat
            label="Projets en cours"
            value={String((data?.projets ?? []).filter((p) => p.statut === "En cours").length)}
          />
          <Stat
            label="Budget projets"
            value={formatMoney((data?.projets ?? []).reduce((s, p) => s + Number(p.budget ?? 0), 0))}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Effectifs et salaires nets par service</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Effectif</TableHead>
                    <TableHead className="text-right">Salaires nets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parService.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                        Aucun employé enregistré.
                      </TableCell>
                    </TableRow>
                  ) : (
                    parService.map(([service, v]) => (
                      <TableRow key={service}>
                        <TableCell>{service}</TableCell>
                        <TableCell className="text-right">{v.n}</TableCell>
                        <TableCell className="text-right">{formatMoney(v.masse)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exécution budgétaire</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ligne budgétaire</TableHead>
                    <TableHead>Exercice</TableHead>
                    <TableHead className="text-right">Prévu</TableHead>
                    <TableHead className="text-right">Réalisé</TableHead>
                    <TableHead className="text-right">Taux</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.budgets ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        Aucune ligne budgétaire enregistrée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (data?.budgets ?? []).map((b) => {
                      const prevu = Number(b.montant_prevu ?? 0);
                      const realise = Number(b.montant_realise ?? 0);
                      return (
                        <TableRow key={`${b.intitule}-${b.exercice}`}>
                          <TableCell>{b.intitule}</TableCell>
                          <TableCell>{b.exercice}</TableCell>
                          <TableCell className="text-right">{formatMoney(prevu)}</TableCell>
                          <TableCell className="text-right">{formatMoney(realise)}</TableCell>
                          <TableCell className="text-right">
                            {prevu > 0 ? `${Math.round((realise / prevu) * 100)} %` : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
