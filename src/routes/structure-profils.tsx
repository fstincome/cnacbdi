import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { ProfileStructureView } from "@/components/ProfileStructureView";
import { ORG_NAME } from "@/lib/modules";

export const Route = createFileRoute("/structure-profils")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    onglet:
      typeof search["onglet"] === "string" && ["departements", "fonctions", "profils"].includes(search["onglet"])
        ? search["onglet"]
        : undefined,
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: `Structure des profils — ${ORG_NAME}` },
      {
        name: "description",
        content: "Gestion des départements, fonctions et profils des employés.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Structure des profils — ${ORG_NAME}` },
      {
        property: "og:description",
        content: "Gestion des départements, fonctions et profils des employés.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfileStructurePage,
});

function ProfileStructurePage() {
  const { onglet } = Route.useSearch();
  return (
    <AppShell>
      <ProfileStructureView initialTab={onglet} />
    </AppShell>
  );
}