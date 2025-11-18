import { useState, useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Upload, FileText, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HomologationVehicule = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations du demandeur
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    profession: "",
    
    // Informations du véhicule
    marque: "",
    modele: "",
    annee: "",
    numeroChassis: "",
    numeroMoteur: "",
    couleur: "",
    typeVehicule: "",
    carburant: "",
    puissance: "",
    cylindree: "",
    nombrePlaces: "",
    poidsVide: "",
    chargeUtile: "",
    
    // Informations d'importation
    paysOrigine: "",
    dateImportation: "",
    numeroDouane: "",
    valeurDouane: "",
    transporteur: "",
    
    // Documents
    documents: {
      factureVente: null as File | null,
      certificatDouane: null as File | null,
      certificatOrigine: null as File | null,
      certificatConformite: null as File | null,
      photosVehicule: null as File | null,
      pieceIdentite: null as File | null
    },
    
    // Conditions
    accepteConditions: false,
    accepteTraitementDonnees: false
  });

  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Demande soumise avec succès",
      description: "Votre demande d'homologation a été enregistrée. Vous recevrez un email de confirmation avec les prochaines étapes.",
    });
    
    // Ici, vous pourriez envoyer les données à votre API
  };

  const steps = [
    { number: 1, title: "Informations du demandeur", icon: FileText },
    { number: 2, title: "Caractéristiques du véhicule", icon: Car },
    { number: 3, title: "Documents", icon: Upload },
    { number: 4, title: "Validation", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen">
      <PageBanner 
        title="Demande d'Homologation de Véhicule"
        description="Homologuez votre véhicule importé selon les normes nigériennes"
      />

      <main className="py-16">
        <div className="container max-w-4xl">
          {/* Avertissement */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Important</h3>
                <p className="text-sm text-yellow-700">
                  L'homologation est obligatoire pour tous les véhicules importés. 
                  Le processus inclut une inspection technique et peut prendre jusqu'à 10 jours ouvrables.
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              {/* Step 1: Informations du demandeur */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Informations du Demandeur</h2>
                    <p className="text-muted-foreground">
                      Veuillez renseigner vos informations personnelles
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        placeholder="Votre nom de famille"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => handleInputChange('prenom', e.target.value)}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        placeholder="+227 XX XX XX XX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre.email@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="adresse">Adresse complète *</Label>
                      <Textarea
                        id="adresse"
                        value={formData.adresse}
                        onChange={(e) => handleInputChange('adresse', e.target.value)}
                        placeholder="Votre adresse complète"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        placeholder="Votre profession"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Caractéristiques du véhicule */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Car className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Caractéristiques du Véhicule</h2>
                    <p className="text-muted-foreground">
                      Renseignez les informations techniques de votre véhicule
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="marque">Marque *</Label>
                      <Input
                        id="marque"
                        value={formData.marque}
                        onChange={(e) => handleInputChange('marque', e.target.value)}
                        placeholder="Ex: Toyota, Peugeot, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="modele">Modèle *</Label>
                      <Input
                        id="modele"
                        value={formData.modele}
                        onChange={(e) => handleInputChange('modele', e.target.value)}
                        placeholder="Ex: Corolla, 206, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="annee">Année de fabrication *</Label>
                      <Input
                        id="annee"
                        type="number"
                        min="1990"
                        max="2025"
                        value={formData.annee}
                        onChange={(e) => handleInputChange('annee', e.target.value)}
                        placeholder="Ex: 2020"
                      />
                    </div>
                    <div>
                      <Label htmlFor="couleur">Couleur *</Label>
                      <Input
                        id="couleur"
                        value={formData.couleur}
                        onChange={(e) => handleInputChange('couleur', e.target.value)}
                        placeholder="Ex: Blanc, Noir, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="numeroChassis">Numéro de châssis *</Label>
                      <Input
                        id="numeroChassis"
                        value={formData.numeroChassis}
                        onChange={(e) => handleInputChange('numeroChassis', e.target.value)}
                        placeholder="Numéro VIN du véhicule"
                      />
                    </div>
                    <div>
                      <Label htmlFor="numeroMoteur">Numéro de moteur *</Label>
                      <Input
                        id="numeroMoteur"
                        value={formData.numeroMoteur}
                        onChange={(e) => handleInputChange('numeroMoteur', e.target.value)}
                        placeholder="Numéro du moteur"
                      />
                    </div>
                    <div>
                      <Label htmlFor="typeVehicule">Type de véhicule *</Label>
                      <Select value={formData.typeVehicule} onValueChange={(value) => handleInputChange('typeVehicule', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voiture">Voiture particulière</SelectItem>
                          <SelectItem value="camion">Camion</SelectItem>
                          <SelectItem value="bus">Bus/Autocar</SelectItem>
                          <SelectItem value="moto">Moto/Scooter</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="carburant">Type de carburant *</Label>
                      <Select value={formData.carburant} onValueChange={(value) => handleInputChange('carburant', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le carburant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="essence">Essence</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybride">Hybride</SelectItem>
                          <SelectItem value="electrique">Électrique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="puissance">Puissance (CV) *</Label>
                      <Input
                        id="puissance"
                        type="number"
                        value={formData.puissance}
                        onChange={(e) => handleInputChange('puissance', e.target.value)}
                        placeholder="Ex: 120"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cylindree">Cylindrée (cm³)</Label>
                      <Input
                        id="cylindree"
                        type="number"
                        value={formData.cylindree}
                        onChange={(e) => handleInputChange('cylindree', e.target.value)}
                        placeholder="Ex: 1600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nombrePlaces">Nombre de places *</Label>
                      <Input
                        id="nombrePlaces"
                        type="number"
                        min="1"
                        max="50"
                        value={formData.nombrePlaces}
                        onChange={(e) => handleInputChange('nombrePlaces', e.target.value)}
                        placeholder="Ex: 5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="poidsVide">Poids à vide (kg)</Label>
                      <Input
                        id="poidsVide"
                        type="number"
                        value={formData.poidsVide}
                        onChange={(e) => handleInputChange('poidsVide', e.target.value)}
                        placeholder="Ex: 1200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chargeUtile">Charge utile (kg)</Label>
                      <Input
                        id="chargeUtile"
                        type="number"
                        value={formData.chargeUtile}
                        onChange={(e) => handleInputChange('chargeUtile', e.target.value)}
                        placeholder="Ex: 500"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Informations d'importation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paysOrigine">Pays d'origine *</Label>
                        <Input
                          id="paysOrigine"
                          value={formData.paysOrigine}
                          onChange={(e) => handleInputChange('paysOrigine', e.target.value)}
                          placeholder="Pays où le véhicule a été acheté"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateImportation">Date d'importation *</Label>
                        <Input
                          id="dateImportation"
                          type="date"
                          value={formData.dateImportation}
                          onChange={(e) => handleInputChange('dateImportation', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="numeroDouane">Numéro de déclaration douanière *</Label>
                        <Input
                          id="numeroDouane"
                          value={formData.numeroDouane}
                          onChange={(e) => handleInputChange('numeroDouane', e.target.value)}
                          placeholder="Numéro de la déclaration"
                        />
                      </div>
                      <div>
                        <Label htmlFor="valeurDouane">Valeur en douane (FCFA) *</Label>
                        <Input
                          id="valeurDouane"
                          type="number"
                          value={formData.valeurDouane}
                          onChange={(e) => handleInputChange('valeurDouane', e.target.value)}
                          placeholder="Ex: 5000000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="transporteur">Transporteur/Importateur</Label>
                        <Input
                          id="transporteur"
                          value={formData.transporteur}
                          onChange={(e) => handleInputChange('transporteur', e.target.value)}
                          placeholder="Nom de l'entreprise de transport"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Téléchargement des Documents</h2>
                    <p className="text-muted-foreground">
                      Téléchargez les documents requis (PDF, JPG, PNG - Max 10MB)
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Facture de vente *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Facture originale du véhicule
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('factureVente', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.factureVente && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.factureVente.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Certificat de dédouanement *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Document de dédouanement du véhicule
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('certificatDouane', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.certificatDouane && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.certificatDouane.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Certificat d'origine *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Certificat d'origine du véhicule
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('certificatOrigine', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.certificatOrigine && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.certificatOrigine.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Certificat de conformité</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Certificat de conformité technique (si disponible)
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('certificatConformite', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.certificatConformite && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.certificatConformite.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Photos du véhicule *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Photos du véhicule (avant, arrière, côtés, intérieur)
                        </p>
                        <Input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          multiple
                          onChange={(e) => handleFileUpload('photosVehicule', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.photosVehicule && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.photosVehicule.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Pièce d'identité *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          CNI ou passeport du demandeur
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('pieceIdentite', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.pieceIdentite && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.pieceIdentite.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Validation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Validation et Paiement</h2>
                    <p className="text-muted-foreground">
                      Vérifiez vos informations et procédez au paiement
                    </p>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Récapitulatif de votre demande</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Demandeur:</span> {formData.prenom} {formData.nom}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {formData.email}
                      </div>
                      <div>
                        <span className="font-medium">Véhicule:</span> {formData.marque} {formData.modele} ({formData.annee})
                      </div>
                      <div>
                        <span className="font-medium">Couleur:</span> {formData.couleur}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {formData.typeVehicule}
                      </div>
                      <div>
                        <span className="font-medium">Carburant:</span> {formData.carburant}
                      </div>
                      <div>
                        <span className="font-medium">Pays d'origine:</span> {formData.paysOrigine}
                      </div>
                      <div>
                        <span className="font-medium">Valeur douane:</span> {formData.valeurDouane} FCFA
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold">Frais d'homologation</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Frais d'homologation</span>
                        <span className="font-semibold">50 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inspection technique</span>
                        <span className="font-semibold">25 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certificat d'homologation</span>
                        <span className="font-semibold">15 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de traitement</span>
                        <span className="font-semibold">10 000 FCFA</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>100 000 FCFA</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="conditions"
                        checked={formData.accepteConditions}
                        onCheckedChange={(checked) => handleInputChange('accepteConditions', checked)}
                      />
                      <Label htmlFor="conditions" className="text-sm">
                        J'accepte les conditions générales d'homologation et confirme l'exactitude des informations fournies *
                      </Label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="donnees"
                        checked={formData.accepteTraitementDonnees}
                        onCheckedChange={(checked) => handleInputChange('accepteTraitementDonnees', checked)}
                      />
                      <Label htmlFor="donnees" className="text-sm">
                        J'accepte le traitement de mes données personnelles conformément à la politique de confidentialité *
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Précédent
                </Button>
                
                {currentStep < 4 ? (
                  <Button onClick={nextStep}>
                    Suivant
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.accepteConditions || !formData.accepteTraitementDonnees}
                  >
                    Soumettre la demande
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomologationVehicule;
