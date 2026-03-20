import React from "react";
import { Home, Users, Settings, MessageSquare, Layers, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Usuários", path: "/usuarios" },
  { icon: MessageSquare, label: "Perfil", path: "/perfil" },
  { icon: MessageSquare, label: "Tickets", path: "/tickets" },
  { icon: Layers, label: "Categorias", path: "/categorias" },
  { icon: Layers, label: "Setores", path: "/setores" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-6 flex items-center gap-2">
          <div className="inline-flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 p-1">
            <img
              src="/icons/rooster.png"
              alt="Rooster Desk Logo"
              width="24"
              height="24"
              className="block dark:filter dark:brightness-0 dark:invert"
            />
          </div>
          <h2 className="text-xl font-bold text-black dark:text-white">Rooster Desk</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted ${isActive ? "bg-muted" : ""}`
                    }
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : <span className="w-4" />}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
