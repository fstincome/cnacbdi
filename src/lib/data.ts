import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ModuleDef } from "@/lib/modules";
import { MODULE_MAP } from "@/lib/modules";

export type Row = Record<string, any> & {
  id?: any;
  titre?: any;
  statut?: any;
  objectifs?: any;
  description?: any;
  programme_id?: any;
  partenaire_id?: any;
  chef_projet_id?: any;
  fichier_path?: any;
  budget?: any;
  budget_depense?: any;
  budget_restant?: any;
  date_debut?: any;
  date_fin?: any;
  date_attribution?: any;
  employe_id?: any;
  responsable_id?: any;
  activite?: any;
  engagement_path?: any;
};

export function useRows(slug: string, enabled = true) {
  const mod = MODULE_MAP[slug];
  return useQuery({
    queryKey: ["rows", slug],
    enabled: enabled && !!mod,
    queryFn: async () => {
      const page = 1000;
      const all: Row[] = [];
      for (let from = 0; from < 6000; from += page) {
        let request = supabase
          .from(mod!.table as never)
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, from + page - 1);
        for (const [column, value] of Object.entries(mod!.filters ?? {})) {
          request = request.eq(column, value);
        }
        const { data, error } = await request;
        if (error) throw error;
        const chunk = (data ?? []) as Row[];
        all.push(...chunk);
        if (chunk.length < page) break;
      }
      return all;
    },

  });
}

export function useSaveRow(slug: string) {
  const mod = MODULE_MAP[slug];
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row) => {
      const { id, ...rest } = { ...values, ...(mod?.fixedValues ?? {}) };
      if (id) {
        const { error } = await supabase
          .from(mod!.table as never)
          .update(rest as never)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(mod!.table as never).insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rows", slug] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["rapports"] });
    },
  });
}

export function useDeleteRow(slug: string) {
  const mod = MODULE_MAP[slug];
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(mod!.table as never)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rows", slug] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["rapports"] });
    },
  });
}

export function rowLabel(mod: ModuleDef, row?: Row): string {
  if (!row) return "—";
  const parts = [row[mod.labelField], mod.labelField2 ? row[mod.labelField2] : null];
  const label = parts.filter(Boolean).join(" ").trim();
  return label || "—";
}

export function formatMoney(value: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)} FBu`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
}

export function formatValue(value: unknown, suffix?: string): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return `${formatNumber(value)}${suffix ? ` ${suffix}` : ""}`;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }
  return `${String(value)}${suffix ? ` ${suffix}` : ""}`;
}
