import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Settings,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GROUPS, ORG_NAME, modulesOfGroup } from "@/lib/modules";
import { FALLBACK_MODULE_ICON, MODULE_ICONS } from "@/lib/module-icons";
import { useMyAccess } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cnac.sidebar.collapsed";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, slugs } = useMyAccess();
  const structureSlugs = new Set(["departements", "fonctions", "profils"]);
  const projectSlugs = new Set(["programmes", "partenaires", "projets"]);
  const bankSlugs = new Set(["banque-versements", "banque-retraits", "imputations"]);
  const canSeeStructure = [...structureSlugs].some((slug) => slugs.has(slug));
  const canSeeProjects = [...projectSlugs].some((slug) => slugs.has(slug));
  const canSeeBank = [...bankSlugs].some((slug) => slugs.has(slug));

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function renderNav(mini: boolean) {
    return (
      <nav className={cn("space-y-6 text-sm", mini ? "p-2" : "p-4")}>
        <div className="space-y-1">
          <SideLink to="/tableau-de-bord" icon={LayoutDashboard} mini={mini} onNavigate={() => setOpen(false)}>
            Tableau de bord
          </SideLink>
          <SideLink to="/rapports" icon={BarChart3} mini={mini} onNavigate={() => setOpen(false)}>
            Rapports
          </SideLink>
          <SideLink to="/statistiques" icon={PieChart} mini={mini} onNavigate={() => setOpen(false)}>
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
              {mini ? (
                <div className="mx-2 mb-1 border-t border-sidebar-border" aria-hidden />
              ) : (
                <p className="px-3 pb-1 text-[11px] font-semibold tracking-widest text-sidebar-foreground/50 uppercase">
                  {group}
                </p>
              )}
              <div className="space-y-0.5">
                {showStructure ? (
                  <SideLink to="/structure-profils" icon={Building2} mini={mini} onNavigate={() => setOpen(false)}>
                    Structure des profils
                  </SideLink>
                ) : null}
                {showProjects ? (
                  <SideLink
                    to="/projets-partenariats"
                    icon={BriefcaseBusiness}
                    mini={mini}
                    onNavigate={() => setOpen(false)}
                  >
                    Projets & partenariats
                  </SideLink>
                ) : null}
                {showBank ? (
                  <SideLink to="/banque" icon={Landmark} mini={mini} onNavigate={() => setOpen(false)}>
                    Livre de banque
                  </SideLink>
                ) : null}
                {mods.map((m) => {
                  const Icon = MODULE_ICONS[m.slug] ?? FALLBACK_MODULE_ICON;
                  return (
                    <Link
                      key={m.slug}
                      to="/m/$module"
                      params={{ module: m.slug }}
                      onClick={() => setOpen(false)}
                      title={m.title}
                      aria-label={m.title}
                      className={cn(
                        "flex items-center gap-2 rounded-md text-sidebar-foreground/80 transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        mini ? "justify-center px-2 py-2" : "px-3 py-1.5",
                      )}
                      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
                    >
                      <Icon className="size-4 shrink-0" />
                      {mini ? null : <span className="truncate">{m.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className={cn("space-y-1 border-t border-sidebar-border", mini ? "pt-2" : "pt-4")}>
          {isAdmin ? (
            <SideLink to="/parametres" icon={Settings} mini={mini} onNavigate={() => setOpen(false)}>
              Paramètres d'accès
            </SideLink>
          ) : null}
          <SideLink to="/guide" icon={BookOpen} mini={mini} onNavigate={() => setOpen(false)}>
            Guide d'utilisation
          </SideLink>
        </div>
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-16" : "w-72",
        )}
      >
        <Brand collapsed={collapsed} onToggle={toggleCollapsed} />
        <div className="flex-1 overflow-y-auto">{renderNav(collapsed)}</div>
        <div className={cn("border-t border-sidebar-border", collapsed ? "p-2" : "p-4")}>
          {collapsed ? (
            <Button
              variant="outline"
              size="icon"
              className="w-full"
              onClick={signOut}
              title="Déconnexion"
              aria-label="Déconnexion"
            >
              <LogOut className="size-4" />
            </Button>
          ) : (
            <Button variant="outline" className="w-full" onClick={signOut}>
              <LogOut className="mr-2 size-4" /> Déconnexion
            </Button>
          )}
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
            <div className="flex-1 overflow-y-auto">{renderNav(false)}</div>
            <div className="border-t border-sidebar-border p-4">
              <Button variant="outline" className="w-full" onClick={signOut}>
                <LogOut className="mr-2 size-4" /> Déconnexion
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-16" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu className="size-5" />
          </Button>
          <span className="truncate text-sm font-semibold">{ORG_NAME}</span>
        </header>
        <TopBar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
        <footer className="border-t border-border px-4 py-4 text-center text-[11px] text-muted-foreground/70">
          Copy rights© {new Date().getFullYear()} CNAC BURUNDI, Tous droits reserves — Développé par{" "}
          <a
            href="https://www.sightnetwork.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            SIGHT AFRICA
          </a>
        </footer>
      </div>
    </div>
  );
}

function Brand({
  onClose,
  collapsed,
  onToggle,
}: {
  onClose?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  if (collapsed) {
    return (
      <div className="flex items-center justify-center border-b border-sidebar-border py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="Afficher le menu complet"
          title="Afficher le menu complet"
        >
          <Menu className="size-5" />
        </Button>
      </div>
    );
  }
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
      {onToggle ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="Réduire le menu aux icônes"
          title="Réduire le menu aux icônes"
        >
          <Menu className="size-4" />
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
  mini,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  children: ReactNode;
  onNavigate: () => void;
  mini?: boolean;
}) {
  const label = typeof children === "string" ? children : undefined;
  return (
    <Link
      to={to}
      onClick={onNavigate}
      title={label}
      aria-label={label}
      className={cn(
        "flex items-center gap-2 rounded-md font-medium text-sidebar-foreground/80",
        "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        mini ? "justify-center px-2 py-2" : "px-3 py-2",
      )}
      activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground" }}
    >
      <Icon className="size-4 shrink-0" />
      {mini ? null : <span className="truncate">{children}</span>}
    </Link>
  );
}
