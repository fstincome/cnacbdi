ALTER TABLE public.employes
  ADD COLUMN IF NOT EXISTS banque text,
  ADD COLUMN IF NOT EXISTS numero_compte text,
  ADD COLUMN IF NOT EXISTS niveau_etudes text,
  ADD COLUMN IF NOT EXISTS profil text,
  ADD COLUMN IF NOT EXISTS responsable text,
  ADD COLUMN IF NOT EXISTS categorie_personnel text NOT NULL DEFAULT 'Non permanent',
  ADD COLUMN IF NOT EXISTS contrat_path text,
  ADD COLUMN IF NOT EXISTS dossier_path text,
  ADD COLUMN IF NOT EXISTS user_id uuid;

COMMENT ON COLUMN public.employes.categorie_personnel IS 'Permanent ou Non permanent, selon IS_PERMANENT du système source';
COMMENT ON COLUMN public.employes.contrat_path IS 'Chemin privé du contrat dans le stockage';
COMMENT ON COLUMN public.employes.dossier_path IS 'Chemin privé du dossier administratif dans le stockage';