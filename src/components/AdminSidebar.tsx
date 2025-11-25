import { useState, useEffect } from "react";
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
  FileEdit,
  Settings,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// La définition des liens inclut maintenant les rôles autorisés
const menuItems = [
  { title: "Tableau de Bord", url: "/mtac-dash-admin", icon: LayoutDashboard, allowedRoles: ['admin', 'editeur', 'consultant'] },
  { title: "Actualités", url: "/mtac-dash-admin/news", icon: FileText, allowedRoles: ['admin', 'editeur'] },
  { title: "Événements", url: "/mtac-dash-admin/events", icon: Calendar, allowedRoles: ['admin', 'editeur'] },
  { title: "Appels d'Offres", url: "/mtac-dash-admin/tenders", icon: FileEdit, allowedRoles: ['admin', 'editeur'] },
  { title: "Projets", url: "/mtac-dash-admin/projects", icon: Building2, allowedRoles: ['admin', 'editeur'] },
  {
    title: "E-Services",
    url: "/mtac-dash-admin/e-services",
    icon: Globe,
    allowedRoles: ['admin', 'consultant'], // Règle personnalisée
    submenu: [
      { title: "Demandes de Permis", url: "/mtac-dash-admin/demandes/permis-international" },
    ]
  },
  { title: "Utilisateurs", url: "/mtac-dash-admin/users", icon: Users, allowedRoles: ['admin', 'consultant'] }, // Règle personnalisée
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const collapsed = state === "collapsed";

  const getInitialOpenSubmenu = () => {
    // ... (le reste de la fonction ne change pas)
    for (const item of menuItems) {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(subItem =>
          location.pathname === subItem.url || location.pathname.startsWith(subItem.url)
        );
        if (hasActiveSubmenu) {
          return item.title;
        }
      }
    }
    return null;
  };

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(getInitialOpenSubmenu());

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/mtac-dash-login");
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  useEffect(() => {
    const activeSubmenu = getInitialOpenSubmenu();
    if (activeSubmenu) {
      setOpenSubmenu(activeSubmenu);
    }
  }, [location.pathname]);

  const getUserInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
    }
    if (user?.nom_utilisateur) {
      return user.nom_utilisateur.substring(0, 2).toUpperCase();
    }
    return "AD";
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
              {menuItems
                // On filtre les liens en fonction du rôle de l'utilisateur
                .filter(item => user && item.allowedRoles.includes(user.role))
                .map((item) => (
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

      {/* Section Utilisateur en bas */}
      <div className="mt-auto border-t border-sidebar-border">
        {/* Profil utilisateur */}
        <div className="p-3 border-b border-sidebar-border">
          <Link to="/mtac-dash-admin/profile">
            <SidebarMenuButton
              isActive={isActive("/mtac-dash-admin/profile", true)}
              className="w-full hover:bg-sidebar-accent"
              tooltip={collapsed ? "Mon Profil" : undefined}
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                      {user?.prenom || user?.nom_utilisateur || "Administrateur"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.role || "Admin"}
                    </p>
                  </div>
                )}
                {!collapsed && (
                  <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>
            </SidebarMenuButton>
          </Link>
        </div>

        {/* Bouton de déconnexion avec confirmation */}
        <div className="p-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <SidebarMenuButton
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                tooltip={collapsed ? "Déconnexion" : undefined}
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>Déconnexion</span>}
              </SidebarMenuButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <span>Confirmer la déconnexion</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Êtes-vous sûr de vouloir vous déconnecter de votre session administrateur ?
                  <br />
                  <span className="text-sm text-muted-foreground mt-2 block">
                    Vous devrez vous reconnecter pour accéder à nouveau au panneau d'administration.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Sidebar>
  );
}
