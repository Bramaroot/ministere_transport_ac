import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Tender } from "@/services/tenderService";

interface TenderFormProps {
  tender?: Tender | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

const tenderCategories = [
  { value: 'infrastructures', label: 'Infrastructures' },
  { value: 'aviation_civile', label: 'Aviation Civile' },
  { value: 'securite_routiere', label: 'Sécurité Routière' },
  { value: 'equipements', label: 'Équipements' },
  { value: 'services', label: 'Services' },
];

const tenderStatuses = [
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'publie', label: 'Publié' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'cloture', label: 'Clôturé' },
  { value: 'attribue', label: 'Attribué' },
  { value: 'annule', label: 'Annulé' }
];

const currencies = [
  { value: 'XOF', label: 'XOF (Franc CFA)' },
  { value: 'EUR', label: 'EUR (Euro)' },
  { value: 'USD', label: 'USD (Dollar US)' }
];

export const TenderForm = ({ tender, onSubmit, onClose, isOpen }: TenderFormProps) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    reference: '',
    categorie: 'travaux',
    statut: 'brouillon',
    montant_budget: '',
    devise_budget: 'XOF',
    date_limite: '',
    date_publication: ''
  });

  useEffect(() => {
    if (tender) {
      setFormData({
        titre: tender.titre || '',
        description: tender.description || '',
        reference: tender.reference || '',
        categorie: tender.categorie || 'travaux',
        statut: tender.statut || 'brouillon',
        montant_budget: tender.montant_budget?.toString() || '',
        devise_budget: tender.devise_budget || 'XOF',
        date_limite: tender.date_limite ? tender.date_limite.split('T')[0] : '',
        date_publication: tender.date_publication ? tender.date_publication.split('T')[0] : ''
      });
    } else {
      setFormData({
        titre: '',
        description: '',
        reference: '',
        categorie: 'travaux',
        statut: 'brouillon',
        montant_budget: '',
        devise_budget: 'XOF',
        date_limite: '',
        date_publication: ''
      });
    }
  }, [tender]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Préparer les données pour l'envoi
    const submitData = {
      ...formData,
      montant_budget: formData.montant_budget ? parseFloat(formData.montant_budget) : null,
      date_limite: formData.date_limite ? new Date(formData.date_limite).toISOString() : null,
      date_publication: formData.date_publication ? new Date(formData.date_publication).toISOString() : null
    };
    
    onSubmit(submitData);
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {tender ? 'Modifier l\'appel d\'offres' : 'Nouvel appel d\'offres'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
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
                <Label htmlFor="reference">Référence *</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  placeholder="Ex: AO-2024-001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Catégorie et statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie *</Label>
                <Select value={formData.categorie} onValueChange={(value) => handleChange('categorie', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tenderCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tenderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Montant et devise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="montant_budget">Montant du budget</Label>
                <Input
                  id="montant_budget"
                  type="number"
                  step="0.01"
                  value={formData.montant_budget}
                  onChange={(e) => handleChange('montant_budget', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="devise_budget">Devise</Label>
                <Select value={formData.devise_budget} onValueChange={(value) => handleChange('devise_budget', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_limite">Date limite de soumission</Label>
                <Input
                  id="date_limite"
                  type="datetime-local"
                  value={formData.date_limite}
                  onChange={(e) => handleChange('date_limite', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_publication">Date de publication</Label>
                <Input
                  id="date_publication"
                  type="datetime-local"
                  value={formData.date_publication}
                  onChange={(e) => handleChange('date_publication', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {tender ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};



