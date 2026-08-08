import { Home, Users, BookOpen, ShoppingCart, Settings, User, Zap, Calendar, Trophy } from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  userType?: "master" | "player";
}

export function Sidebar({ activeItem, onItemClick, userType = "master" }: SidebarProps) {
  const baseMenuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "achievements", label: "Conquistas", icon: Trophy },
    { id: "calendar", label: "Agenda", icon: Calendar },
    { id: "library", label: "Biblioteca", icon: BookOpen },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
  ];

  const masterItems = [
    { id: "streaming", label: "Transmitir", icon: Zap },
    { id: "tables", label: "Minhas Mesas", icon: Users },
  ];

  const playerItems = [
    { id: "following", label: "Seguindo", icon: Users },
  ];

  const menuItems = [
    ...baseMenuItems.slice(0, 2), // Home e Perfil
    ...(userType === "master" ? masterItems : playerItems),
    ...baseMenuItems.slice(2), // Resto dos itens (Agenda, Biblioteca, Marketplace)
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeItem === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <IconComponent className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}