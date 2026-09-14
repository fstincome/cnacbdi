import { useMemo, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { ORG_NAME } from "@/lib/modules";
import { formatNumber } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/statistiques")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Statistiques communautaires — CNAC MURIMA W'ISANGI" },
      {
        name: "description",
        content:
          "Graphiques et répartitions réelles des fédérations, unions, coopératives, associations et membres par niveau géographique.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Statistiques communautaires — CNAC MURIMA W'ISANGI" },
      {
        property: "og:description",
        content: "Répartition des organisations communautaires par province, commune, zone et colline.",
      },
    ],
  }),
  component: Statistiques,
});

type Row = Record<string, any>;

async function fetchAll(table: string, columns: string): Promise<Row[]> {
  const page = 1000;
  const all: Row[] = [];
  for (let from = 0; from < 8000; from += page) {
    const { data, error } = await supabase
      .from(table as never)
      .select(columns)
      .range(from, from + page - 1);
    if (error) throw error;
    const chunk = (data ?? []) as unknown as Row[];
    all.push(...chunk);
    if (chunk.length < page) break;
  }
  return all;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const TOUS = "__tous";

function Statistiques() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats-communaute"],
    queryFn: async () => {
      const [
        provinces,
        communes,
        zones,
        collines,
        federations,
        unions,
        cooperatives,
        associations,
        membres,
      ] = await Promise.all([
        fetchAll("provinces", "id, nom"),
        fetchAll("communes", "id, nom, province_id"),
        fetchAll("zones", "id, nom, commune_id"),
        fetchAll("collines", "id, nom, zone_id"),
        fetchAll("federations", "id, nom, province_id, statut, nbre_membres"),
        fetchAll("unions", "id, nom, federation_id, commune_id, statut, nbre_membres"),
        fetchAll("cooperatives", "id, nom, union_id, zone_id, statut, nbre_membres"),
        fetchAll("associations", "id, nom, cooperative_id, colline_id, statut, nbre_membres"),
        fetchAll("membres", "id, nom, prenom, sexe, statut, association_id"),
      ]);
      return {
        provinces,
        communes,
        zones,
        collines,
        federations,
        unions,
        cooperatives,
        associations,
        membres,
      };
    },
  });

  const [province, setProvince] = useState(TOUS);
  const [commune, setCommune] = useState(TOUS);
  const [zone, setZone] = useState(TOUS);
  const [colline, setColline] = useState(TOUS);

  const d = data;

  const communeOptions = useMemo(
    () => (d?.communes ?? []).filter((c) => province === TOUS || c["province_id"] === province),
    [d, province],
  );
  const zoneOptions = useMemo(() => {
    const ids = new Set(communeOptions.map((c) => c["id"]));
    return (d?.zones ?? []).filter(
      (z) => (commune === TOUS ? ids.has(z["commune_id"]) : z["commune_id"] === commune),
    );
  }, [d, communeOptions, commune]);
  const collineOptions = useMemo(() => {
    const ids = new Set(zoneOptions.map((z) => z["id"]));
    return (d?.collines ?? []).filter(
      (c) => (zone === TOUS ? ids.has(c["zone_id"]) : c["zone_id"] === zone),
    );
  }, [d, zoneOptions, zone]);

  const stats = useMemo(() => {
    const communeIds = new Set(
      commune === TOUS ? communeOptions.map((c) => c["id"]) : [commune],
    );
    const zoneIds = new Set(zone === TOUS ? zoneOptions.map((z) => z["id"]) : [zone]);
    const collineIds = new Set(
      colline === TOUS ? collineOptions.map((c) => c["id"]) : [colline],
    );

    const federations = (d?.federations ?? []).filter(
      (f) => province === TOUS || f["province_id"] === province,
    );
    const fedIds = new Set(federations.map((f) => f["id"]));
    const unions = (d?.unions ?? []).filter(
      (u) =>
        (province === TOUS || fedIds.has(u["federation_id"])) &&
        (!u["commune_id"] || communeIds.has(u["commune_id"])),
    );
    const unionIds = new Set(unions.map((u) => u["id"]));
    const cooperatives = (d?.cooperatives ?? []).filter(
      (c) => unionIds.has(c["union_id"]) && (!c["zone_id"] || zoneIds.has(c["zone_id"])),
    );
    const coopIds = new Set(cooperatives.map((c) => c["id"]));
    const associations = (d?.associations ?? []).filter(
      (a) =>
        coopIds.has(a["cooperative_id"]) && (!a["colline_id"] || collineIds.has(a["colline_id"])),
    );
    const assocIds = new Set(associations.map((a) => a["id"]));
    const membres = (d?.membres ?? []).filter((m) => assocIds.has(m["association_id"]));

    return { federations, unions, cooperatives, associations, membres };
  }, [d, province, commune, zone, colline, communeOptions, zoneOptions, collineOptions]);

  const niveaux = [
    { name: "Fédérations", value: stats.federations.length },
    { name: "Unions", value: stats.unions.length },
    { name: "Coopératives", value: stats.cooperatives.length },
    { name: "Associations", value: stats.associations.length },
    { name: "Membres", value: stats.membres.length },
  ];

  const parSexe = countBy(stats.membres, (m) =>
    m["sexe"] === "M" ? "Hommes" : m["sexe"] === "F" ? "Femmes" : (m["sexe"] ?? "Non précisé"),
  );

  const parStatut = countBy(
    [...stats.federations, ...stats.unions, ...stats.cooperatives, ...stats.associations],
    (o) => o["statut"] ?? "Non précisé",
  );

  const parProvince = useMemo(() => {
    const noms = new Map((d?.provinces ?? []).map((p) => [p["id"], p["nom"] as string]));
    const acc: Record<string, number> = {};
    for (const f of stats.federations) {
      const k = noms.get(f["province_id"]) ?? "Non rattachée";
      acc[k] = (acc[k] ?? 0) + 1;
    }
    return Object.entries(acc).map(([name, value]) => ({ name, value }));
  }, [d, stats.federations]);

  const membresParAssociation = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const a of stats.associations) acc[a["nom"] as string] = 0;
    for (const m of stats.membres) {
      const a = stats.associations.find((x) => x["id"] === m["association_id"]);
      const k = (a?.["nom"] as string) ?? "Sans association";
      acc[k] = (acc[k] ?? 0) + 1;
    }
    return Object.entries(acc)
      .map(([name, value]) => ({ name, value }))
      .sort((x, y) => y.value - x.value)
      .slice(0, 10);
  }, [stats]);

  const vide = !isLoading && niveaux.every((n) => n.value === 0);

  function reset() {
    setProvince(TOUS);
    setCommune(TOUS);
    setZone(TOUS);
    setColline(TOUS);
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {ORG_NAME}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Statistiques communautaires
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Répartition réelle des fédérations, unions, coopératives, associations et membres selon
            le niveau géographique choisi.
          </p>
        </header>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Filtre par niveau</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Filtre
              label="Province"
              value={province}
              onChange={(v) => {
                setProvince(v);
                setCommune(TOUS);
                setZone(TOUS);
                setColline(TOUS);
              }}
              items={d?.provinces ?? []}
            />
            <Filtre
              label="Commune"
              value={commune}
              onChange={(v) => {
                setCommune(v);
                setZone(TOUS);
                setColline(TOUS);
              }}
              items={communeOptions}
            />
            <Filtre
              label="Zone"
              value={zone}
              onChange={(v) => {
                setZone(v);
                setColline(TOUS);
              }}
              items={zoneOptions}
            />
            <Filtre label="Colline" value={colline} onChange={setColline} items={collineOptions} />
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={reset}>
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {niveaux.map((n) => (
            <Card key={n.name}>
              <CardContent className="pt-6">
                <p className="text-2xl font-semibold tracking-tight">{formatNumber(n.value)}</p>
                <p className="text-sm font-medium">{n.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading ? <p className="text-muted-foreground text-sm">Chargement des données…</p> : null}
        {vide ? (
          <Card>
            <CardContent className="text-muted-foreground py-10 text-center text-sm">
              Aucune organisation communautaire ne correspond à ce filtre.
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <Bloc titre="Effectifs par niveau hiérarchique">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={niveaux}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" name="Nombre" radius={[6, 6, 0, 0]}>
                  {niveaux.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Bloc>

          <Bloc titre="Membres par sexe">
            <Camembert data={parSexe} />
          </Bloc>

          <Bloc titre="Statut des organisations">
            <Camembert data={parStatut} />
          </Bloc>

          <Bloc titre="Fédérations par province">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={parProvince} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} fontSize={12} />
                <YAxis type="category" dataKey="name" width={110} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" name="Fédérations" fill={COLORS[1]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Bloc>

          <Bloc titre="Membres par association (10 premières)" pleineLargeur>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={membresParAssociation} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} interval={0} angle={-25} textAnchor="end" />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" name="Membres" fill={COLORS[3]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Bloc>
        </div>
      </div>
    </AppShell>
  );
}

function countBy(rows: Row[], key: (r: Row) => string) {
  const acc: Record<string, number> = {};
  for (const r of rows) {
    const k = key(r) || "Non précisé";
    acc[k] = (acc[k] ?? 0) + 1;
  }
  return Object.entries(acc).map(([name, value]) => ({ name, value }));
}

function Camembert({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground py-16 text-center text-sm">Aucune donnée.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={95} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Bloc({
  titre,
  children,
  pleineLargeur,
}: {
  titre: string;
  children: React.ReactNode;
  pleineLargeur?: boolean;
}) {
  return (
    <Card className={pleineLargeur ? "lg:col-span-2" : undefined}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{titre}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Filtre({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  items: Row[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value={TOUS}>Tous</SelectItem>
          {items.map((i) => (
            <SelectItem key={String(i["id"])} value={String(i["id"])}>
              {String(i["nom"])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
