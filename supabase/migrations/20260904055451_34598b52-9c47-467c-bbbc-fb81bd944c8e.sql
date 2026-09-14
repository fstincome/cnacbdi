-- ============ Localisation administrative ============
CREATE TABLE public.provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provinces TO authenticated;
GRANT ALL ON public.provinces TO service_role;
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provinces_auth" ON public.provinces FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.communes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  province_id uuid REFERENCES public.provinces(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.communes TO authenticated;
GRANT ALL ON public.communes TO service_role;
ALTER TABLE public.communes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "communes_auth" ON public.communes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  commune_id uuid REFERENCES public.communes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zones TO authenticated;
GRANT ALL ON public.zones TO service_role;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "zones_auth" ON public.zones FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.collines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  zone_id uuid REFERENCES public.zones(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collines TO authenticated;
GRANT ALL ON public.collines TO service_role;
ALTER TABLE public.collines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collines_auth" ON public.collines FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ Hiérarchie communautaire ============
DROP TABLE IF EXISTS public.membres CASCADE;
DROP TABLE IF EXISTS public.associations CASCADE;

CREATE TABLE public.federations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  province_id uuid REFERENCES public.provinces(id) ON DELETE SET NULL,
  responsable_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  contact text,
  nbre_cooperatives integer NOT NULL DEFAULT 0,
  nbre_associations integer NOT NULL DEFAULT 0,
  nbre_unions integer NOT NULL DEFAULT 0,
  date_creation date,
  statut text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.federations TO authenticated;
GRANT ALL ON public.federations TO service_role;
ALTER TABLE public.federations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "federations_auth" ON public.federations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_federations BEFORE UPDATE ON public.federations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.unions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  federation_id uuid REFERENCES public.federations(id) ON DELETE SET NULL,
  colline_id uuid REFERENCES public.collines(id) ON DELETE SET NULL,
  responsable_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  contact text,
  nbre_membres integer NOT NULL DEFAULT 0,
  date_creation date,
  statut text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.unions TO authenticated;
GRANT ALL ON public.unions TO service_role;
ALTER TABLE public.unions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "unions_auth" ON public.unions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_unions BEFORE UPDATE ON public.unions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.cooperatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  federation_id uuid REFERENCES public.federations(id) ON DELETE SET NULL,
  colline_id uuid REFERENCES public.collines(id) ON DELETE SET NULL,
  responsable_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  contact text,
  nbre_membres integer NOT NULL DEFAULT 0,
  date_creation date,
  statut text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cooperatives TO authenticated;
GRANT ALL ON public.cooperatives TO service_role;
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cooperatives_auth" ON public.cooperatives FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_cooperatives BEFORE UPDATE ON public.cooperatives FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.associations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  federation_id uuid REFERENCES public.federations(id) ON DELETE SET NULL,
  colline_id uuid REFERENCES public.collines(id) ON DELETE SET NULL,
  responsable_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  contact text,
  nbre_membres integer NOT NULL DEFAULT 0,
  date_creation date,
  statut text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.associations TO authenticated;
GRANT ALL ON public.associations TO service_role;
ALTER TABLE public.associations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "associations_auth" ON public.associations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_associations BEFORE UPDATE ON public.associations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.membres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  prenom text,
  sexe text,
  date_naissance date,
  contact text,
  association_id uuid REFERENCES public.associations(id) ON DELETE SET NULL,
  cooperative_id uuid REFERENCES public.cooperatives(id) ON DELETE SET NULL,
  union_id uuid REFERENCES public.unions(id) ON DELETE SET NULL,
  superficie text,
  nbre_plants text,
  date_adhesion date,
  statut text NOT NULL DEFAULT 'Actif',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.membres TO authenticated;
GRANT ALL ON public.membres TO service_role;
ALTER TABLE public.membres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "membres_auth" ON public.membres FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_membres BEFORE UPDATE ON public.membres FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intervenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id integer UNIQUE,
  nom text NOT NULL,
  province_id uuid REFERENCES public.provinces(id) ON DELETE SET NULL,
  responsable_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  contact text,
  date_creation date,
  statut text NOT NULL DEFAULT 'Actif',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.intervenants TO authenticated;
GRANT ALL ON public.intervenants TO service_role;
ALTER TABLE public.intervenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "intervenants_auth" ON public.intervenants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER set_updated_at_intervenants BEFORE UPDATE ON public.intervenants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- legacy_id numérique sur employés pour l'import
ALTER TABLE public.employes ALTER COLUMN legacy_id TYPE text;
CREATE UNIQUE INDEX IF NOT EXISTS employes_legacy_id_key ON public.employes(legacy_id);