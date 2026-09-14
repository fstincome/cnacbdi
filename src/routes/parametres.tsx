import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { GROUPS, MODULES, ORG_NAME, modulesOfGroup } from "@/lib/modules";
import {
  useManagedProfils,
  useManagedUsers,
  useMyAccess,
  useSetAdmin,
  useSetModuleAccess,
  useSetModuleAccessBulk,
  useSetProfilModuleAccess,
  useSetProfilModuleAccessBulk,
} from "@/lib/access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/parametres")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: `Paramètres d'accès — ${ORG_NAME}` },
      {
        name: "description",
        content: "Gestion des droits : choisissez les onglets visibles par chaque utilisateur.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Paramètres d'accès — ${ORG_NAME}` },
      {
        property: "og:description",
        content: "Attribution des onglets visibles par utilisateur ou par profil.",
      },
    ],
  }),
  component: ParametresPage,
});

const STRUCTURE_SLUGS = new Set(["departements", "fonctions", "profils"]);
const PROJECT_SLUGS = new Set(["programmes", "partenaires", "projets"]);
const BANK_SLUGS = new Set(["banque-versements", "banque-retraits", "imputations"]);

function ModuleGrid({
  granted,
  onToggle,
}: {
  granted: string[];
  onToggle: (slug: string, allowed: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-widest uppercase">
            {group}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group === "Administration / RH" ? (
              <div className="space-y-2 rounded-md border p-3 sm:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium">Structure des profils</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {modulesOfGroup(group)
                    .filter((m) => STRUCTURE_SLUGS.has(m.slug))
                    .map((m) => (
                      <label
                        key={m.slug}
                        className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={granted.includes(m.slug)}
                          onCheckedChange={(v) => onToggle(m.slug, v === true)}
                        />
                        <span>{m.title}</span>
                      </label>
                    ))}
                </div>
              </div>
            ) : null}
            {group === "Projets & partenariats" ? (
              <div className="space-y-2 rounded-md border p-3 sm:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium">Projets & partenariats</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {modulesOfGroup(group).filter((m) => PROJECT_SLUGS.has(m.slug)).map((m) => (
                    <label key={m.slug} className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm">
                      <Checkbox checked={granted.includes(m.slug)} onCheckedChange={(v) => onToggle(m.slug, v === true)} />
                      <span>{m.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
            {group === "Finances & suivi" ? (
              <div className="space-y-2 rounded-md border p-3 sm:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium">Livre de banque</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {modulesOfGroup(group).filter((m) => BANK_SLUGS.has(m.slug)).map((m) => (
                    <label key={m.slug} className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm">
                      <Checkbox checked={granted.includes(m.slug)} onCheckedChange={(v) => onToggle(m.slug, v === true)} />
                      <span>{m.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
            {modulesOfGroup(group)
              .filter(
                (m) =>
                  !STRUCTURE_SLUGS.has(m.slug) && !PROJECT_SLUGS.has(m.slug) && !BANK_SLUGS.has(m.slug),
              )
              .map((m) => (
                <label
                  key={m.slug}
                  className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <Checkbox
                    checked={granted.includes(m.slug)}
                    onCheckedChange={(v) => onToggle(m.slug, v === true)}
                  />
                  <span>{m.title}</span>
                </label>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ParametresPage() {
  const { isAdmin, isLoading } = useMyAccess();
  const { data: users, isLoading: usersLoading } = useManagedUsers(isAdmin);
  const { data: profils, isLoading: profilsLoading } = useManagedProfils(isAdmin);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedProfil, setSelectedProfil] = useState<string | null>(null);
  const setAccess = useSetModuleAccess();
  const setBulk = useSetModuleAccessBulk();
  const setAdmin = useSetAdmin();
  const setProfilAccess = useSetProfilModuleAccess();
  const setProfilBulk = useSetProfilModuleAccessBulk();

  if (isLoading) {
    return (
      <AppShell>
        <p className="text-muted-foreground text-sm">Chargement…</p>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <Card>
          <CardHeader>
            <CardTitle>Accès réservé</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Seul un administrateur peut modifier les droits d'accès. Contactez l'administrateur du
            système.
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const current = users?.find((u) => u.id === selected) ?? null;
  const currentProfil = profils?.find((p) => p.id === selectedProfil) ?? null;

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <ShieldCheck className="size-6" /> Paramètres d'accès
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Accordez les onglets soit à une personne précise, soit à un profil : les employés
          rattachés à ce profil héritent automatiquement des rubriques accordées.
        </p>
      </header>

      <Tabs defaultValue="individu">
        <TabsList className="mb-6 h-auto w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="individu">Par individu</TabsTrigger>
          <TabsTrigger value="profil">Par profil</TabsTrigger>
        </TabsList>

        <TabsContent value="individu">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {usersLoading ? <p className="text-muted-foreground text-sm">Chargement…</p> : null}
                {!usersLoading && !users?.length ? (
                  <p className="text-muted-foreground text-sm">Aucun utilisateur enregistré.</p>
                ) : null}
                {users?.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      selected === u.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <span className="block truncate font-medium">
                      {u.nom_complet || u.email || "Utilisateur"}
                    </span>
                    <span className="text-muted-foreground block truncate text-xs">{u.email}</span>
                    {u.roles.includes("admin") ? (
                      <Badge variant="secondary" className="mt-1">
                        Administrateur
                      </Badge>
                    ) : null}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">
                  {current
                    ? `Onglets accordés à ${current.nom_complet || current.email}`
                    : "Sélectionnez un utilisateur"}
                </CardTitle>
                {current ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setBulk.mutate({ userId: current.id, slugs: MODULES.map((m) => m.slug) })
                      }
                    >
                      Tout accorder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBulk.mutate({ userId: current.id, slugs: [] })}
                    >
                      Tout retirer
                    </Button>
                    <Button
                      variant={current.roles.includes("admin") ? "destructive" : "default"}
                      size="sm"
                      onClick={() =>
                        setAdmin.mutate({
                          userId: current.id,
                          admin: !current.roles.includes("admin"),
                        })
                      }
                    >
                      {current.roles.includes("admin")
                        ? "Retirer administrateur"
                        : "Rendre administrateur"}
                    </Button>
                  </div>
                ) : null}
              </CardHeader>
              <CardContent>
                {!current ? (
                  <p className="text-muted-foreground text-sm">
                    Choisissez une personne à gauche pour définir ses rubriques visibles.
                  </p>
                ) : current.roles.includes("admin") ? (
                  <p className="text-muted-foreground text-sm">
                    Cet utilisateur est administrateur : toutes les rubriques lui sont visibles.
                  </p>
                ) : (
                  <ModuleGrid
                    granted={current.slugs}
                    onToggle={(slug, allowed) =>
                      setAccess.mutate({ userId: current.id, slug, allowed })
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profil">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profils</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {profilsLoading ? (
                  <p className="text-muted-foreground text-sm">Chargement…</p>
                ) : null}
                {!profilsLoading && !profils?.length ? (
                  <p className="text-muted-foreground text-sm">
                    Aucun profil enregistré. Créez-en un dans « Structure des profils ».
                  </p>
                ) : null}
                {profils?.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfil(p.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      selectedProfil === p.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <span className="block truncate font-medium">{p.nom}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {[p.departement, p.fonction].filter(Boolean).join(" › ") || "—"}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">
                  {currentProfil
                    ? `Onglets accordés au profil ${currentProfil.nom}`
                    : "Sélectionnez un profil"}
                </CardTitle>
                {currentProfil ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setProfilBulk.mutate({
                          profilId: currentProfil.id,
                          slugs: MODULES.map((m) => m.slug),
                        })
                      }
                    >
                      Tout accorder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProfilBulk.mutate({ profilId: currentProfil.id, slugs: [] })}
                    >
                      Tout retirer
                    </Button>
                  </div>
                ) : null}
              </CardHeader>
              <CardContent>
                {!currentProfil ? (
                  <p className="text-muted-foreground text-sm">
                    Choisissez un profil à gauche pour définir les rubriques visibles par tous les
                    employés qui lui sont rattachés.
                  </p>
                ) : (
                  <ModuleGrid
                    granted={currentProfil.slugs}
                    onToggle={(slug, allowed) =>
                      setProfilAccess.mutate({ profilId: currentProfil.id, slug, allowed })
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
