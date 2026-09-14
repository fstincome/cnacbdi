CREATE TABLE public.dossiers_archives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  actif boolean NOT NULL DEFAULT true,
  legacy_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossiers_archives TO authenticated;
GRANT ALL ON public.dossiers_archives TO service_role;

ALTER TABLE public.dossiers_archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilisateurs connectes gerent les dossiers archives"
ON public.dossiers_archives FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE TRIGGER set_updated_at_dossiers_archives
BEFORE UPDATE ON public.dossiers_archives
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.archives
  ADD CONSTRAINT archives_dossier_id_fkey FOREIGN KEY (dossier_id) REFERENCES public.dossiers_archives(id) ON DELETE RESTRICT,
  ADD CONSTRAINT archives_type_document_check CHECK (type_document IN ('Archive', 'Planification'));

CREATE INDEX archives_dossier_id_idx ON public.archives(dossier_id);
CREATE INDEX archives_type_document_idx ON public.archives(type_document);
CREATE INDEX archives_auteur_id_idx ON public.archives(auteur_id);