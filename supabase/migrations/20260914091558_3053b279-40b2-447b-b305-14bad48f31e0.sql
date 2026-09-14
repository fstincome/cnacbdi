CREATE OR REPLACE FUNCTION public.recalculer_budget_projet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
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
REVOKE ALL ON FUNCTION public.recalculer_budget_projet() FROM PUBLIC, anon, authenticated;