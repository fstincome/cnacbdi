CREATE TABLE public.fiches_terrain (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text,
  province text,
  commune text,
  zone text,
  colline text,
  federation text,
  union_nom text,
  cooperative text,
  association text,
  telephone text,
  date_adhesion date,
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.fiches_terrain TO anon;
GRANT SELECT, DELETE ON public.fiches_terrain TO authenticated;
GRANT ALL ON public.fiches_terrain TO service_role;
ALTER TABLE public.fiches_terrain ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Envoi public" ON public.fiches_terrain FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Lecture connectee" ON public.fiches_terrain FOR SELECT TO authenticated USING (true);
CREATE POLICY "Suppression connectee" ON public.fiches_terrain FOR DELETE TO authenticated USING (true);

GRANT SELECT ON public.provinces TO anon;
GRANT SELECT ON public.communes TO anon;
GRANT SELECT ON public.zones TO anon;
GRANT SELECT ON public.collines TO anon;
GRANT SELECT ON public.federations TO anon;
GRANT SELECT ON public.unions TO anon;
GRANT SELECT ON public.cooperatives TO anon;
GRANT SELECT ON public.associations TO anon;
CREATE POLICY "Lecture publique" ON public.provinces FOR SELECT TO anon USING (true);
CREATE POLICY "Lecture publique" ON public.communes FOR SELECT TO anon USING (true);
CREATE POLICY "Lecture publique" ON public.zones FOR SELECT TO anon USING (true);
CREATE POLICY "Lecture publique" ON public.collines FOR SELECT TO anon USING (true);
CREATE POLICY "Lecture publique" ON public.federations FOR SELECT TO anon USING (true);
CREATE POLICY "Lecture publique" ON public.unions FOR SELECT TO anon USING (true);
CREATE POLICY "Lecture publique" ON public.cooperatives FOR SELECT TO anon USING (true);
CREATE POLICY "Lecture publique" ON public.associations FOR SELECT TO anon USING (true);