import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileEdit, Calendar, DollarSign, Tags, Loader2 } from "lucide-react";
import { Tender } from "@/services/tenderService";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
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
  }, [tender, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Préparer les données pour l'envoi
      const submitData = {
        ...formData,
        montant_budget: formData.montant_budget ? parseFloat(formData.montant_budget) : null,
        date_limite: formData.date_limite ? new Date(formData.date_limite).toISOString() : null,
        date_publication: formData.date_publication ? new Date(formData.date_publication).toISOString() : null
      };

      await onSubmit(submitData);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileEdit className="w-5 h-5 text-primary" />
            </div>
            {tender ? 'Modifier l\'appel d\'offres' : 'Nouvel appel d\'offres'}
          </DialogTitle>
          <DialogDescription>
            {tender ? 'Modifiez les informations de l\'appel d\'offres ci-dessous.' : 'Créez un nouvel appel d\'offres en remplissant le formulaire ci-dessous.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-primary" />
              Informations générales
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="titre" className="text-base font-semibold">
                  Titre de l'appel d'offres *
                </Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  required
                  className="h-11"
                  placeholder="Ex: Construction d'une route nationale"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference" className="text-base font-semibold">Référence *</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  placeholder="Ex: AO-2024-001"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut" className="text-base font-semibold">Statut *</Label>
                <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                  <SelectTrigger className="h-11">
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-base font-semibold">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Décrivez l'appel d'offres en détail..."
                  className="resize-none"
                  required
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

            <div className="space-y-2">
              <Label htmlFor="categorie" className="text-base font-semibold">Catégorie *</Label>
              <Select value={formData.categorie} onValueChange={(value) => handleChange('categorie', value)}>
                <SelectTrigger className="h-11">
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
          </div>

          {/* Section Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Budget
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="montant_budget" className="text-base font-semibold">Montant du budget</Label>
                <Input
                  id="montant_budget"
                  type="number"
                  step="0.01"
                  value={formData.montant_budget}
                  onChange={(e) => handleChange('montant_budget', e.target.value)}
                  placeholder="0.00"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="devise_budget" className="text-base font-semibold">Devise</Label>
                <Select value={formData.devise_budget} onValueChange={(value) => handleChange('devise_budget', value)}>
                  <SelectTrigger className="h-11">
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
          </div>

          {/* Section Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Dates importantes
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_publication" className="text-base font-semibold">Date de publication</Label>
                <Input
                  id="date_publication"
                  type="date"
                  value={formData.date_publication}
                  onChange={(e) => handleChange('date_publication', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_limite" className="text-base font-semibold">Date limite de soumission</Label>
                <Input
                  id="date_limite"
                  type="date"
                  value={formData.date_limite}
                  onChange={(e) => handleChange('date_limite', e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  {tender ? 'Modifier' : 'Créer'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};



