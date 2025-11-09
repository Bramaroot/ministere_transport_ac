import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import { Plus, Edit, Trash2, Shield, AlertCircle, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getUsers, deleteUser, createUser, updateUser, User, CreateUserData, UpdateUserData } from "@/services/userService";
import { UserForm } from "@/components/UserForm";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (user: User | null) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
    try {
      let response;
      const isEditing = !!selectedUser;

      if (isEditing) {
        response = await updateUser(selectedUser.id, data as UpdateUserData);
      } else {
        response = await createUser(data as CreateUserData);
      }

      if (response.success) {
        toast({
          title: isEditing ? "Utilisateur modifié" : "Utilisateur créé",
          description: `L'utilisateur a été ${isEditing ? 'modifié' : 'créé'} avec succès.`,
        });
        handleCloseForm();
        fetchUsers(); // Re-fetch users to update the list
      } else {
        throw new Error(response.message || 'Une erreur est survenue.');
      }
    } catch (error: any) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${name}" ?`)) {
      try {
        const response = await deleteUser(id);
        
        if (response.success) {
          setUsers(users.filter(user => user.id !== id));
          toast({
            title: "Utilisateur supprimé",
            description: `L'utilisateur "${name}" a été supprimé avec succès.`,
          });
        } else {
          throw new Error(response.message || "Erreur lors de la suppression.");
        }
      } catch (error: any) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors de la suppression de l'utilisateur.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.prenom || ''} ${user.nom || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "editeur":
        return "secondary";
      case "consultant":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: boolean) => {
    return status ? "default" : "secondary";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <main className="flex-1 bg-muted/30">
            <div className="glass-card border-b sticky top-0 z-40 mb-8">
              <div className="container py-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-xl font-bold">Gestion des Utilisateurs</h1>
                    <p className="text-sm text-muted-foreground">
                      Gérer les administrateurs et utilisateurs du système
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="container py-8">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
                  <p className="text-muted-foreground">
                    {loading ? "Chargement..." : `${filteredUsers.length} utilisateur(s) trouvé(s)`}
                  </p>
                </div>
                <Button className="gap-2" onClick={() => handleOpenForm(null)}>
                  <Plus className="w-4 h-4" />
                  Nouvel Utilisateur
                </Button>
              </div>

              {/* Search and Filters */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par nom, prénom, email..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant={filterRole === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterRole("all")}
                      >
                        Tous
                      </Button>
                      <Button
                        variant={filterRole === "admin" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterRole("admin")}
                      >
                        Admin
                      </Button>
                      <Button
                        variant={filterRole === "editeur" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterRole("editeur")}
                      >
                        Éditeur
                      </Button>
                      <Button
                        variant={filterRole === "consultant" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterRole("consultant")}
                      >
                        Consultant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des Utilisateurs</CardTitle>
                  <CardDescription>
                    Gérez les utilisateurs du système
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-2">Chargement des utilisateurs...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-500 mb-4">{error}</p>
                      <Button onClick={fetchUsers}>Réessayer</Button>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun utilisateur trouvé</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || filterRole !== "all" 
                          ? "Aucun utilisateur ne correspond à vos critères de recherche."
                          : "Aucun utilisateur n'a été trouvé dans le système."
                        }
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom complet</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Dernière Connexion</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.prenom} {user.nom}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1 capitalize">
                                <Shield className="w-3 h-3" />
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(user.actif)}>
                                {user.actif ? "Actif" : "Inactif"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.derniere_connexion 
                                ? new Date(user.derniere_connexion).toLocaleDateString('fr-FR')
                                : "Jamais"
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" title="Modifier" onClick={() => handleOpenForm(user)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="Supprimer"
                                  onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
          
          <AdminFooter />
        </div>
      </div>
      <UserForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />
    </SidebarProvider>
  );
};

export default AdminUsers;
