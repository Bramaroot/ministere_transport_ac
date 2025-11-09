import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Event } from "@/services/eventService";
import { validateImageFile, uploadImage } from "@/services/uploadService";

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
  }, [event]);

  // Gestion de la sélection d'image
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
        const token = localStorage.getItem('token') || 'Brama';
        const imageUrl = await uploadImage(file, token);
        
        // Mettre à jour l'URL de l'image dans le formulaire
        setFormData({...formData, image_url: imageUrl});
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
    setFormData({...formData, image_url: ""});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type_evenement">Type d'événement</Label>
                <Select value={formData.type_evenement} onValueChange={(value) => handleChange('type_evenement', value)}>
                  <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut">Date de début *</Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) => handleChange('date_debut', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heure_debut">Heure de début</Label>
                <Input
                  id="heure_debut"
                  type="time"
                  value={formData.heure_debut}
                  onChange={(e) => handleChange('heure_debut', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lieu">Lieu *</Label>
                <Input
                  id="lieu"
                  value={formData.lieu}
                  onChange={(e) => handleChange('lieu', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                  <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image de l'événement</Label>
              
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
                <Label htmlFor="image_url">Ou URL manuelle</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {event ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
