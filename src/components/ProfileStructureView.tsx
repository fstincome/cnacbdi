import { useEffect, useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { MODULE_MAP } from "@/lib/modules";
import { useMyAccess } from "@/lib/access";
import { ResourceView } from "@/components/ResourceView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STRUCTURE_TABS = [
  { slug: "departements", label: "Départements" },
  { slug: "fonctions", label: "Fonctions" },
  { slug: "profils", label: "Profils" },
] as const;

export function ProfileStructureView({ initialTab }: { initialTab: string | undefined }) {
  const { slugs, isLoading } = useMyAccess();
  const availableTabs = useMemo(
    () => STRUCTURE_TABS.filter((tab) => slugs.has(tab.slug)),
    [slugs],
  );
  const [activeTab, setActiveTab] = useState<string>(initialTab ?? "departements");

  useEffect(() => {
    if (!availableTabs.some((tab) => tab.slug === activeTab) && availableTabs[0]) {
      setActiveTab(availableTabs[0].slug);
    }
  }, [activeTab, availableTabs]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  if (!availableTabs.length) {
    return (
      <div className="rounded-lg border p-6">
        <h1 className="text-lg font-semibold">Rubrique non accessible</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vous n'avez accès à aucun niveau de la structure des profils.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Building2 className="size-6" /> Structure des profils
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organisez les affectations des employés par département, fonction et profil.
        </p>
      </header>

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