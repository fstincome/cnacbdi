import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { ResourceView } from "@/components/ResourceView";
import { PayrollView } from "@/components/PayrollView";
import { MODULE_MAP, ORG_NAME } from "@/lib/modules";
import { useMyAccess } from "@/lib/access";


export const Route = createFileRoute("/m/$module")({
  ssr: false,
  beforeLoad: async ({ params }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    if (!MODULE_MAP[params.module]) throw notFound();
    if (["departements", "fonctions", "profils"].includes(params.module)) {
      throw redirect({ to: "/structure-profils", search: { onglet: params.module } });
    }
    if (["programmes", "partenaires", "projets"].includes(params.module)) {
      throw redirect({ to: "/projets-partenariats", search: { onglet: params.module } });
    }
    if (["banque-versements", "banque-retraits", "imputations"].includes(params.module)) {
      throw redirect({ to: "/banque", search: { onglet: params.module } });
    }
  },
  head: ({ params }) => {
    const mod = MODULE_MAP[params.module];
    const title = `${mod?.title ?? "Module"} — ${ORG_NAME}`;
    const description = mod?.description ?? `Module de gestion de ${ORG_NAME}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ModulePage,
});

function ModulePage() {
  const { module: slug } = Route.useParams();
  const mod = MODULE_MAP[slug];
  const { slugs, isLoading } = useMyAccess();
  if (!mod) return null;
  if (!isLoading && !slugs.has(slug)) {
    return (
      <AppShell>
        <div className="rounded-lg border p-6">
          <h1 className="text-lg font-semibold">Rubrique non accessible</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Vous n'avez pas l'autorisation de consulter « {mod.title} ». Demandez cet accès à
            l'administrateur du système.
          </p>
        </div>
      </AppShell>
    );
  }
  return (
    <AppShell>
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Chargement…</p>
      ) : (
        slug === "salaires" ? <PayrollView /> : <ResourceView mod={mod} />
      )}
    </AppShell>
  );
}

