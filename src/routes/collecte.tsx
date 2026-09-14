import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ORG_NAME } from "@/lib/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/collecte")({
  head: () => ({
    meta: [
      { title: `Collecte terrain — ${ORG_NAME}` },
      {
        name: "description",
        content:
          "Formulaire public de collecte des informations communautaires par les agents de terrain.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Collecte terrain — ${ORG_NAME}` },
      { property: "og:description", content: "Formulaire public de collecte terrain." },
    ],
  }),
  component: CollectePage,
});

type GeoRow = {
  id: string;
  nom: string;
  province_id?: string | null;
  commune_id?: string | null;
  zone_id?: string | null;
};

const EMPTY = {
  nom: "",
  prenom: "",
  province_id: "",
  commune_id: "",
  zone_id: "",
  colline_id: "",
  federation: "",
  union_nom: "",
  cooperative: "",
  association: "",
  telephone: "",
  date_adhesion: "",
};

async function fetchTable(table: string): Promise<GeoRow[]> {
  const page = 1000;
  const all: GeoRow[] = [];
  for (let from = 0; from < 8000; from += page) {
    const { data, error } = await (supabase.from as any)(table)
      .select("*")
      .order("nom", { ascending: true })
      .range(from, from + page - 1);
    if (error) throw error;
    const chunk = (data ?? []) as GeoRow[];
    all.push(...chunk);
    if (chunk.length < page) break;
  }
  return all;
}

function CollectePage() {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["collecte-geo"],
    queryFn: async () => {
      const [provinces, communes, zones, collines] = await Promise.all([
        fetchTable("provinces"),
        fetchTable("communes"),
        fetchTable("zones"),
        fetchTable("collines"),
      ]);
      return { provinces, communes, zones, collines };
    },
  });

  const d = data;
  const communes = useMemo(
    () => (d?.communes ?? []).filter((r) => !form.province_id || r.province_id === form.province_id),
    [d, form.province_id],
  );
  const zones = useMemo(
    () => (d?.zones ?? []).filter((r) => !form.commune_id || r.commune_id === form.commune_id),
    [d, form.commune_id],
  );
  const collines = useMemo(
    () => (d?.collines ?? []).filter((r) => !form.zone_id || r.zone_id === form.zone_id),
    [d, form.zone_id],
  );

  function setField(name: keyof typeof EMPTY, value: string) {
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Réinitialise les niveaux enfants quand un parent change
      if (name === "province_id") next.commune_id = next.zone_id = next.colline_id = "";
      if (name === "commune_id") next.zone_id = next.colline_id = "";
      if (name === "zone_id") next.colline_id = "";
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    setSending(true);
    setError(null);
    const nameOf = (rows: GeoRow[] | undefined, id: string) =>
      rows?.find((r) => r.id === id)?.nom ?? null;
    const payload = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim() || null,
      province: nameOf(d?.provinces, form.province_id),
      commune: nameOf(d?.communes, form.commune_id),
      zone: nameOf(d?.zones, form.zone_id),
      colline: nameOf(d?.collines, form.colline_id),
      federation: form.federation.trim() || null,
      union_nom: form.union_nom.trim() || null,
      cooperative: form.cooperative.trim() || null,
      association: form.association.trim() || null,
      telephone: form.telephone.trim() || null,
      date_adhesion: form.date_adhesion || null,
    };
    const { error: err } = await (supabase.from as any)("fiches_terrain").insert(payload);
    setSending(false);
    if (err) {
      setError("L'envoi a échoué. Vérifiez votre connexion et réessayez.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <PageShell>
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Fiche envoyée avec succès</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Merci. Les informations ont été transmises à l'équipe {ORG_NAME} pour la création de la
              communauté.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setForm(EMPTY);
                setSent(false);
              }}
            >
              Envoyer une autre fiche
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ClipboardList className="size-6 text-primary" />
            <div>
              <CardTitle>Fiche de collecte terrain</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Renseignez les informations du membre et de son organisation. La localisation se
                choisit dans les listes ; les organisations se saisissent librement.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Chargement des listes…
            </p>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom *">
                <Input
                  value={form.nom}
                  onChange={(e) => setField("nom", e.target.value)}
                  required
                  maxLength={100}
                />
              </Field>
              <Field label="Prénom">
                <Input
                  value={form.prenom}
                  onChange={(e) => setField("prenom", e.target.value)}
                  maxLength={100}
                />
              </Field>

              <SelectField
                label="Province"
                value={form.province_id}
                onChange={(v) => setField("province_id", v)}
                options={d?.provinces ?? []}
              />
              <SelectField
                label="Commune"
                value={form.commune_id}
                onChange={(v) => setField("commune_id", v)}
                options={communes}
                disabled={!form.province_id}
              />
              <SelectField
                label="Zone"
                value={form.zone_id}
                onChange={(v) => setField("zone_id", v)}
                options={zones}
                disabled={!form.commune_id}
              />
              <SelectField
                label="Colline"
                value={form.colline_id}
                onChange={(v) => setField("colline_id", v)}
                options={collines}
                disabled={!form.zone_id}
              />

              <Field label="Fédération">
                <Input
                  value={form.federation}
                  onChange={(e) => setField("federation", e.target.value)}
                  maxLength={150}
                  placeholder="Nom de la fédération"
                />
              </Field>
              <Field label="Union">
                <Input
                  value={form.union_nom}
                  onChange={(e) => setField("union_nom", e.target.value)}
                  maxLength={150}
                  placeholder="Nom de l'union"
                />
              </Field>
              <Field label="Coopérative">
                <Input
                  value={form.cooperative}
                  onChange={(e) => setField("cooperative", e.target.value)}
                  maxLength={150}
                  placeholder="Nom de la coopérative"
                />
              </Field>
              <Field label="Association">
                <Input
                  value={form.association}
                  onChange={(e) => setField("association", e.target.value)}
                  maxLength={150}
                  placeholder="Nom de l'association"
                />
              </Field>

              <Field label="Téléphone">
                <Input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => setField("telephone", e.target.value)}
                  maxLength={30}
                  placeholder="+257 …"
                />
              </Field>
              <Field label="Date d'adhésion">
                <Input
                  type="date"
                  value={form.date_adhesion}
                  onChange={(e) => setField("date_adhesion", e.target.value)}
                />
              </Field>

              {error ? <p className="text-sm text-destructive sm:col-span-2">{error}</p> : null}

              <div className="sm:col-span-2">
                <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Envoyer la fiche
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="text-center">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {ORG_NAME}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Collecte des informations</h1>
        </header>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: GeoRow[];
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <select
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">— Sélectionner —</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nom}
          </option>
        ))}
      </select>
    </div>
  );
}
