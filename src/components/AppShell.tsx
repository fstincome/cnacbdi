import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, BookOpen, BriefcaseBusiness, Building2, Landmark, LayoutDashboard, LogOut, Menu, PieChart, Settings, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GROUPS, ORG_NAME, modulesOfGroup } from "@/lib/modules";
import { useMyAccess } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, slugs } = useMyAccess();
  const structureSlugs = new Set(["departements", "fonctions", "profils"]);
  const projectSlugs = new Set(["programmes", "partenaires", "projets"]);
  const bankSlugs = new Set(["banque-versements", "banque-retraits", "imputations"]);
  const canSeeStructure = [...structureSlugs].some((slug) => slugs.has(slug));
  const canSeeProjects = [...projectSlugs].some((slug) => slugs.has(slug));
  const canSeeBank = [...bankSlugs].some((slug) => slugs.has(slug));

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <nav className="space-y-6 p-4 text-sm">
      <div className="space-y-1">
        <SideLink to="/tableau-de-bord" icon={LayoutDashboard} onNavigate={() => setOpen(false)}>
          Tableau de bord
        </SideLink>
        <SideLink to="/rapports" icon={BarChart3} onNavigate={() => setOpen(false)}>
          Rapports
        </SideLink>
        <SideLink to="/statistiques" icon={PieChart} onNavigate={() => setOpen(false)}>
          Statistiques
        </SideLink>
      </div>
      {GROUPS.map((group) => {
        const mods = modulesOfGroup(group).filter(
          (m) =>
            slugs.has(m.slug) &&
            !structureSlugs.has(m.slug) &&
            !projectSlugs.has(m.slug) &&
            !bankSlugs.has(m.slug),
        );
        const showStructure = group === "Administration / RH" && canSeeStructure;
        const showProjects = group === "Projets & partenariats" && canSeeProjects;
        const showBank = group === "Finances & suivi" && canSeeBank;
        if (!mods.length && !showStructure && !showProjects && !showBank) return null;
        return (
          <div key={group}>
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-widest text-sidebar-foreground/50 uppercase">
              {group}
            </p>
            <div className="space-y-0.5">
              {showStructure ? (
                <SideLink to="/structure-profils" icon={Building2} onNavigate={() => setOpen(false)}>
                  Structure des profils
                </SideLink>
              ) : null}
              {showProjects ? (
                <SideLink to="/projets-partenariats" icon={BriefcaseBusiness} onNavigate={() => setOpen(false)}>
                  Projets & partenariats
                </SideLink>
              ) : null}
              {showBank ? (
                <SideLink to="/banque" icon={Landmark} onNavigate={() => setOpen(false)}>
                  Livre de banque
                </SideLink>
              ) : null}
              {mods.map((m) => (
                <Link
                  key={m.slug}
                  to="/m/$module"
                  params={{ module: m.slug }}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-1.5 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
                >
                  {m.title}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
      <div className="space-y-1 border-t border-sidebar-border pt-4">
        {isAdmin ? (
          <SideLink to="/parametres" icon={Settings} onNavigate={() => setOpen(false)}>
            Paramètres d'accès
          </SideLink>
        ) : null}
        <SideLink to="/guide" icon={BookOpen} onNavigate={() => setOpen(false)}>
          Guide d'utilisation
        </SideLink>
      </div>
    </nav>
  );



  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto">{nav}</div>
        <div className="border-t border-sidebar-border p-4">
          <Button variant="outline" className="w-full" onClick={signOut}>
            <LogOut className="mr-2 size-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar">
            <Brand onClose={() => setOpen(false)} />
            <div className="flex-1 overflow-y-auto">{nav}</div>
            <div className="border-t border-sidebar-border p-4">
              <Button variant="outline" className="w-full" onClick={signOut}>
                <LogOut className="mr-2 size-4" /> Déconnexion
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu className="size-5" />
          </Button>
          <span className="truncate text-sm font-semibold">{ORG_NAME}</span>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function Brand({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-sidebar-border px-5 py-5">
      <Link to="/tableau-de-bord" className="block">
        <span className="block text-[11px] font-semibold tracking-widest text-sidebar-foreground/50 uppercase">
          Système de gestion
        </span>
        <span className="mt-1 block text-base leading-tight font-semibold text-sidebar-foreground">
          {ORG_NAME}
        </span>
      </Link>
      {onClose ? (
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

function SideLink({
  to,
  icon: Icon,
  children,
  onNavigate,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  children: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sidebar-foreground/80",
        "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
      activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground" }}
    >
      <Icon className="size-4" />
      {children}
    </Link>
  );
}
