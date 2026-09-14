CREATE TABLE public.departements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  code text,
  description text,
  statut text NOT NULL DEFAULT 'Actif',
  legacy_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departements TO authenticated;
GRANT ALL ON public.departements TO service_role;
ALTER TABLE public.departements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectés gèrent les départements" ON public.departements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_departements BEFORE UPDATE ON public.departements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fonctions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  departement_id uuid REFERENCES public.departements(id) ON DELETE CASCADE,
  description text,
  statut text NOT NULL DEFAULT 'Actif',
  legacy_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fonctions TO authenticated;
GRANT ALL ON public.fonctions TO service_role;
ALTER TABLE public.fonctions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectés gèrent les fonctions" ON public.fonctions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_fonctions BEFORE UPDATE ON public.fonctions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.profils (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  fonction_id uuid REFERENCES public.fonctions(id) ON DELETE CASCADE,
  description text,
  statut text NOT NULL DEFAULT 'Actif',
  legacy_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profils TO authenticated;
GRANT ALL ON public.profils TO service_role;
ALTER TABLE public.profils ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectés gèrent les profils" ON public.profils FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_profils BEFORE UPDATE ON public.profils FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.employes
  ADD COLUMN departement_id uuid REFERENCES public.departements(id) ON DELETE SET NULL,
  ADD COLUMN fonction_id uuid REFERENCES public.fonctions(id) ON DELETE SET NULL,
  ADD COLUMN profil_id uuid REFERENCES public.profils(id) ON DELETE SET NULL;

CREATE INDEX idx_fonctions_departement ON public.fonctions(departement_id);
CREATE INDEX idx_profils_fonction ON public.profils(fonction_id);