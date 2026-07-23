import React from "react";
import { Archive, BookOpen, Building2, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ClipboardList, CreditCard, DoorOpen, Grid, Home, Laptop, Layers, LogOut, MessageSquare, Play, Search, Settings, Users, Video } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDeskRole } from "@/context/DeskContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: { label: string; path: string; icon?: React.ElementType }[];
}

const deskGroup: NavGroup = {
  id: "desk",
  title: "Rooster Desk",
  icon: Grid,
  items: [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Tickets", path: "/tickets", icon: MessageSquare },
    { label: "Busca Ticket", path: "/tickets/busca", icon: Search },
    { label: "Categorias", path: "/categorias", icon: Layers },
    { label: "Setores", path: "/setores", icon: Layers },
  ],
};

const roomsGroup: NavGroup = {
  id: "rooms",
  title: "Rooster Rooms",
  icon: DoorOpen,
  items: [
    { label: "Gerenciar salas", path: "/rooms", icon: DoorOpen },
    { label: "Reserva de salas", path: "/rooms/reservas", icon: CalendarDays },
  ],
};

const academyGroup: NavGroup = {
  id: "academy",
  title: "Rooster Academy",
  icon: BookOpen,
  items: [
    { label: "Cursos", path: "/academy/cursos", icon: BookOpen },
    { label: "Controle de aulas", path: "/academy/controle-aulas", icon: MessageSquare },
    { label: "Controle de presença", path: "/academy/controle-presenca", icon: CalendarDays },
    { label: "Grade curricular", path: "/academy/disciplinas", icon: BookOpen },
  ],
};

const roosterAssetsGroup: NavGroup = {
  id: "assets",
  title: "Rooster Assets",
  icon: Archive,
  items: [
    { label: "Gerenciar ativos", path: "/assets", icon: Archive },
    { label: "Empréstimo", path: "/assets/emprestimos", icon: ClipboardList },
  ],
};

const roosterLearnGroup: NavGroup = {
  id: "learn",
  title: "Rooster Learn",
  icon: Laptop,
  items: [
    { label: "Atividades", path: "/learn", icon: Laptop },
    { label: "Gerenciar Atividades", path: "/learn/gerenciar", icon: ClipboardList },
  ],
};

const roosterBoostGroup: NavGroup = {
  id: "boost",
  title: "Rooster Boost",
  icon: Play,
  items: [{ label: "Cursos e videoaulas", path: "/boost", icon: Play }],
};

const roosterFinanceGroup: NavGroup = {
  id: "finance",
  title: "Rooster Finance",
  icon: CreditCard,
  items: [{ label: "Financeiro", path: "/finance", icon: CreditCard }],
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { role, setRole } = useDeskRole();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>("desk");

  const groups = React.useMemo<NavGroup[]>(() => {
    const allGroups = [deskGroup, roomsGroup, academyGroup, roosterAssetsGroup, roosterLearnGroup, roosterBoostGroup, roosterFinanceGroup];

    if (role === "admin") {
      return allGroups;
    }

    if (role === "coordenador") {
      return allGroups;
    }

    if (role === "tecnico") {
      return allGroups;
    }

    return allGroups;
  }, [role]);

  const filteredGroups = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groups;

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(query)),
      }))
      .filter((group) => group.title.toLowerCase().includes(query) || group.items.length > 0);
  }, [groups, searchQuery]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className={`flex flex-col border-r bg-card p-4 transition-all duration-200 ${isCollapsed ? "w-20" : "w-64"}`}>
          <div className={`mb-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between gap-2"}`}>
          <div className="inline-flex items-center justify-center rounded-full bg-black/10 p-1 dark:bg-white/10">
            <img
              src="/icons/rooster.png"
                alt="Rooster Desk Logo"
              width="24"
              height="24"
              className="block dark:brightness-0 dark:invert"
            />
          </div>
          {!isCollapsed && <h2 className="text-xl font-bold text-black dark:text-white">Rooster One</h2>}
          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted"
            aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {!isCollapsed ? (
          <div className="mb-4">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Pesquisar"
              className="h-9"
            />
          </div>
        ) : (
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="rounded-md p-2 text-muted-foreground transition hover:bg-muted"
              aria-label="Abrir busca da navegação"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        )}

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/inicio"
                className={({ isActive }) => `flex items-center rounded-md px-3 py-2 transition hover:bg-muted ${isActive ? "bg-muted" : ""} ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                <Home className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="font-medium">Início</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/usuarios"
                className={({ isActive }) => `flex items-center rounded-md px-3 py-2 transition hover:bg-muted ${isActive ? "bg-muted" : ""} ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                <Users className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="font-medium">Usuários</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/perfil"
                className={({ isActive }) => `flex items-center rounded-md px-3 py-2 transition hover:bg-muted ${isActive ? "bg-muted" : ""} ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="font-medium">Perfil</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/configuracoes"
                className={({ isActive }) => `flex items-center rounded-md px-3 py-2 transition hover:bg-muted ${isActive ? "bg-muted" : ""} ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="font-medium">Configurações</span>}
              </NavLink>
            </li>

            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const Icon = group.icon;
                const isOpen = expandedGroup === group.id;
                return (
                  <li key={group.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedGroup((value) => (value === group.id ? null : group.id))}
                      className={`flex w-full items-center rounded-md px-3 py-2 text-left transition hover:bg-muted ${isCollapsed ? "justify-center" : "justify-between gap-3"}`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && <span className="font-medium">{group.title}</span>}
                      </span>
                      {!isCollapsed && (isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </button>

                    {!isCollapsed && isOpen && (
                      <ul className="mt-1 space-y-1 pl-7">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <li key={item.path}>
                              <NavLink
                                to={item.path}
                                className={({ isActive }) => `flex items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-muted ${isActive ? "bg-muted" : ""}`}
                              >
                                {ItemIcon ? <ItemIcon className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5" />}
                                <span>{item.label}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-muted-foreground">Nenhum item encontrado.</li>
            )}
          </ul>
        </nav>

        <div className="mt-auto space-y-4 border-t pt-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background p-3 text-sm">
              <span className="text-muted-foreground">Permissão:</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as "usuario" | "tecnico" | "coordenador" | "admin")}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="usuario">Usuário</option>
                <option value="tecnico">Técnico</option>
                <option value="coordenador">Coordenador</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {role?.slice(0, 1) || "U"}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted ${isCollapsed ? "justify-center" : "gap-2"}`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
};

export default Layout;
