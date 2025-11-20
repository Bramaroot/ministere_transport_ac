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
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, Upload, X, Loader2, FileText, Calendar, Save, Sparkles } from "lucide-react";
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
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/api";
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
  slug?: string; // Généré automatiquement par le backend
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
      const response = await api.get("/news");
      const data = response.data;

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
        const imageUrl = await uploadImage(file);

        // Mettre à jour l'URL de l'image dans le formulaire
        // On garde l'aperçu base64 local pour l'affichage, mais on stocke l'URL serveur
        setValue("url_image", imageUrl);

        toast({
          title: "Succès",
          description: "Image uploadée avec succès",
        });
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        // Si l'upload échoue, on retire l'aperçu et l'image sélectionnée
        setImagePreview("");
        setSelectedImage(null);
        setValue("url_image", "");
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
    try {
      // Préparer les données avec cree_par pour la création
      const requestData = {
        ...data,
        cree_par: 1 // ID de l'utilisateur admin par défaut
      };

      if (editingNews) {
        // Mise à jour
        await api.put(`/news/${editingNews.id}`, requestData);
      } else {
        // Création
        await api.post('/news', requestData);
      }

      toast({
        title: "Succès",
        description: `L'actualité a été ${editingNews ? "mise à jour" : "créée"} avec succès.`,
      });

      fetchNews();
      handleCloseDialog(); // Utiliser la fonction de fermeture qui nettoie tout
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: `Échec de la ${editingNews ? "mise à jour" : "création"} de l'actualité: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNews(null);
    setSelectedImage(null);
    setImagePreview("");
    reset({ titre: "", contenu: "", url_image: "", active: true });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/news/${id}`);

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
            <div className="container py-8 max-w-7xl">
              {/* En-tête amélioré */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Actualités</h2>
                    <p className="text-muted-foreground mt-1">
                      {news.length} {news.length > 1 ? 'publications' : 'publication'} au total
                    </p>
                  </div>
                  <Button className="gap-2 shadow-md" size="lg" onClick={() => handleOpenDialog()}>
                    <Plus className="w-5 h-5" />
                    Nouvelle Actualité
                  </Button>
                </div>
              </div>

              {/* Grille moderne des actualités */}
              <div className="grid grid-cols-1 gap-6">
                {news.map((item, index) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col md:flex-row">
                      {/* Image de prévisualisation */}
                      <div className="md:w-64 h-48 md:h-auto bg-muted relative group">
                        {item.url_image ? (
                          <>
                            <img
                              src={item.url_image}
                              alt={item.titre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                      <svg class="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                      </svg>
                                      <span class="text-sm">Image non disponible</span>
                                    </div>
                                    <div class="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md">
                                      ${index + 1}
                                    </div>
                                  `;
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <span className="text-sm">Aucune image</span>
                          </div>
                        )}
                        {/* Numéro */}
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold line-clamp-2">{item.titre}</h3>
                              <Badge variant={item.active ? "default" : "secondary"} className="shrink-0">
                                {item.active ? "Publié" : "Brouillon"}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                              {item.contenu}
                            </p>
                          </div>
                        </div>

                        {/* Métadonnées et actions */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {new Date(item.date_creation).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                            {item.slug && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                /{item.slug}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(item)}
                              className="gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Modifier
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Supprimer
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer l'actualité "{item.titre}" ?
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Supprimer définitivement
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Message si aucune actualité */}
                {news.length === 0 && (
                  <Card className="p-12">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucune actualité</h3>
                      <p className="text-muted-foreground mb-6">
                        Commencez par créer votre première actualité
                      </p>
                      <Button onClick={() => handleOpenDialog()} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Créer une actualité
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>

      {/* Dialog for Add/Edit News - Version Moderne */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleCloseDialog(); }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl flex items-center gap-2">
                {editingNews ? (
                  <>
                    <Edit className="w-6 h-6" />
                    Modifier l'actualité
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Créer une nouvelle actualité
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6">
              {/* Section Image - Preview immédiate et intuitive */}
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Image de couverture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview de l'image */}
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border-2"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload-change"
                          disabled={isUploading}
                        />
                        <Label
                          htmlFor="image-upload-change"
                          className="cursor-pointer"
                        >
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            disabled={isUploading}
                            asChild
                          >
                            <span>
                              <Upload className="w-4 h-4" />
                              Changer
                            </span>
                          </Button>
                        </Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload-initial"
                        disabled={isUploading}
                      />
                      <Label
                        htmlFor="image-upload-initial"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold mb-1">
                            Cliquez pour sélectionner une image
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ou glissez-déposez votre fichier ici
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, GIF, WebP • Max 5MB
                        </p>
                      </Label>
                    </div>
                  )}

                  {/* Upload progress */}
                  {isUploading && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Upload en cours...
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                          Veuillez patienter pendant l'upload de l'image
                        </p>
                      </div>
                    </div>
                  )}

                  {/* URL manuelle alternative */}
                  <div className="pt-4 border-t">
                    <Label htmlFor="url_image" className="text-sm text-muted-foreground mb-2 block">
                      Ou entrez une URL d'image
                    </Label>
                    <Input
                      id="url_image"
                      placeholder="https://exemple.com/image.jpg"
                      {...register("url_image")}
                      disabled={isUploading}
                    />
                    {errors.url_image && (
                      <p className="text-sm text-red-500 mt-1">{errors.url_image.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Section Contenu */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titre" className="text-base font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Titre de l'actualité
                  </Label>
                  <Input
                    id="titre"
                    {...register("titre")}
                    placeholder="Entrez un titre accrocheur..."
                    className="text-lg h-12"
                  />
                  {errors.titre && (
                    <p className="text-sm text-red-500 mt-1">{errors.titre.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contenu" className="text-base font-semibold mb-2 block">
                    Contenu
                  </Label>
                  <Textarea
                    id="contenu"
                    {...register("contenu")}
                    rows={12}
                    placeholder="Rédigez le contenu de votre actualité..."
                    className="resize-none"
                  />
                  {errors.contenu && (
                    <p className="text-sm text-red-500 mt-1">{errors.contenu.message}</p>
                  )}
                </div>
              </div>

              {/* Options de publication */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="active" className="text-base font-semibold">
                        Publier l'actualité
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Rendre cette actualité visible sur le site public
                      </p>
                    </div>
                    <Switch
                      id="active"
                      checked={watch("active")}
                      onCheckedChange={(checked) => setValue("active", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" size="lg">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" size="lg" className="gap-2" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Upload...
                  </>
                ) : (
                  <>
                    {editingNews ? (
                      <>
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Créer l'actualité
                      </>
                    )}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminNews;