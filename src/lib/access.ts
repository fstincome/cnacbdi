import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MODULES } from "@/lib/modules";

export type AppRole = "admin" | "gestionnaire" | "agent";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
  });
}

/** Rôles + onglets autorisés de l'utilisateur connecté. Un admin voit tout. */
export function useMyAccess() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const query = useQuery({
    queryKey: ["my-access", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const [roles, access, employe] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user!.id),
        supabase.from("user_module_access").select("module_slug").eq("user_id", user!.id),
        supabase.from("employes").select("profil_id").eq("user_id", user!.id).maybeSingle(),
      ]);
      if (roles.error) throw roles.error;
      if (access.error) throw access.error;
      const roleList = (roles.data ?? []).map((r) => r.role as AppRole);
      const isAdmin = roleList.includes("admin");
      const direct = (access.data ?? []).map((a) => a.module_slug);
      let inherited: string[] = [];
      const profilId = employe.data?.profil_id ?? null;
      if (!isAdmin && profilId) {
        const byProfil = await supabase
          .from("profil_module_access")
          .select("module_slug")
          .eq("profil_id", profilId);
        if (byProfil.error) throw byProfil.error;
        inherited = (byProfil.data ?? []).map((a) => a.module_slug);
      }
      const slugs = new Set(
        isAdmin ? MODULES.map((m) => m.slug) : [...direct, ...inherited],
      );
      return { isAdmin, roles: roleList, slugs };
    },
  });
  return {
    isAdmin: query.data?.isAdmin ?? false,
    roles: query.data?.roles ?? [],
    slugs: query.data?.slugs ?? new Set<string>(),
    isLoading: userLoading || query.isLoading,
  };
}

export type ManagedUser = {
  id: string;
  nom_complet: string | null;
  email: string | null;
  service: string | null;
  roles: AppRole[];
  slugs: string[];
};

export function useManagedUsers(enabled: boolean) {
  return useQuery({
    queryKey: ["managed-users"],
    enabled,
    queryFn: async (): Promise<ManagedUser[]> => {
      const [profiles, roles, access] = await Promise.all([
        supabase.from("profiles").select("id, nom_complet, email, service").order("email"),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("user_module_access").select("user_id, module_slug"),
      ]);
      if (profiles.error) throw profiles.error;
      if (roles.error) throw roles.error;
      if (access.error) throw access.error;
      return (profiles.data ?? []).map((p) => ({
        ...p,
        roles: (roles.data ?? [])
          .filter((r) => r.user_id === p.id)
          .map((r) => r.role as AppRole),
        slugs: (access.data ?? [])
          .filter((a) => a.user_id === p.id)
          .map((a) => a.module_slug),
      }));
    },
  });
}

export function useSetModuleAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      slug,
      allowed,
    }: {
      userId: string;
      slug: string;
      allowed: boolean;
    }) => {
      if (allowed) {
        const { error } = await supabase
          .from("user_module_access")
          .upsert({ user_id: userId, module_slug: slug }, { onConflict: "user_id,module_slug" });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_module_access")
          .delete()
          .eq("user_id", userId)
          .eq("module_slug", slug);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["managed-users"] });
      void qc.invalidateQueries({ queryKey: ["my-access"] });
    },
  });
}

export function useSetModuleAccessBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, slugs }: { userId: string; slugs: string[] }) => {
      const del = await supabase.from("user_module_access").delete().eq("user_id", userId);
      if (del.error) throw del.error;
      if (slugs.length) {
        const { error } = await supabase
          .from("user_module_access")
          .insert(slugs.map((s) => ({ user_id: userId, module_slug: s })));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["managed-users"] });
      void qc.invalidateQueries({ queryKey: ["my-access"] });
    },
  });
}

export function useSetAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, admin }: { userId: string; admin: boolean }) => {
      if (admin) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["managed-users"] });
      void qc.invalidateQueries({ queryKey: ["my-access"] });
    },
  });
}

export type ManagedProfil = {
  id: string;
  nom: string;
  fonction: string | null;
  departement: string | null;
  slugs: string[];
};

/** Profils (Département > Fonction > Profil) avec leurs rubriques accordées. */
export function useManagedProfils(enabled: boolean) {
  return useQuery({
    queryKey: ["managed-profils"],
    enabled,
    queryFn: async (): Promise<ManagedProfil[]> => {
      const [profils, access] = await Promise.all([
        supabase
          .from("profils")
          .select("id, nom, fonctions(nom, departements(nom))")
          .order("nom"),
        supabase.from("profil_module_access").select("profil_id, module_slug"),
      ]);
      if (profils.error) throw profils.error;
      if (access.error) throw access.error;
      return (profils.data ?? []).map((p) => {
        const fonction = (p as { fonctions?: { nom?: string | null; departements?: { nom?: string | null } | null } | null }).fonctions ?? null;
        return {
          id: p.id,
          nom: p.nom,
          fonction: fonction?.nom ?? null,
          departement: fonction?.departements?.nom ?? null,
          slugs: (access.data ?? [])
            .filter((a) => a.profil_id === p.id)
            .map((a) => a.module_slug),
        };
      });
    },
  });
}

export function useSetProfilModuleAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      profilId,
      slug,
      allowed,
    }: {
      profilId: string;
      slug: string;
      allowed: boolean;
    }) => {
      if (allowed) {
        const { error } = await supabase
          .from("profil_module_access")
          .upsert({ profil_id: profilId, module_slug: slug }, { onConflict: "profil_id,module_slug" });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("profil_module_access")
          .delete()
          .eq("profil_id", profilId)
          .eq("module_slug", slug);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["managed-profils"] });
      void qc.invalidateQueries({ queryKey: ["my-access"] });
    },
  });
}

export function useSetProfilModuleAccessBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ profilId, slugs }: { profilId: string; slugs: string[] }) => {
      const del = await supabase.from("profil_module_access").delete().eq("profil_id", profilId);
      if (del.error) throw del.error;
      if (slugs.length) {
        const { error } = await supabase
          .from("profil_module_access")
          .insert(slugs.map((s) => ({ profil_id: profilId, module_slug: s })));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["managed-profils"] });
      void qc.invalidateQueries({ queryKey: ["my-access"] });
    },
  });
}
