import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Filter, Upload } from "lucide-react";
import { api } from "@/api";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminFooter from "@/components/AdminFooter";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadProjectImage, validateImageFile, uploadImage } from "@/services/uploadService";

interface Project {
  id: string;
  title: string;
  image?: string;
  sector?: string;
  description?: string;
  status?: string;
  budget?: string;
  duration?: string;
  created_at?: string;
  updated_at?: string;
  created_by_nom?: string;
  created_by_prenom?: string;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    image: "",
    sector: "",
    description: "",
    status: "En cours",
    budget: "",
    duration: ""
  });

  // Charger les projets
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');

      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fonction pour uploader une image de projet
  const handleImageUpload = async (projectId: string, file: File) => {
    try {
      await uploadProjectImage(projectId, file);
      await fetchProjects(); // Rafraîchir la liste des projets
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  };

  // Gestion de la sélection d'image dans le formulaire
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Valider le fichier
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.message || "Fichier invalide");
        return;
      }

      setSelectedImage(file);
      
      // Créer un aperçu local
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Uploader l'image automatiquement
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file);
        
        // Mettre à jour l'URL de l'image dans le formulaire
        setFormData({...formData, image: imageUrl});
        setImagePreview(imageUrl);
        
        alert('Image uploadée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert('Erreur lors de l\'upload de l\'image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({...formData, image: ""});
  };

  // Filtrer les projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesSector = sectorFilter === "all" || project.sector === sectorFilter;
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  // Ouvrir le dialogue pour créer/modifier un projet
  const openDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        id: project.id,
        title: project.title,
        image: project.image || "",
        sector: project.sector || "",
        description: project.description || "",
        status: project.status || "En cours",
        budget: project.budget || "",
        duration: project.duration || ""
      });
      setImagePreview(project.image || "");
    } else {
      setEditingProject(null);
      setFormData({
        id: "",
        title: "",
        image: "",
        sector: "",
        description: "",
        status: "En cours",
        budget: "",
        duration: ""
      });
      setImagePreview("");
    }
    setIsDialogOpen(true);
  };

  // Sauvegarder le projet
  const saveProject = async () => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, formData);
      } else {
        await api.post('/projects', formData);
      }

      setIsDialogOpen(false);
      fetchProjects();
      setFormData({
        id: "",
        title: "",
        image: "",
        sector: "",
        description: "",
        status: "En cours",
        budget: "",
        duration: ""
      });
      alert('Projet sauvegardé avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du projet');
    }
  };

  // Supprimer un projet
  const deleteProject = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
        alert('Projet supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du projet');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "Terminé":
        return "bg-green-100 text-green-800";
      case "Planification":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Projets</h1>
              <p className="text-gray-600">Gérez les projets du Ministère des Transports</p>
            </div>

            {/* Filtres et recherche */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un projet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="Planification">Planification</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les secteurs</SelectItem>
                      <SelectItem value="Transport Terrestre">Transport Terrestre</SelectItem>
                      <SelectItem value="Aviation Civile">Aviation Civile</SelectItem>
                      <SelectItem value="Infrastructures">Infrastructures</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={() => openDialog()} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Projet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table des projets */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des Projets ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projet</TableHead>
                        <TableHead>Secteur</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Créé le</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {project.image && (
                                <img 
                                  src={project.image} 
                                  alt={project.title}
                                  className="w-12 h-12 object-cover rounded-lg border"
                                />
                              )}
                              <div>
                                <div className="font-medium">{project.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {project.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.sector}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.status || "")}>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{project.budget}</TableCell>
                          <TableCell>{project.duration}</TableCell>
                          <TableCell>
                            {project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`/projets/${project.id}`, '_blank')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDialog(project)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                      handleImageUpload(project.id, file);
                                    }
                                  };
                                  input.click();
                                }}
                                title="Uploader une image"
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteProject(project.id)}
                                className="text-red-600 hover:text-red-700"
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
        </div>
        
        <AdminFooter />
        </div>
      </div>

      {/* Dialogue de création/modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id">ID du projet</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                placeholder="ex: projet-route-niamey"
              />
            </div>
            
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Titre du projet"
              />
            </div>
            
            <div>
              <Label htmlFor="sector">Secteur</Label>
              <Select value={formData.sector} onValueChange={(value) => setFormData({...formData, sector: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transport Terrestre">Transport Terrestre</SelectItem>
                  <SelectItem value="Aviation Civile">Aviation Civile</SelectItem>
                  <SelectItem value="Infrastructures">Infrastructures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planification">Planification</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="ex: 45 Milliards FCFA"
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="ex: 2023-2026"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="image">Image du projet</Label>
              
              {/* Aperçu de l'image */}
              {imagePreview && (
                <div className="mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="mt-2"
                  >
                    Supprimer l'image
                  </Button>
                </div>
              )}
              
              {/* Upload d'image */}
              <div className="space-y-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isUploading}
                />
                {isUploading && (
                  <p className="text-sm text-blue-600">Upload en cours...</p>
                )}
                <p className="text-xs text-gray-500">
                  JPG, PNG, GIF jusqu'à 5MB
                </p>
              </div>
              
              {/* URL manuelle (optionnel) */}
              <div className="mt-2">
                <Label htmlFor="imageUrl">Ou URL manuelle</Label>
                <Input
                  id="imageUrl"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="URL de l'image du projet"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description détaillée du projet"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveProject}>
              {editingProject ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminProjects;
