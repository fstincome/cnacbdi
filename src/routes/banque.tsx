import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { BankBookView } from "@/components/BankBookView";
import { ORG_NAME } from "@/lib/modules";

const TABS = ["banque-versements", "banque-retraits", "imputations"];

export const Route = createFileRoute("/banque")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    onglet:
      typeof search["onglet"] === "string" && TABS.includes(search["onglet"])
        ? search["onglet"]
        : undefined,
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: `Livre de banque — ${ORG_NAME}` },
      {
        name: "description",
        content: "Versements, retraits et imputations comptables du livre de banque.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Livre de banque — ${ORG_NAME}` },
      {
        property: "og:description",
        content: "Versements, retraits et imputations comptables du livre de banque.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BankPage,
});

function BankPage() {
  const { onglet } = Route.useSearch();
  return (
    <AppShell>
      <BankBookView initialTab={onglet} />
    </AppShell>
  );
}
