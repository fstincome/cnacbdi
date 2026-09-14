import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

/** Joint le jeton Supabase de l'utilisateur connecté à chaque appel de fonction serveur. */
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next(
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    );
  },
);
