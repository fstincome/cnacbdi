import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProjectManagementView } from "@/components/ProjectManagementView";
import { supabase } from "@/integrations/supabase/client";
import { useMyAccess } from "@/lib/access";
import { ORG_NAME } from "@/lib/modules";

const TABS = new Set(["programmes", "partenaires", "projets"]);

export const Route = createFileRoute("/projets-partenariats")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    onglet: typeof search["onglet"] === "string" && TABS.has(search["onglet"]) ? search["onglet"] : "programmes",
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({ meta: [{ title: `Projets & partenariats — ${ORG_NAME}` }, { name: "robots", content: "noindex" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { onglet } = Route.useSearch();
  const { slugs, isLoading } = useMyAccess();
  const available = ["programmes", "partenaires", "projets"].filter((slug) => slugs.has(slug));
  const active = available.includes(onglet) ? onglet : available[0];
  return <AppShell>{isLoading ? <p className="text-sm text-muted-foreground">Chargement…</p> : active ? <ProjectManagementView initialTab={active} allowedTabs={available} /> : <div className="rounded-lg border p-6"><h1 className="text-lg font-semibold">Rubrique non accessible</h1><p className="mt-2 text-sm text-muted-foreground">Demandez l’accès à Projets & partenariats à l’administrateur.</p></div>}</AppShell>;
}