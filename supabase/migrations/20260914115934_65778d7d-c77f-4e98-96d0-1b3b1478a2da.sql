ALTER TABLE public.salaires
  ADD COLUMN IF NOT EXISTS etat_civil text NOT NULL DEFAULT 'Célibataire',
  ADD COLUMN IF NOT EXISTS nombre_enfants integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS salaire_base numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS auteur_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS salaires_employe_unique ON public.salaires(employe_id);
ALTER TABLE public.salaires
  ADD CONSTRAINT salaires_etat_civil_valide CHECK (etat_civil IN ('Célibataire', 'Marié(e)')),
  ADD CONSTRAINT salaires_nombre_enfants_valide CHECK (nombre_enfants >= 0 AND nombre_enfants <= 20),
  ADD CONSTRAINT salaires_base_valide CHECK (salaire_base >= 0);

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
CREATE POLICY "details_paie_acces_module" ON public.details_paie FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'));
CREATE TRIGGER set_updated_at_details_paie BEFORE UPDATE ON public.details_paie FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fiches_paie_mensuelles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mois integer NOT NULL CHECK (mois BETWEEN 1 AND 12),
  annee integer NOT NULL CHECK (annee BETWEEN 2000 AND 2200),
  document_url text,
  auteur_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  auteur_nom text,
  modificateur_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  modificateur_nom text,
  statut text NOT NULL DEFAULT 'Soumis' CHECK (statut IN ('Soumis', 'Révisé', 'Validé', 'Payé', 'Annulé')),
  legacy_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mois, annee)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fiches_paie_mensuelles TO authenticated;
GRANT ALL ON public.fiches_paie_mensuelles TO service_role;
ALTER TABLE public.fiches_paie_mensuelles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fiches_paie_acces_module" ON public.fiches_paie_mensuelles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'));
CREATE TRIGGER set_updated_at_fiches_paie_mensuelles BEFORE UPDATE ON public.fiches_paie_mensuelles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.calculer_detail_paie()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
  v_id numeric; v_il numeric; v_af numeric; v_brut numeric; v_inss4 numeric;
  v_inss6 numeric; v_inss3 numeric; v_m4 numeric := 0; v_ded numeric;
  v_rni numeric; v_ipr numeric; v_net numeric; v_m6 numeric; v_ms numeric;
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
  INSERT INTO public.details_paie (salaire_id, employe_id, salaire_base, indemnite_deplacement, indemnite_logement, allocations_familiales, salaire_brut, inss_4, mutuelle_4, deductions, revenu_net_imposable, ipr, salaire_net, inss_6, inss_3, mutuelle_6, montant_supporte)
  VALUES (NEW.id, NEW.employe_id, NEW.salaire_base, v_id, v_il, v_af, v_brut, v_inss4, v_m4, v_ded, v_rni, v_ipr, v_net, v_inss6, v_inss3, v_m6, v_ms)
  ON CONFLICT (salaire_id) DO UPDATE SET employe_id=EXCLUDED.employe_id, salaire_base=EXCLUDED.salaire_base, indemnite_deplacement=EXCLUDED.indemnite_deplacement, indemnite_logement=EXCLUDED.indemnite_logement, allocations_familiales=EXCLUDED.allocations_familiales, salaire_brut=EXCLUDED.salaire_brut, inss_4=EXCLUDED.inss_4, mutuelle_4=EXCLUDED.mutuelle_4, deductions=EXCLUDED.deductions, revenu_net_imposable=EXCLUDED.revenu_net_imposable, ipr=EXCLUDED.ipr, salaire_net=EXCLUDED.salaire_net, inss_6=EXCLUDED.inss_6, inss_3=EXCLUDED.inss_3, mutuelle_6=EXCLUDED.mutuelle_6, montant_supporte=EXCLUDED.montant_supporte;
  RETURN NEW;
END;
$$;
CREATE TRIGGER calculer_detail_paie_apres_salaire AFTER INSERT OR UPDATE OF salaire_base, etat_civil, nombre_enfants, employe_id ON public.salaires FOR EACH ROW EXECUTE FUNCTION public.calculer_detail_paie();