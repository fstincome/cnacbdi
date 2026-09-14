import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { KeyRound, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const APP_NAME = "Confédération Nationale des Associations des Caféiculteurs";
export const APP_TAGLINE = "Système intégré de gestion des coopératives et caféiculteurs";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function TopBar() {
  const now = useNow();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const [openPwd, setOpenPwd] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const email = user?.email ?? "";
  const nom = (user?.user_metadata?.['nom_complet'] as string | undefined) ?? email;
  const initials = (nom || "?").trim().slice(0, 2).toUpperCase();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function changePassword() {
    if (next.length < 8) {
      toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (next !== confirm) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      password: next,
      current_password: current,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Mot de passe modifié.");
    setOpenPwd(false);
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-2.5 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">{APP_NAME}</p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{APP_TAGLINE}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-muted-foreground capitalize">
              {now
                ? now.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </p>
            <p className="text-sm font-medium tabular-nums text-foreground">
              {now ? now.toLocaleTimeString("fr-FR") : ""}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Mon profil">
                <span className="text-xs font-semibold">{initials}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <span className="flex items-center gap-2">
                  <User className="size-4" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{nom}</span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {email}
                    </span>
                  </span>
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setOpenPwd(true)}>
                <KeyRound className="mr-2 size-4" /> Changer le mot de passe
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void signOut()}>
                <LogOut className="mr-2 size-4" /> Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={openPwd} onOpenChange={setOpenPwd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Saisissez votre mot de passe actuel puis le nouveau.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pwd-current">Mot de passe actuel</Label>
              <Input
                id="pwd-current"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd-new">Nouveau mot de passe</Label>
              <Input id="pwd-new" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd-confirm">Confirmer le nouveau mot de passe</Label>
              <Input
                id="pwd-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPwd(false)}>
              Annuler
            </Button>
            <Button onClick={() => void changePassword()} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
