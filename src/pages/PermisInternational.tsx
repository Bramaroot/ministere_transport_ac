import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PermisInternational = () => {
  const navigate = useNavigate();
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

    // Informations du permis national
    numeroPermisNational: "",
    dateDelivrancePermis: "",
    lieuDelivrancePermis: "",
    categoriePermis: "",

    // Informations de l'ancien permis international
    numeroAncienPermis: "",
    dateDelivranceAncien: "",
    dateExpirationAncien: "",

    // Documents
    copiePermisNational: null,
    copieAncienPermis: null,
    photosIdentite: null,

    // Acceptation des conditions
    accepteConditions: false,
    accepteTraitementDonnees: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation des champs obligatoires
    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est obligatoire";
    if (!formData.lieuNaissance.trim()) newErrors.lieuNaissance = "Le lieu de naissance est obligatoire";
    if (!formData.nationalite.trim()) newErrors.nationalite = "La nationalité est obligatoire";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire";
    if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est obligatoire";
    if (!formData.email.trim()) newErrors.email = "L'email est obligatoire";

    if (!formData.numeroPermisNational.trim()) newErrors.numeroPermisNational = "Le numéro du permis national est obligatoire";
    if (!formData.dateDelivrancePermis) newErrors.dateDelivrancePermis = "La date de délivrance est obligatoire";
    if (!formData.lieuDelivrancePermis.trim()) newErrors.lieuDelivrancePermis = "Le lieu de délivrance est obligatoire";
    if (!formData.categoriePermis.trim()) newErrors.categoriePermis = "La catégorie du permis est obligatoire";

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation téléphone
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide";
    }

    // Validation des fichiers
    if (!formData.copiePermisNational) newErrors.copiePermisNational = "La copie du permis national est obligatoire";
    if (!formData.photosIdentite) newErrors.photosIdentite = "Les photos d'identité sont obligatoires";

    // Validation des conditions
    if (!formData.accepteConditions) newErrors.accepteConditions = "Vous devez accepter les conditions";
    if (!formData.accepteTraitementDonnees) newErrors.accepteTraitementDonnees = "Vous devez accepter le traitement des données";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Ici, vous pouvez ajouter l'appel à votre API

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen">
        <Navbar />

        <PageBanner
          title="Demande de Permis International"
          description="Votre demande a été soumise avec succès"
        />

        <main className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-green-600">
                    Demande Soumise avec Succès
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Votre demande de permis international a été enregistrée.
                    Vous recevrez un email de confirmation avec votre numéro de dossier.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Prochaines étapes :</h3>
                      <ul className="text-sm text-left space-y-1">
                        <li>• Vérification de vos documents</li>
                        <li>• Paiement des frais (10 000 FCFA)</li>
                        <li>• Traitement de votre demande (5 jours ouvrables)</li>
                        <li>• Notification de retrait</li>
                      </ul>
                    </div>
                    <Button onClick={() => navigate("/e-services")} className="w-full">
                      Retour aux E-Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <PageBanner
        title="Demande de Permis International"
        description="Formulaire de demande en ligne pour le permis de conduire international"
      />

      <main className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => handleInputChange("nom", e.target.value)}
                        className={errors.nom ? "border-red-500" : ""}
                      />
                      {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => handleInputChange("prenom", e.target.value)}
                        className={errors.prenom ? "border-red-500" : ""}
                      />
                      {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dateNaissance">Date de naissance *</Label>
                      <Input
                        id="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                        className={errors.dateNaissance ? "border-red-500" : ""}
                      />
                      {errors.dateNaissance && <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lieuNaissance">Lieu de naissance *</Label>
                      <Input
                        id="lieuNaissance"
                        value={formData.lieuNaissance}
                        onChange={(e) => handleInputChange("lieuNaissance", e.target.value)}
                        className={errors.lieuNaissance ? "border-red-500" : ""}
                      />
                      {errors.lieuNaissance && <p className="text-red-500 text-sm mt-1">{errors.lieuNaissance}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nationalite">Nationalité *</Label>
                      <Input
                        id="nationalite"
                        value={formData.nationalite}
                        onChange={(e) => handleInputChange("nationalite", e.target.value)}
                        className={errors.nationalite ? "border-red-500" : ""}
                      />
                      {errors.nationalite && <p className="text-red-500 text-sm mt-1">{errors.nationalite}</p>}
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={formData.profession}
                        onChange={(e) => handleInputChange("profession", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="adresse">Adresse complète *</Label>
                    <Textarea
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange("adresse", e.target.value)}
                      className={errors.adresse ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange("telephone", e.target.value)}
                        className={errors.telephone ? "border-red-500" : ""}
                        placeholder="+227 XX XX XX XX"
                      />
                      {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="exemple@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du permis national */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du Permis National</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="numeroPermisNational">Numéro du permis national *</Label>
                      <Input
                        id="numeroPermisNational"
                        value={formData.numeroPermisNational}
                        onChange={(e) => handleInputChange("numeroPermisNational", e.target.value)}
                        className={errors.numeroPermisNational ? "border-red-500" : ""}
                      />
                      {errors.numeroPermisNational && <p className="text-red-500 text-sm mt-1">{errors.numeroPermisNational}</p>}
                    </div>
                    <div>
                      <Label htmlFor="categoriePermis">Catégorie du permis *</Label>
                      <Input
                        id="categoriePermis"
                        value={formData.categoriePermis}
                        onChange={(e) => handleInputChange("categoriePermis", e.target.value)}
                        className={errors.categoriePermis ? "border-red-500" : ""}
                        placeholder="A, B, C, D, E"
                      />
                      {errors.categoriePermis && <p className="text-red-500 text-sm mt-1">{errors.categoriePermis}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dateDelivrancePermis">Date de délivrance *</Label>
                      <Input
                        id="dateDelivrancePermis"
                        type="date"
                        value={formData.dateDelivrancePermis}
                        onChange={(e) => handleInputChange("dateDelivrancePermis", e.target.value)}
                        className={errors.dateDelivrancePermis ? "border-red-500" : ""}
                      />
                      {errors.dateDelivrancePermis && <p className="text-red-500 text-sm mt-1">{errors.dateDelivrancePermis}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lieuDelivrancePermis">Lieu de délivrance *</Label>
                      <Input
                        id="lieuDelivrancePermis"
                        value={formData.lieuDelivrancePermis}
                        onChange={(e) => handleInputChange("lieuDelivrancePermis", e.target.value)}
                        className={errors.lieuDelivrancePermis ? "border-red-500" : ""}
                      />
                      {errors.lieuDelivrancePermis && <p className="text-red-500 text-sm mt-1">{errors.lieuDelivrancePermis}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ancien permis international (optionnel) */}
              <Card>
                <CardHeader>
                  <CardTitle>Ancien Permis International (si applicable)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="numeroAncienPermis">Numéro de l'ancien permis</Label>
                      <Input
                        id="numeroAncienPermis"
                        value={formData.numeroAncienPermis}
                        onChange={(e) => handleInputChange("numeroAncienPermis", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateDelivranceAncien">Date de délivrance</Label>
                      <Input
                        id="dateDelivranceAncien"
                        type="date"
                        value={formData.dateDelivranceAncien}
                        onChange={(e) => handleInputChange("dateDelivranceAncien", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dateExpirationAncien">Date d'expiration</Label>
                    <Input
                      id="dateExpirationAncien"
                      type="date"
                      value={formData.dateExpirationAncien}
                      onChange={(e) => handleInputChange("dateExpirationAncien", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Documents à fournir */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents à Fournir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Documents requis :</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Demande manuscrite adressée au Ministre en charge des transports</li>
                      <li>• Timbre fiscal de 10 000F, code général des impôts</li>
                      <li>• Copie légalisée du permis national</li>
                      <li>• Copie légalisée de l'ancien permis international (si applicable)</li>
                      <li>• Deux photos d'identité</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="copiePermisNational">Copie légalisée du permis national *</Label>
                      <div className="mt-2">
                        <Input
                          id="copiePermisNational"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("copiePermisNational", e.target.files[0])}
                          className={errors.copiePermisNational ? "border-red-500" : ""}
                        />
                        {errors.copiePermisNational && <p className="text-red-500 text-sm mt-1">{errors.copiePermisNational}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="copieAncienPermis">Copie légalisée de l'ancien permis international</Label>
                      <div className="mt-2">
                        <Input
                          id="copieAncienPermis"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("copieAncienPermis", e.target.files[0])}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="photosIdentite">Photos d'identité (2 photos) *</Label>
                      <div className="mt-2">
                        <Input
                          id="photosIdentite"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          multiple
                          onChange={(e) => handleFileChange("photosIdentite", e.target.files)}
                          className={errors.photosIdentite ? "border-red-500" : ""}
                        />
                        {errors.photosIdentite && <p className="text-red-500 text-sm mt-1">{errors.photosIdentite}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conditions et acceptation */}
              <Card>
                <CardHeader>
                  <CardTitle>Conditions et Acceptation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="accepteConditions"
                        checked={formData.accepteConditions}
                        onCheckedChange={(checked) => handleInputChange("accepteConditions", checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="accepteConditions"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          J'accepte les conditions générales d'utilisation et les modalités de traitement *
                        </label>
                        {errors.accepteConditions && <p className="text-red-500 text-sm">{errors.accepteConditions}</p>}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="accepteTraitementDonnees"
                        checked={formData.accepteTraitementDonnees}
                        onCheckedChange={(checked) => handleInputChange("accepteTraitementDonnees", checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="accepteTraitementDonnees"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          J'autorise le traitement de mes données personnelles pour le traitement de cette demande *
                        </label>
                        {errors.accepteTraitementDonnees && <p className="text-red-500 text-sm">{errors.accepteTraitementDonnees}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Important :</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Après soumission de ce formulaire, vous devrez vous présenter au service compétent
                          avec les documents originaux et effectuer le paiement des frais (10 000 FCFA).
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Boutons d'action */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/e-services")}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[150px]"
                >
                  {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PermisInternational;