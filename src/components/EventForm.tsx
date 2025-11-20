import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, FileText, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Event } from "@/services/eventService";
import { validateImageFile, uploadImage } from "@/services/uploadService";
import { useToast } from "@/hooks/use-toast";

interface EventFormProps {
  event?: Event | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

const eventTypes = [
  { value: 'conference', label: 'Conférence' },
  { value: 'seminaire', label: 'Séminaire' },
  { value: 'formation', label: 'Formation' },
  { value: 'reunion', label: 'Réunion' },
  { value: 'ceremonie', label: 'Cérémonie' },
  { value: 'autre', label: 'Autre' }
];

const eventStatuses = [
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'publie', label: 'Publié' },
  { value: 'annule', label: 'Annulé' },
  { value: 'termine', label: 'Terminé' }
];

export const EventForm = ({ event, onSubmit, onClose, isOpen }: EventFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_debut: '',
    heure_debut: '',
    lieu: '',
    type_evenement: 'conference',
    statut: 'brouillon',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        titre: event.titre || '',
        description: event.description || '',
        date_debut: event.date_debut ? event.date_debut.split('T')[0] : '',
        heure_debut: event.heure_debut || '',
        lieu: event.lieu || '',
        type_evenement: event.type_evenement || 'conference',
        statut: event.statut || 'brouillon',
        image_url: event.image_url || ''
      });
      setImagePreview(event.image_url || '');
    } else {
      setFormData({
        titre: '',
        description: '',
        date_debut: '',
        heure_debut: '',
        lieu: '',
        type_evenement: 'conference',
        statut: 'brouillon',
        image_url: ''
      });
      setImagePreview('');
    }
  }, [event, isOpen]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploading(true);
      try {
        const token = localStorage.getItem('token') || 'Brama';
        const imageUrl = await uploadImage(file, token);

        setFormData({...formData, image_url: imageUrl});
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
    setFormData({...formData, image_url: ""});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </DialogTitle>
          <DialogDescription>
            {event ? 'Modifiez les informations de l\'événement ci-dessous.' : 'Créez un nouvel événement en remplissant le formulaire ci-dessous.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Informations générales
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="titre" className="text-base font-semibold">
                  Titre de l'événement *
                </Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  required
                  className="h-11"
                  placeholder="Ex: Conférence sur la sécurité routière"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_evenement" className="text-base font-semibold">Type d'événement *</Label>
                <Select value={formData.type_evenement} onValueChange={(value) => handleChange('type_evenement', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut" className="text-base font-semibold">Statut *</Label>
                <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Décrivez l'événement en détail..."
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section Date et Lieu */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Date et Lieu
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut" className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date de début *
                </Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) => handleChange('date_debut', e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heure_debut" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Heure de début
                </Label>
                <Input
                  id="heure_debut"
                  type="time"
                  value={formData.heure_debut}
                  onChange={(e) => handleChange('heure_debut', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lieu" className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lieu de l'événement *
                </Label>
                <Input
                  id="lieu"
                  value={formData.lieu}
                  onChange={(e) => handleChange('lieu', e.target.value)}
                  required
                  className="h-11"
                  placeholder="Ex: Palais des Congrès, Niamey"
                />
              </div>
            </div>
          </div>

          {/* Section Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Image de l'événement
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
                  <X className="w-4 h-4 mr-1" />
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
              <Label htmlFor="image_url" className="text-base font-semibold">Ou URL manuelle</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-11"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving || isUploading} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  {event ? 'Modifier' : 'Créer'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
