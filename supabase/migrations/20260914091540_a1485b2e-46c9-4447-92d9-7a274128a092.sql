ALTER TABLE public.programmes
  ADD COLUMN IF NOT EXISTS objectifs text;

ALTER TABLE public.partenaires
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS localisation text,
  ADD COLUMN IF NOT EXISTS objet_collaboration text,
  ADD COLUMN IF NOT EXISTS logo_path text;

ALTER TABLE public.projets
  ADD COLUMN IF NOT EXISTS objectifs text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS chef_projet_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS budget_depense numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS budget_restant numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fichier_path text;

UPDATE public.projets
SET budget_restant = GREATEST(budget - budget_depense, 0)
WHERE budget_restant = 0 AND budget > 0;

CREATE INDEX IF NOT EXISTS idx_projets_chef_projet ON public.projets(chef_projet_id);

CREATE TABLE public.projet_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projet_id uuid NOT NULL REFERENCES public.projets(id) ON DELETE CASCADE,
  employe_id uuid NOT NULL REFERENCES public.employes(id) ON DELETE CASCADE,
  date_attribution timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (projet_id, employe_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projet_participants TO authenticated;
GRANT ALL ON public.projet_participants TO service_role;
ALTER TABLE public.projet_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectes gerent les participants projets"
ON public.projet_participants FOR ALL TO authenticated
USING (true) WITH CHECK (true);
CREATE INDEX idx_projet_participants_projet ON public.projet_participants(projet_id);
CREATE INDEX idx_projet_participants_employe ON public.projet_participants(employe_id);
CREATE TRIGGER set_updated_at_projet_participants
BEFORE UPDATE ON public.projet_participants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.projet_activites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projet_id uuid NOT NULL REFERENCES public.projets(id) ON DELETE CASCADE,
  responsable_id uuid NOT NULL REFERENCES public.employes(id) ON DELETE RESTRICT,
  activite text NOT NULL,
  engagement_path text,
  budget numeric NOT NULL DEFAULT 0 CHECK (budget >= 0),
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projet_activites TO authenticated;
GRANT ALL ON public.projet_activites TO service_role;
ALTER TABLE public.projet_activites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectes gerent les activites projets"
ON public.projet_activites FOR ALL TO authenticated
USING (true) WITH CHECK (true);
CREATE INDEX idx_projet_activites_projet ON public.projet_activites(projet_id);
CREATE INDEX idx_projet_activites_responsable ON public.projet_activites(responsable_id);
CREATE TRIGGER set_updated_at_projet_activites
BEFORE UPDATE ON public.projet_activites
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.recalculer_budget_projet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cible_projet uuid;
  total_activites numeric;
BEGIN
  cible_projet := COALESCE(NEW.projet_id, OLD.projet_id);
  SELECT COALESCE(SUM(budget), 0) INTO total_activites
  FROM public.projet_activites
  WHERE projet_id = cible_projet;

  UPDATE public.projets
  SET budget_depense = total_activites,
      budget_restant = GREATEST(budget - total_activites, 0)
  WHERE id = cible_projet;

  IF TG_OP = 'UPDATE' AND OLD.projet_id IS DISTINCT FROM NEW.projet_id THEN
    SELECT COALESCE(SUM(budget), 0) INTO total_activites
    FROM public.projet_activites
    WHERE projet_id = OLD.projet_id;
    UPDATE public.projets
    SET budget_depense = total_activites,
        budget_restant = GREATEST(budget - total_activites, 0)
    WHERE id = OLD.projet_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;
REVOKE ALL ON FUNCTION public.recalculer_budget_projet() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recalculer_budget_projet() TO authenticated, service_role;

CREATE TRIGGER recalculer_budget_projet_apres_activite
AFTER INSERT OR UPDATE OR DELETE ON public.projet_activites
FOR EACH ROW EXECUTE FUNCTION public.recalculer_budget_projet();