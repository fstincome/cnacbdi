import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  BarChart3,
  Boxes,
  CalendarClock,
  Car,
  ClipboardList,
  FolderKanban,
  Fuel,
  Handshake,
  ListChecks,
  PackageX,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { ORG_NAME } from "@/lib/modules";
import { formatMoney, formatNumber } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/tableau-de-bord")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Tableau de bord — CNAC MURIMA W'ISANGI" },
      {
        name: "description",
        content:
          "Indicateurs opérationnels de CNAC MURIMA W'ISANGI : stock, carburant, charroi et alertes prioritaires.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Tableau de bord — CNAC MURIMA W'ISANGI" },
      {
        property: "og:description",
        content: "Pilotage du stock, du carburant, du charroi et des alertes.",
      },
    ],
  }),
  component: Dashboard,
});

type Article = {
  designation: string;
  quantite_stock: number | null;
  seuil_alerte: number | null;
  prix_unitaire: number | null;
  magasin: string | null;
};

function monthKey(d: string) {
  return d.slice(0, 7);
}

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [articles, carburant, vehicules, entretiens, fiches] = await Promise.all([
        supabase
          .from("articles")
          .select("designation, quantite_stock, seuil_alerte, prix_unitaire, magasin"),
        supabase.from("carburant").select("date_service, litres, prix_total, station, vehicule_id"),
        supabase
          .from("vehicules")
          .select("id, immatriculation, marque, statut, kilometrage, chauffeur"),
        supabase.from("entretiens").select("vehicule_id, date_entretien, nature, statut, cout"),
        (supabase.from as any)("fiches_terrain").select("province, federation"),
      ]);
      return {
        articles: (articles.data ?? []) as Article[],
        carburant: carburant.data ?? [],
        vehicules: vehicules.data ?? [],
        entretiens: entretiens.data ?? [],
        fiches: (fiches.data ?? []) as { province: string | null; federation: string | null }[],
      };
    },
  });

  const articles = data?.articles ?? [];
  const carburant = data?.carburant ?? [];
  const vehicules = data?.vehicules ?? [];
  const entretiens = data?.entretiens ?? [];
  const fiches = data?.fiches ?? [];
  const vide =
    !isLoading &&
    articles.length === 0 &&
    carburant.length === 0 &&
    vehicules.length === 0 &&
    entretiens.length === 0;

  const valeurStock = articles.reduce(
    (s, a) => s + Number(a.quantite_stock ?? 0) * Number(a.prix_unitaire ?? 0),
    0,
  );
  const ruptures = articles.filter((a) => Number(a.quantite_stock ?? 0) <= 0);
  const sousSeuil = articles.filter(
    (a) => Number(a.quantite_stock ?? 0) > 0 && Number(a.quantite_stock ?? 0) <= Number(a.seuil_alerte ?? 0),
  );

  const now = new Date();
  const moisCourant = now.toISOString().slice(0, 7);
  const carbMois = carburant.filter((c) => monthKey(String(c.date_service ?? "")) === moisCourant);
  const litresMois = carbMois.reduce((s, c) => s + Number(c.litres ?? 0), 0);
  const depenseMois = carbMois.reduce((s, c) => s + Number(c.prix_total ?? 0), 0);

  const parStation = Object.entries(
    carburant.reduce<Record<string, number>>((acc, c) => {
      const k = c.station || "Dépôt non précisé";
      acc[k] = (acc[k] ?? 0) + Number(c.litres ?? 0);
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const derniers6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const rows = carburant.filter((c) => monthKey(String(c.date_service ?? "")) === key);
    return {
      key,
      label: d.toLocaleDateString("fr-FR", { month: "short" }),
      litres: rows.reduce((s, c) => s + Number(c.litres ?? 0), 0),
      montant: rows.reduce((s, c) => s + Number(c.prix_total ?? 0), 0),
    };
  });
  const maxLitres = Math.max(1, ...derniers6.map((m) => m.litres));

  const aEntretenir = vehicules.filter(
    (v) => v.statut === "En entretien" || v.statut === "Immobilisé",
  );
  const entretiensOuverts = entretiens.filter(
    (e) => e.statut === "Planifié" || e.statut === "En cours",
  );

  const alertes = [
    ...ruptures.map((a) => ({
      niveau: "critique" as const,
      titre: `Rupture de stock : ${a.designation}`,
      detail: a.magasin ? `Magasin ${a.magasin}` : "Magasin non précisé",
      to: "articles",
    })),
    ...sousSeuil.map((a) => ({
      niveau: "attention" as const,
      titre: `Stock bas : ${a.designation}`,
      detail: `${formatNumber(Number(a.quantite_stock ?? 0))} restant(s) / seuil ${formatNumber(Number(a.seuil_alerte ?? 0))}`,
      to: "articles",
    })),
    ...aEntretenir.map((v) => ({
      niveau: "attention" as const,
      titre: `Véhicule indisponible : ${v.immatriculation}`,
      detail: `${v.marque ?? ""} — ${v.statut}`.trim(),
      to: "vehicules",
    })),
    ...entretiensOuverts.map((e) => ({
      niveau: "info" as const,
      titre: `Entretien à clôturer : ${e.nature ?? "intervention"}`,
      detail: `Prévu le ${String(e.date_entretien ?? "").split("-").reverse().join("/")}`,
      to: "entretiens",
    })),
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {ORG_NAME}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Tableau de bord opérationnel
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Stock, carburant, charroi et alertes prioritaires en temps réel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Shortcut to="articles" label="Stock" icon={Boxes} />
            <Shortcut to="carburant" label="Carburant" icon={Fuel} />
            <Shortcut to="vehicules" label="Véhicules" icon={Car} />
            <Button asChild variant="outline" size="sm">
              <Link to="/rapports">
                <BarChart3 className="mr-2 size-4" /> Rapports
              </Link>
            </Button>
          </div>
        </header>

        {vide ? (
          <Card>
            <CardContent className="py-12 text-center">
              <PackageX className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">Aucune donnée enregistrée pour le moment</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Les indicateurs s'afficheront dès que les articles, bons de carburant et véhicules
                seront saisis ou importés depuis l'ancien système.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Shortcut to="articles" label="Saisir un article" icon={Boxes} />
                <Shortcut to="vehicules" label="Saisir un véhicule" icon={Car} />
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            icon={Boxes}
            label="Valeur du stock"
            value={formatMoney(valeurStock)}
            hint={`${articles.length} article(s) au catalogue`}
          />
          <Kpi
            icon={AlertTriangle}
            label="Sous seuil / rupture"
            value={`${sousSeuil.length} / ${ruptures.length}`}
            hint="Articles à réapprovisionner"
            tone={ruptures.length > 0 ? "danger" : sousSeuil.length > 0 ? "warn" : "ok"}
          />
          <Kpi
            icon={Fuel}
            label="Carburant du mois"
            value={`${formatNumber(litresMois)} L`}
            hint={`Dépense : ${formatMoney(depenseMois)}`}
          />
          <Kpi
            icon={Wrench}
            label="Véhicules à entretenir"
            value={String(aEntretenir.length + entretiensOuverts.length)}
            hint={`${vehicules.length} véhicule(s) au parc`}
            tone={aEntretenir.length > 0 ? "warn" : "ok"}
          />
          <Kpi
            icon={ClipboardList}
            label="Fiches terrain reçues"
            value={String(fiches.length)}
            hint="Via le formulaire public de collecte"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Consommation de carburant — 6 derniers mois</CardTitle>
            </CardHeader>
            <CardContent>
              {carburant.length === 0 ? (
                <Empty text="Aucun bon de carburant enregistré." />
              ) : (
                <div className="flex h-48 items-end gap-3">
                  {derniers6.map((m) => (
                    <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {m.litres > 0 ? formatNumber(m.litres) : ""}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-primary/80"
                        style={{ height: `${Math.max(4, (m.litres / maxLitres) * 140)}px` }}
                        title={`${formatNumber(m.litres)} L — ${formatMoney(m.montant)}`}
                      />
                      <span className="text-xs text-muted-foreground capitalize">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Carburant par dépôt / station</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {parStation.length === 0 ? (
                <Empty text="Aucun dépôt renseigné." />
              ) : (
                parStation.slice(0, 6).map(([station, litres]) => (
                  <div key={station} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate">{station}</span>
                      <span className="font-medium">{formatNumber(litres)} L</span>
                    </div>
                    <Progress value={(litres / (parStation[0]?.[1] || 1)) * 100} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Alertes prioritaires</CardTitle>
            <Badge variant={alertes.length ? "destructive" : "secondary"}>
              {alertes.length} alerte(s)
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertes.length === 0 ? (
              <Empty text="Aucune alerte active. Les seuils de stock et le charroi sont conformes." />
            ) : (
              alertes.slice(0, 10).map((a, i) => (
                <Link
                  key={`${a.titre}-${i}`}
                  to="/m/$module"
                  params={{ module: a.to }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.titre}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant={
                        a.niveau === "critique"
                          ? "destructive"
                          : a.niveau === "attention"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {a.niveau === "critique"
                        ? "Critique"
                        : a.niveau === "attention"
                          ? "Attention"
                          : "Info"}
                    </Badge>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone = "ok",
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
  hint: string;
  tone?: "ok" | "warn" | "danger";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Icon
            className={
              tone === "danger"
                ? "size-5 text-destructive"
                : tone === "warn"
                  ? "size-5 text-chart-5"
                  : "size-5 text-primary"
            }
          />
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function Shortcut({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: typeof Boxes;
}) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to="/m/$module" params={{ module: to }}>
        <Icon className="mr-2 size-4" />
        {label}
      </Link>
    </Button>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{text}</p>;
}
