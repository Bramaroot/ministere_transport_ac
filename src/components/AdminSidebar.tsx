import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  ChevronDown,
  LogOut,
  Building2,
  Calendar,
  Globe,
  FileEdit, // Added FileEdit
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tableau de Bord", url: "/mtac-dash-admin", icon: LayoutDashboard },
  { title: "Actualités", url: "/mtac-dash-admin/news", icon: FileText },
  { title: "Événements", url: "/mtac-dash-admin/events", icon: Calendar },
  { title: "Appels d'Offres", url: "/mtac-dash-admin/tenders", icon: FileEdit },
  { title: "Projets", url: "/mtac-dash-admin/projects", icon: Building2 },
  {
    title: "E-Services",
    url: "/mtac-dash-admin/e-services",
    icon: Globe,
    submenu: [
      { title: "Demandes de Permis", url: "/mtac-dash-admin/demandes/permis-international" },
    ]
  },
  { title: "Utilisateurs", url: "/mtac-dash-admin/users", icon: Users },
  { title: "Mon Profil", url: "/mtac-dash-admin/profile", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const collapsed = state === "collapsed";
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout(); // Utilise la fonction logout du contexte qui gère le refresh token
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar-background">
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-accent rounded-lg flex items-center justify-center">
              <span className="text-sidebar-accent-foreground font-bold text-lg"><img src="/logo-niger.jpg" alt="Logo Niger" className="w-10 h-10 object-contain" /></span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-sm text-sidebar-foreground">Panneau de gestion</h2>
                <p className="text-xs text-muted-foreground">Ministère des Transports et de l'Aviation Civile</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.submenu}
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                    onClick={() => item.submenu && toggleSubmenu(item.title)}
                  >
                    {item.submenu ? (
                      <div className="flex justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenu === item.title ? 'rotate-180' : ''}`} />
                      </div>
                    ) : (
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                  {item.submenu && openSubmenu === item.title && !collapsed && (
                    <SidebarMenuSub>
                      {item.submenu.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link to={subItem.url}>
                            <SidebarMenuSubButton isActive={isActive(subItem.url, true)}>
                              {subItem.title}
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Button at Bottom */}
      <div className="mt-auto border-t border-sidebar-border p-3">
        <SidebarMenuButton
          onClick={handleLogout}
          className="w-full"
          tooltip={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Déconnexion</span>}
        </SidebarMenuButton>
      </div>
    </Sidebar>
  );
}
