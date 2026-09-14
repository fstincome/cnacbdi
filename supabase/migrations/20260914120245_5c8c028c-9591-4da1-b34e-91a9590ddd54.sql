CREATE TABLE public.imputations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  code text NOT NULL,
  description text NOT NULL,
  statut text NOT NULL DEFAULT 'Actif',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.imputations TO authenticated;
GRANT ALL ON public.imputations TO service_role;
ALTER TABLE public.imputations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectés gèrent les imputations" ON public.imputations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_imputations_updated_at BEFORE UPDATE ON public.imputations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.livre_banque (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  libelle text NOT NULL,
  imputation_id uuid REFERENCES public.imputations(id) ON DELETE SET NULL,
  nom_operant text,
  est_entree boolean NOT NULL DEFAULT true,
  debit numeric NOT NULL DEFAULT 0,
  credit numeric NOT NULL DEFAULT 0,
  solde numeric NOT NULL DEFAULT 0,
  date_entree date NOT NULL DEFAULT CURRENT_DATE,
  statut text NOT NULL DEFAULT 'Enregistrée',
  auteur_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  auteur_nom text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.livre_banque TO authenticated;
GRANT ALL ON public.livre_banque TO service_role;
ALTER TABLE public.livre_banque ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectés gèrent le livre de banque" ON public.livre_banque
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_livre_banque_updated_at BEFORE UPDATE ON public.livre_banque
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_livre_banque_date ON public.livre_banque(date_entree);

CREATE OR REPLACE FUNCTION public.recalculer_solde_banque()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN RETURN NULL; END IF;
  WITH cumul AS (
    SELECT id, SUM(CASE WHEN statut = 'Enregistrée' THEN debit - credit ELSE 0 END)
      OVER (ORDER BY date_entree, created_at, id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS s
    FROM public.livre_banque
  )
  UPDATE public.livre_banque b SET solde = cumul.s FROM cumul
  WHERE b.id = cumul.id AND b.solde IS DISTINCT FROM cumul.s;
  RETURN NULL;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.recalculer_solde_banque() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.recalculer_solde_banque() TO authenticated, service_role;
CREATE TRIGGER recalcul_solde_banque AFTER INSERT OR UPDATE OR DELETE ON public.livre_banque
FOR EACH STATEMENT EXECUTE FUNCTION public.recalculer_solde_banque();