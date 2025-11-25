import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Filter, Upload, FileText, Tags, DollarSign, Calendar, Image as ImageIcon, Loader2, X as XIcon } from "lucide-react";
import { api } from "@/api";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminFooter from "@/components/AdminFooter";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DialogDescription,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
  const [isSaving, setIsSaving] = useState(false);
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
        toast({
          title: "Fichier invalide",
          description: validation.message || "Veuillez sélectionner une image valide.",
          variant: "destructive",
        });
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
        const token = localStorage.getItem('token') || 'Brama';
        const imageUrl = await uploadImage(file, token);

        // Mettre à jour l'URL de l'image dans le formulaire
        setFormData({...formData, image: imageUrl});
        setImagePreview(imageUrl);

        toast({
          title: "Image uploadée",
          description: "L'image a été uploadée avec succès.",
        });
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        toast({
          title: "Erreur d'upload",
          description: "Impossible d'uploader l'image. Veuillez réessayer.",
          variant: "destructive",
        });
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
    setIsSaving(true);
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
      toast({
        title: "Succès",
        description: "Projet sauvegardé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du projet.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Supprimer un projet
  const deleteProject = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
        toast({
          title: "Succès",
          description: "Projet supprimé avec succès.",
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du projet.",
          variant: "destructive",
        });
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
                                <Eye className="w-4h-4" />
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'Modifiez les informations du projet ci-dessous.' : 'Créez un nouveau projet en remplissant le formulaire ci-dessous.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Informations générales
              </h3>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-base font-semibold">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Titre du projet"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description détaillée du projet"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section Classification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tags className="w-5 h-5 text-primary" />
                Classification
              </h3>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector" className="text-base font-semibold">Secteur *</Label>
                  <Select value={formData.sector} onValueChange={(value) => setFormData({...formData, sector: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transport Terrestre">Transport Terrestre</SelectItem>
                      <SelectItem value="Aviation Civile">Aviation Civile</SelectItem>
                      <SelectItem value="Infrastructures">Infrastructures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-semibold">Statut *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planification">Planification</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section Détails financiers et temporels */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Détails financiers et temporels
              </h3>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-base font-semibold">Budget</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="ex: 45 Milliards FCFA"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-base font-semibold">Durée</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="ex: 2023-2026"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Section Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Image du projet
              </h3>
              <Separator />

              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/30">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <XIcon className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              )}

              {!imagePreview && (
                <div className="relative">
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 hover:border-primary/50 transition-colors bg-muted/30">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-base font-semibold">Cliquez pour uploader une image</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            JPG, PNG, GIF jusqu'à 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isUploading}
                    className="hidden"
                  />
                </div>
              )}

              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-primary p-4 bg-primary/5 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Upload en cours...</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-base font-semibold">Ou URL manuelle</Label>
                <Input
                  id="imageUrl"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Annuler
            </Button>
            <Button onClick={saveProject} disabled={isSaving || isUploading} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  {editingProject ? 'Modifier' : 'Créer'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminProjects;
