import { useState, useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, CreditCard, CheckCircle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PermisConduire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "",
    profession: "",
    adresse: "",
    telephone: "",
    email: "",
    
    // Informations médicales
    taille: "",
    poids: "",
    groupeSanguin: "",
    handicap: "",
    lunettes: false,
    
    // Choix de formation
    typeFormation: "",
    categorie: "",
    autoEcole: "",
    dateFormation: "",
    
    // Documents
    documents: {
      pieceIdentite: null as File | null,
      photo: null as File | null,
      certificatMedical: null as File | null,
      attestationFormation: null as File | null,
      justificatifDomicile: null as File | null
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
      description: "Votre demande de permis de conduire a été enregistrée. Vous recevrez un email de confirmation avec les prochaines étapes.",
    });
    
    // Ici, vous pourriez envoyer les données à votre API
  };

  const steps = [
    { number: 1, title: "Informations personnelles", icon: FileText },
    { number: 2, title: "Formation et catégorie", icon: BookOpen },
    { number: 3, title: "Documents", icon: Upload },
    { number: 4, title: "Validation", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen">
      <PageBanner 
        title="Demande de Permis de Conduire"
        description="Obtenez votre permis de conduire national"
      />

      <main className="py-16">
        <div className="container max-w-4xl">
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
              {/* Step 1: Informations personnelles */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Informations Personnelles</h2>
                    <p className="text-muted-foreground">
                      Veuillez renseigner vos informations personnelles et médicales
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
                      <Label htmlFor="dateNaissance">Date de naissance *</Label>
                      <Input
                        id="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lieuNaissance">Lieu de naissance *</Label>
                      <Input
                        id="lieuNaissance"
                        value={formData.lieuNaissance}
                        onChange={(e) => handleInputChange('lieuNaissance', e.target.value)}
                        placeholder="Ville, pays"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationalite">Nationalité *</Label>
                      <Select value={formData.nationalite} onValueChange={(value) => handleInputChange('nationalite', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre nationalité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nigerienne">Nigérienne</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
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
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Informations médicales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taille">Taille (cm)</Label>
                        <Input
                          id="taille"
                          type="number"
                          value={formData.taille}
                          onChange={(e) => handleInputChange('taille', e.target.value)}
                          placeholder="Ex: 175"
                        />
                      </div>
                      <div>
                        <Label htmlFor="poids">Poids (kg)</Label>
                        <Input
                          id="poids"
                          type="number"
                          value={formData.poids}
                          onChange={(e) => handleInputChange('poids', e.target.value)}
                          placeholder="Ex: 70"
                        />
                      </div>
                      <div>
                        <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
                        <Select value={formData.groupeSanguin} onValueChange={(value) => handleInputChange('groupeSanguin', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre groupe sanguin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="handicap">Handicap ou limitation</Label>
                        <Input
                          id="handicap"
                          value={formData.handicap}
                          onChange={(e) => handleInputChange('handicap', e.target.value)}
                          placeholder="Précisez si applicable"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="lunettes"
                            checked={formData.lunettes}
                            onCheckedChange={(checked) => handleInputChange('lunettes', checked)}
                          />
                          <Label htmlFor="lunettes">Port de lunettes ou lentilles de contact</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Formation et catégorie */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Formation et Catégorie</h2>
                    <p className="text-muted-foreground">
                      Choisissez votre type de formation et la catégorie de permis souhaitée
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="typeFormation">Type de formation *</Label>
                      <Select value={formData.typeFormation} onValueChange={(value) => handleInputChange('typeFormation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type de formation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto-ecole">Auto-école agréée</SelectItem>
                          <SelectItem value="particulier">Formation avec un particulier</SelectItem>
                          <SelectItem value="examen-libre">Examen en candidat libre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="categorie">Catégorie de permis *</Label>
                      <Select value={formData.categorie} onValueChange={(value) => handleInputChange('categorie', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A - Motocycles</SelectItem>
                          <SelectItem value="B">B - Voitures</SelectItem>
                          <SelectItem value="C">C - Poids lourds</SelectItem>
                          <SelectItem value="D">D - Transport de personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="autoEcole">Auto-école (si applicable)</Label>
                      <Input
                        id="autoEcole"
                        value={formData.autoEcole}
                        onChange={(e) => handleInputChange('autoEcole', e.target.value)}
                        placeholder="Nom de l'auto-école"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateFormation">Date de fin de formation</Label>
                      <Input
                        id="dateFormation"
                        type="date"
                        value={formData.dateFormation}
                        onChange={(e) => handleInputChange('dateFormation', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Informations sur les examens</h3>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• <strong>Examen théorique :</strong> Test de code de la route (40 questions, 35 bonnes réponses minimum)</p>
                      <p>• <strong>Examen pratique :</strong> Conduite avec un inspecteur (30 minutes minimum)</p>
                      <p>• <strong>Validité :</strong> 5 ans pour les catégories A et B, 3 ans pour les catégories C et D</p>
                      <p>• <strong>Âge minimum :</strong> 18 ans pour la catégorie B, 16 ans pour la catégorie A</p>
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
                      Téléchargez les documents requis (PDF, JPG, PNG - Max 5MB)
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Pièce d'identité *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          CNI ou passeport en cours de validité
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

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Photo d'identité *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Photo récente (format passeport, fond blanc)
                        </p>
                        <Input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.photo && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.photo.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Certificat médical *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Certificat médical d'aptitude à la conduite (moins de 3 mois)
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('certificatMedical', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.certificatMedical && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.certificatMedical.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Attestation de formation</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Attestation de fin de formation (si applicable)
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('attestationFormation', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.attestationFormation && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.attestationFormation.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-semibold mb-2">Justificatif de domicile *</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Facture d'électricité, d'eau ou quittance de loyer (moins de 3 mois)
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('justificatifDomicile', e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {formData.documents.justificatifDomicile && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.documents.justificatifDomicile.name}
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
                        <span className="font-medium">Nom complet:</span> {formData.prenom} {formData.nom}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {formData.email}
                      </div>
                      <div>
                        <span className="font-medium">Téléphone:</span> {formData.telephone}
                      </div>
                      <div>
                        <span className="font-medium">Catégorie:</span> {formData.categorie}
                      </div>
                      <div>
                        <span className="font-medium">Type de formation:</span> {formData.typeFormation}
                      </div>
                      <div>
                        <span className="font-medium">Auto-école:</span> {formData.autoEcole || "Non applicable"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold">Frais de permis</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Dossier de demande</span>
                        <span className="font-semibold">5 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Examen théorique</span>
                        <span className="font-semibold">10 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Examen pratique</span>
                        <span className="font-semibold">15 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fabrication du permis</span>
                        <span className="font-semibold">20 000 FCFA</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>50 000 FCFA</span>
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
                        J'accepte les conditions générales et confirme l'exactitude des informations fournies *
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

export default PermisConduire;
