import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    throw redirect({ to: data.user ? "/tableau-de-bord" : "/auth", replace: true });
  },
  head: () => ({
    meta: [
      { title: "CNAC MURIMA W'ISANGI — Système intégré de gestion" },
      {
        name: "description",
        content:
          "Plateforme de gestion de CNAC MURIMA W'ISANGI : ressources humaines, membres, stock, charroi, finances et projets.",
      },
      { property: "og:title", content: "CNAC MURIMA W'ISANGI — Système intégré de gestion" },
      {
        property: "og:description",
        content: "Accès au système de gestion institutionnel de CNAC MURIMA W'ISANGI.",
      },
    ],
  }),
  component: () => null,
});
