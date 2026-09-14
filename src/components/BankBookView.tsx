import { useEffect, useMemo, useState } from "react";
import { Landmark } from "lucide-react";
import { MODULE_MAP } from "@/lib/modules";
import { useMyAccess } from "@/lib/access";
import { useRows } from "@/lib/data";
import { ResourceView } from "@/components/ResourceView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BANK_TABS = [
  { slug: "banque-versements", label: "Versements" },
  { slug: "banque-retraits", label: "Retraits" },
  { slug: "imputations", label: "Imputations" },
] as const;

const fbu = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} FBu`;

export function BankBookView({ initialTab }: { initialTab: string | undefined }) {
  const { slugs, isLoading } = useMyAccess();
  const availableTabs = useMemo(() => BANK_TABS.filter((t) => slugs.has(t.slug)), [slugs]);
  const [activeTab, setActiveTab] = useState<string>(initialTab ?? "banque-versements");

  const canSeeBook = slugs.has("banque-versements") || slugs.has("banque-retraits");
  const versements = useRows("banque-versements", canSeeBook);
  const retraits = useRows("banque-retraits", canSeeBook);

  useEffect(() => {
    if (!availableTabs.some((t) => t.slug === activeTab) && availableTabs[0]) {
      setActiveTab(availableTabs[0].slug);
    }
  }, [activeTab, availableTabs]);

  const totalVersements = (versements.data ?? [])
    .filter((r) => r["statut"] !== "Erronée")
    .reduce((s, r) => s + Number(r["debit"] ?? 0), 0);
  const totalRetraits = (retraits.data ?? [])
    .filter((r) => r["statut"] !== "Erronée")
    .reduce((s, r) => s + Number(r["credit"] ?? 0), 0);
  const solde = totalVersements - totalRetraits;

  if (isLoading) return <p className="text-muted-foreground text-sm">Chargement…</p>;

  if (!availableTabs.length) {
    return (
      <div className="rounded-lg border p-6">
        <h1 className="text-lg font-semibold">Rubrique non accessible</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Vous n'avez accès à aucune rubrique du livre de banque.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Landmark className="size-6" /> Livre de banque
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Versements, retraits et plan comptable. Le solde se met à jour automatiquement.
        </p>
      </header>

      {canSeeBook ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Total des versements" value={fbu(totalVersements)} />
          <Stat label="Total des retraits" value={fbu(totalRetraits)} />
          <Stat label="Solde disponible" value={fbu(solde)} accent />
        </div>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start overflow-x-auto sm:w-auto">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.slug} value={tab.slug}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {availableTabs.map((tab) => {
          const mod = MODULE_MAP[tab.slug];
          if (!mod) return null;
          return (
            <TabsContent key={tab.slug} value={tab.slug} className="mt-6">
              <ResourceView mod={mod} compactHeading />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${accent ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
