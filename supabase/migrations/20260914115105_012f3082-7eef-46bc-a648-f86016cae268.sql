-- Unions : rattachées à une commune
ALTER TABLE public.unions
  ADD COLUMN IF NOT EXISTS commune_id uuid REFERENCES public.communes(id),
  DROP COLUMN IF EXISTS colline_id;

-- Coopératives : rattachées à une union et une zone
ALTER TABLE public.cooperatives
  ADD COLUMN IF NOT EXISTS union_id uuid REFERENCES public.unions(id),
  ADD COLUMN IF NOT EXISTS zone_id uuid REFERENCES public.zones(id),
  DROP COLUMN IF EXISTS federation_id,
  DROP COLUMN IF EXISTS colline_id;

-- Associations : rattachées à une coopérative et une colline
ALTER TABLE public.associations
  ADD COLUMN IF NOT EXISTS cooperative_id uuid REFERENCES public.cooperatives(id),
  DROP COLUMN IF EXISTS federation_id;

-- Membres : uniquement via l'association
ALTER TABLE public.membres
  DROP COLUMN IF EXISTS cooperative_id,
  DROP COLUMN IF EXISTS union_id;
