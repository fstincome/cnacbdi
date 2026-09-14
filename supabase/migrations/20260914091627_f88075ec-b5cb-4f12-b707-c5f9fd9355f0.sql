CREATE OR REPLACE FUNCTION public.initialiser_budget_projet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.budget_restant := GREATEST(NEW.budget - COALESCE(NEW.budget_depense, 0), 0);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.initialiser_budget_projet() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER initialiser_budget_projet_avant_ecriture
BEFORE INSERT OR UPDATE OF budget ON public.projets
FOR EACH ROW EXECUTE FUNCTION public.initialiser_budget_projet();