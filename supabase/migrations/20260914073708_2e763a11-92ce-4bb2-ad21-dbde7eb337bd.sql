ALTER TABLE public.salaires
  RENAME COLUMN brut TO salaire_base;

ALTER TABLE public.salaires
  ADD COLUMN etat_civil text NOT NULL DEFAULT 'Célibataire',
  ADD COLUMN nombre_enfants integer NOT NULL DEFAULT 0,
  ADD COLUMN auteur_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.salaires
  DROP COLUMN primes,
  DROP COLUMN retenues,
  DROP COLUMN net,
  DROP COLUMN statut,
  DROP COLUMN periode;

ALTER TABLE public.salaires
  ADD CONSTRAINT salaires_employe_unique UNIQUE (employe_id),
  ADD CONSTRAINT salaires_etat_civil_valide CHECK (etat_civil IN ('Célibataire', 'Marié(e)')),
  ADD CONSTRAINT salaires_nombre_enfants_valide CHECK (nombre_enfants >= 0 AND nombre_enfants <= 20),
  ADD CONSTRAINT salaires_base_valide CHECK (salaire_base >= 0);

DROP POLICY IF EXISTS acces_salaires ON public.salaires;
CREATE POLICY "salaires_acces_module"
ON public.salaires FOR ALL TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.user_module_access
    WHERE user_id = auth.uid() AND module_slug = 'salaires'
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.user_module_access
    WHERE user_id = auth.uid() AND module_slug = 'salaires'
  )
);

CREATE TABLE public.details_paie (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salaire_id uuid NOT NULL UNIQUE REFERENCES public.salaires(id) ON DELETE CASCADE,
  employe_id uuid NOT NULL REFERENCES public.employes(id) ON DELETE CASCADE,
  salaire_base numeric NOT NULL DEFAULT 0,
  indemnite_deplacement numeric NOT NULL DEFAULT 0,
  indemnite_logement numeric NOT NULL DEFAULT 0,
  allocations_familiales numeric NOT NULL DEFAULT 0,
  salaire_brut numeric NOT NULL DEFAULT 0,
  inss_4 numeric NOT NULL DEFAULT 0,
  mutuelle_4 numeric NOT NULL DEFAULT 0,
  deductions numeric NOT NULL DEFAULT 0,
  revenu_net_imposable numeric NOT NULL DEFAULT 0,
  ipr numeric NOT NULL DEFAULT 0,
  salaire_net numeric NOT NULL DEFAULT 0,
  inss_6 numeric NOT NULL DEFAULT 0,
  inss_3 numeric NOT NULL DEFAULT 0,
  mutuelle_6 numeric NOT NULL DEFAULT 0,
  montant_supporte numeric NOT NULL DEFAULT 0,
  legacy_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.details_paie TO authenticated;
GRANT ALL ON public.details_paie TO service_role;
ALTER TABLE public.details_paie ENABLE ROW LEVEL SECURITY;
CREATE POLICY "details_paie_acces_module"
ON public.details_paie FOR ALL TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.user_module_access
    WHERE user_id = auth.uid() AND module_slug = 'salaires'
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.user_module_access
    WHERE user_id = auth.uid() AND module_slug = 'salaires'
  )
);
CREATE TRIGGER set_updated_at_details_paie
BEFORE UPDATE ON public.details_paie
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fiches_paie_mensuelles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mois integer NOT NULL,
  annee integer NOT NULL,
  document_url text,
  auteur_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  auteur_nom text,
  modificateur_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  modificateur_nom text,
  statut text NOT NULL DEFAULT 'Soumis',
  legacy_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fiches_paie_periode_unique UNIQUE (mois, annee),
  CONSTRAINT fiches_paie_mois_valide CHECK (mois BETWEEN 1 AND 12),
  CONSTRAINT fiches_paie_annee_valide CHECK (annee BETWEEN 2000 AND 2200),
  CONSTRAINT fiches_paie_statut_valide CHECK (statut IN ('Soumis', 'Révisé', 'Validé', 'Payé', 'Annulé'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fiches_paie_mensuelles TO authenticated;
GRANT ALL ON public.fiches_paie_mensuelles TO service_role;
ALTER TABLE public.fiches_paie_mensuelles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fiches_paie_acces_module"
ON public.fiches_paie_mensuelles FOR ALL TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.user_module_access
    WHERE user_id = auth.uid() AND module_slug = 'salaires'
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.user_module_access
    WHERE user_id = auth.uid() AND module_slug = 'salaires'
  )
);
CREATE TRIGGER set_updated_at_fiches_paie_mensuelles
BEFORE UPDATE ON public.fiches_paie_mensuelles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.calculer_detail_paie()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_id numeric;
  v_il numeric;
  v_af numeric;
  v_brut numeric;
  v_inss4 numeric;
  v_inss6 numeric;
  v_inss3 numeric;
  v_m4 numeric := 0;
  v_ded numeric;
  v_rni numeric;
  v_ipr numeric;
  v_net numeric;
  v_m6 numeric;
  v_ms numeric;
BEGIN
  v_id := NEW.salaire_base * 0.15;
  v_il := NEW.salaire_base * 0.60;
  v_af := (NEW.nombre_enfants * 2000) + CASE WHEN NEW.etat_civil = 'Marié(e)' THEN 3000 ELSE 0 END;
  v_brut := NEW.salaire_base + v_id + v_il + v_af;
  v_inss4 := CASE WHEN v_brut > 450000 THEN 18000 ELSE v_brut * 0.04 END;
  v_inss6 := CASE WHEN v_brut > 450000 THEN 27000 ELSE v_brut * 0.06 END;
  v_inss3 := CASE WHEN v_brut > 80000 THEN 2400 ELSE v_brut * 0.03 END;
  v_ded := v_id + v_il + v_inss4;
  v_rni := v_brut - v_ded - v_af;
  v_ipr := GREATEST(0, (v_rni - 300000) * 0.30 + 30000);
  v_net := v_brut - v_inss4 - v_ipr - v_m4;
  v_m6 := (v_brut - v_il) * 0.06;
  v_ms := v_inss4 + v_m4 + v_ipr + v_net + v_inss6 + v_inss3 + v_m6;

  INSERT INTO public.details_paie (
    salaire_id, employe_id, salaire_base, indemnite_deplacement, indemnite_logement,
    allocations_familiales, salaire_brut, inss_4, mutuelle_4, deductions,
    revenu_net_imposable, ipr, salaire_net, inss_6, inss_3, mutuelle_6, montant_supporte
  ) VALUES (
    NEW.id, NEW.employe_id, NEW.salaire_base, v_id, v_il,
    v_af, v_brut, v_inss4, v_m4, v_ded,
    v_rni, v_ipr, v_net, v_inss6, v_inss3, v_m6, v_ms
  )
  ON CONFLICT (salaire_id) DO UPDATE SET
    employe_id = EXCLUDED.employe_id,
    salaire_base = EXCLUDED.salaire_base,
    indemnite_deplacement = EXCLUDED.indemnite_deplacement,
    indemnite_logement = EXCLUDED.indemnite_logement,
    allocations_familiales = EXCLUDED.allocations_familiales,
    salaire_brut = EXCLUDED.salaire_brut,
    inss_4 = EXCLUDED.inss_4,
    mutuelle_4 = EXCLUDED.mutuelle_4,
    deductions = EXCLUDED.deductions,
    revenu_net_imposable = EXCLUDED.revenu_net_imposable,
    ipr = EXCLUDED.ipr,
    salaire_net = EXCLUDED.salaire_net,
    inss_6 = EXCLUDED.inss_6,
    inss_3 = EXCLUDED.inss_3,
    mutuelle_6 = EXCLUDED.mutuelle_6,
    montant_supporte = EXCLUDED.montant_supporte;
  RETURN NEW;
END;
$$;
CREATE TRIGGER calculer_detail_paie_apres_salaire
AFTER INSERT OR UPDATE OF salaire_base, etat_civil, nombre_enfants, employe_id
ON public.salaires
FOR EACH ROW EXECUTE FUNCTION public.calculer_detail_paie();

INSERT INTO public.details_paie (
  id, salaire_id, employe_id, salaire_base, indemnite_deplacement, indemnite_logement,
  allocations_familiales, salaire_brut, inss_4, mutuelle_4, deductions,
  revenu_net_imposable, ipr, salaire_net, inss_6, inss_3, mutuelle_6,
  montant_supporte, legacy_id, created_at, updated_at
)
SELECT
  'd7100000-0000-4000-8000-000000000001'::uuid,
  s.id, s.employe_id, 500000, 75000, 300000,
  3000, 878000, 18000, 0, 393000,
  482000, 84600, 775400, 27000, 2400, 34680,
  942080, '1', '2026-03-23 12:34:00+00'::timestamptz, '2026-03-23 12:34:00+00'::timestamptz
FROM public.salaires s WHERE s.legacy_id = '1'
ON CONFLICT (salaire_id) DO UPDATE SET
  salaire_base = EXCLUDED.salaire_base,
  indemnite_deplacement = EXCLUDED.indemnite_deplacement,
  indemnite_logement = EXCLUDED.indemnite_logement,
  allocations_familiales = EXCLUDED.allocations_familiales,
  salaire_brut = EXCLUDED.salaire_brut,
  inss_4 = EXCLUDED.inss_4,
  mutuelle_4 = EXCLUDED.mutuelle_4,
  deductions = EXCLUDED.deductions,
  revenu_net_imposable = EXCLUDED.revenu_net_imposable,
  ipr = EXCLUDED.ipr,
  salaire_net = EXCLUDED.salaire_net,
  inss_6 = EXCLUDED.inss_6,
  inss_3 = EXCLUDED.inss_3,
  mutuelle_6 = EXCLUDED.mutuelle_6,
  montant_supporte = EXCLUDED.montant_supporte,
  legacy_id = EXCLUDED.legacy_id,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

UPDATE public.salaires
SET etat_civil = 'Marié(e)', nombre_enfants = 0, salaire_base = 500000,
    created_at = '2026-03-23 12:34:00+00', updated_at = '2026-03-23 12:34:00+00'
WHERE legacy_id = '1';

INSERT INTO public.fiches_paie_mensuelles (
  id, mois, annee, document_url, auteur_nom, modificateur_nom,
  statut, legacy_id, created_at, updated_at
) VALUES
  ('f7100000-0000-4000-8000-000000000001', 2, 2026,
   'https://gestion.cnacburundi.bi/fiche_salaire/fiche_salaire_2026_03_23_13_09.pdf',
   'Compte legacy 41', 'Compte legacy 41', 'Soumis', '1',
   '2026-03-23 12:16:00+00', '2026-03-23 12:16:00+00'),
  ('f7100000-0000-4000-8000-000000000002', 3, 2026,
   'https://gestion.cnacburundi.bi/fiche_salaire/fiche_salaire_2026_04_09_09_47.pdf',
   'Compte legacy 44', 'Compte legacy 44', 'Soumis', '2',
   '2026-04-09 07:31:00+00', '2026-04-09 07:31:00+00')
ON CONFLICT (legacy_id) DO NOTHING;

ALTER TABLE public.employes DROP COLUMN salaire_base;