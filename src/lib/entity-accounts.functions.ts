import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Niveaux communautaires pouvant disposer d'un compte de connexion (pas les membres). */
export const ACCOUNT_LEVELS = ["federations", "unions", "cooperatives", "associations", "employes"] as const;
export type AccountLevel = (typeof ACCOUNT_LEVELS)[number];

/** Onglets accordés à l'entité : son niveau et les niveaux inférieurs. */
const LEVEL_CHAIN = [
  "federations",
  "unions",
  "cooperatives",
  "associations",
  "membres",
] as const;

function generatePassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("") + "#7";
}

export const createEntityAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({ level: z.enum(ACCOUNT_LEVELS), id: z.string().uuid() })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: roleRows, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin");
    if (roleError) throw new Error(roleError.message);
    if (!roleRows?.length) throw new Error("Seul un administrateur peut créer un accès.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const employeeResult = data.level === "employes"
      ? await supabaseAdmin
          .from("employes")
          .select("id, nom, prenom, email, user_id")
          .eq("id", data.id)
          .maybeSingle()
      : null;
    const entityResult = data.level !== "employes"
      ? await supabaseAdmin
          .from(data.level)
          .select("id, nom, email, user_id")
          .eq("id", data.id)
          .maybeSingle()
      : null;
    const row = employeeResult?.data ?? entityResult?.data;
    const rowError = employeeResult?.error ?? entityResult?.error;
    if (rowError) throw new Error(rowError.message);
    if (!row) throw new Error("Fiche introuvable.");
    const email = (row as { email: string | null }).email?.trim();
    if (!email) {
      throw new Error("Renseignez d'abord l'e-mail de connexion de cette entité.");
    }
    if ((row as { user_id: string | null }).user_id) {
      return { status: "exists" as const, email, password: null };
    }

    const password = generatePassword();
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nom_complet: [(row as { nom: string }).nom, (row as { prenom?: string | null }).prenom]
          .filter(Boolean)
          .join(" "),
        niveau: data.level,
      },
    });
    let userId = created.user?.id;
    let linkedExisting = false;
    if (createError || !userId) {
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      const existing = users.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
      if (listError || !existing) {
        throw new Error(createError?.message ?? listError?.message ?? "Création du compte impossible.");
      }
      userId = existing.id;
      linkedExisting = true;
    }

    const start = LEVEL_CHAIN.indexOf(data.level as (typeof LEVEL_CHAIN)[number]);
    const slugs = data.level === "employes"
      ? ["employes", "conges", "presences", "salaires"]
      : LEVEL_CHAIN.slice(start);
    const { error: accessError } = await supabaseAdmin
      .from("user_module_access")
      .upsert(
        slugs.map((slug) => ({ user_id: userId, module_slug: slug })),
        { onConflict: "user_id,module_slug" },
      );
    if (accessError) throw new Error(accessError.message);
    const { error: linkError } = await supabaseAdmin
      .from(data.level)
      .update({ user_id: userId })
      .eq("id", data.id);
    if (linkError) throw new Error(linkError.message);

    return linkedExisting
      ? { status: "linked" as const, email, password: null }
      : { status: "created" as const, email, password };
  });
