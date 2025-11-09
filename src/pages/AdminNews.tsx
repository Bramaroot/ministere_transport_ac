import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, X ,Loader2} from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import { uploadNewsImage, validateImageFile, uploadImage } from "@/services/uploadService";
 

// Schéma de validation avec Zod
const newsSchema = z.object({
  titre: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  contenu: z.string().min(20, "Le contenu doit contenir au moins 20 caractères"),
  url_image: z.string().optional().or(z.literal('')),
  active: z.boolean().default(true),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsArticle {
  id: number;
  titre: string;
  contenu: string;
  url_image?: string;
  active: boolean;
  date_creation: string;
}

const AdminNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
  });

  const fetchNews = async () => {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch("/api/news", { headers });
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      // Défensivement vérifier si la réponse est un tableau ou un objet avec une propriété `data`
      if (Array.isArray(data)) {
        setNews(data);
      } else if (data && Array.isArray(data.data)) {
        setNews(data.data);
      } else {
        console.error("Format de réponse de l'API inattendu:", data);
        setNews([]); // Assurer que `news` est toujours un tableau pour éviter les crashs
      }
    } catch (error) {
      console.error('Erreur lors du chargement des actualités:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenDialog = (article: NewsArticle | null = null) => {
    setEditingNews(article);
    setSelectedImage(null);
    setImagePreview("");
    if (article) {
      setValue("titre", article.titre);
      setValue("contenu", article.contenu);
      setValue("url_image", article.url_image || "");
      setValue("active", article.active);
      if (article.url_image) {
        setImagePreview(article.url_image);
      }
    } else {
      reset({ titre: "", contenu: "", url_image: "", active: true });
    }
    setIsDialogOpen(true);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Valider le fichier
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Erreur",
          description: validation.message || "Fichier invalide",
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
        setValue("url_image", imageUrl);
        setImagePreview(imageUrl);
        
        toast({
          title: "Succès",
          description: "Image uploadée avec succès",
        });
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        toast({
          title: "Erreur",
          description: "Échec de l'upload de l'image",
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
    setValue("url_image", "");
  };

  const onSubmit: SubmitHandler<NewsFormValues> = async (data) => {
    const url = editingNews ? `/api/news/${editingNews.id}` : "/api/news";
    const method = editingNews ? "PUT" : "POST";

    try {
      // Préparer les données avec cree_par pour la création
      const requestData = {
        ...data,
        cree_par: 1 // ID de l'utilisateur admin par défaut
      };

      const token = localStorage.getItem('token') || 'Brama';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      toast({
        title: "Succès",
        description: `L'actualité a été ${editingNews ? "mise à jour" : "créée"} avec succès.`,
      });

      fetchNews();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: `Échec de la ${editingNews ? "mise à jour" : "création"} de l'actualité: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`/api/news/${id}`, {
         method: "DELETE",
         headers
        });
      if (!response.ok) throw new Error("Deletion failed");

      toast({
        title: "Succès",
        description: "L'actualité a été supprimée avec succès.",
      });
      fetchNews();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Échec de la suppression de l'actualité.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 bg-muted/30">
            <div className="glass-card border-b sticky top-0 z-40 mb-8">
              <div className="container py-4 flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-bold">Gestion des Actualités</h1>
                  <p className="text-sm text-muted-foreground">Créer et gérer les publications</p>
                </div>
              </div>
            </div>
            <div className="container py-8">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Actualités</h2>
                  <p className="text-muted-foreground">{news.length} publications au total</p>
                </div>
                <Button className="gap-2" onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4" />
                  Nouvelle Actualité
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des Actualités</CardTitle>
                  <CardDescription>Gérez vos publications et brouillons</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Titre</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date de création</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.url_image ? (
                              <div className="w-16 h-12 rounded-lg overflow-hidden border">
                                <img 
                                  src={item.url_image} 
                                  alt={item.titre}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-12 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">Aucune</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{item.titre}</TableCell>
                          <TableCell>
                            <Badge variant={item.active ? "default" : "secondary"}>
                              {item.active ? "Actif" : "Inactif"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.date_creation).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action est irréversible et supprimera définitivement cette actualité.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>

      {/* Dialog for Add/Edit News */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{editingNews ? "Modifier" : "Créer"} une actualité</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titre">Titre</Label>
                <Input id="titre" {...register("titre")} />
                {errors.titre && <p className="text-sm text-red-500">{errors.titre.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contenu">Contenu</Label>
                <Textarea id="contenu" {...register("contenu")} rows={10} />
                {errors.contenu && <p className="text-sm text-red-500">{errors.contenu.message}</p>}
              </div>
              
              {/* Upload d'image */}
              <div className="grid gap-2">
                <Label>Image de l'actualité</Label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <Label 
                        htmlFor="image-upload" 
                        className={`flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Upload en cours..." : selectedImage ? "Changer l'image" : "Sélectionner une image"}
                      </Label>
                      
                      <div className="text-sm text-muted-foreground">
                        ou
                      </div>
                      
                      <div className="flex-1">
                        <Input 
                          placeholder="URL de l'image (optionnel)" 
                          {...register("url_image")}
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                    
                    {isUploading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Upload de l'image en cours...
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Formats acceptés: JPG, PNG, GIF, WebP. Taille maximale: 5MB
                    </div>
                  </div>
                  
                  {errors.url_image && <p className="text-sm text-red-500">{errors.url_image.message}</p>}
                </div>
              </div>

              {/* Switch pour activer/désactiver */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={watch("active")} 
                  onCheckedChange={(checked) => setValue("active", checked)}
                />
                <Label htmlFor="active">Actualité active (visible sur le site)</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Annuler</Button>
              </DialogClose>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminNews;