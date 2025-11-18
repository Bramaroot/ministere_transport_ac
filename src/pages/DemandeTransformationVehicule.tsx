import { useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Wrench, Clock, CheckCircle, FileText, AlertCircle } from "lucide-react";

const DemandeTransformationVehicule = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requirements = [
    "Carte grise actuelle du véhicule",
    "Plan détaillé des modifications",
    "Certificat d'homologation initial",
    "Justificatif d'identité du propriétaire",
    "Photos avant/après des modifications",
    "Certificat de conformité technique"
  ];

  const examples = [
    "Transformation Toyota Land Cruiser 2021 en 2023",
    "Augmentation d'essieux pour remorque de camion",
    "Modification de la longueur d'un véhicule",
    "Changement de configuration d'un véhicule utilitaire"
  ];

  const steps = [
    {
      step: 1,
      title: "Déclaration des modifications",
      description: "Décrivez en détail les transformations à apporter au véhicule"
    },
    {
      step: 2,
      title: "Télécharger les documents",
      description: "Joignez tous les documents techniques et plans de modification"
    },
    {
      step: 3,
      title: "Paiement des frais",
      description: "Effectuez le paiement des frais de transformation (35 000 FCFA)"
    },
    {
      step: 4,
      title: "Inspection technique",
      description: "Le véhicule sera inspecté pour vérifier la conformité des modifications"
    },
    {
      step: 5,
      title: "Nouvelle homologation",
      description: "Attribution d'un nouveau numéro de châssis si nécessaire"
    }
  ];

  return (
    <div className="min-h-screen">
      <PageBanner 
        title="Demande de Transformation de Véhicule"
        description="Transformation de véhicules déjà homologués (ex: Toyota Land Cruiser 2021 → 2023)"
      />

      <main className="py-16">
        <div className="container">
          {/* Service Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Transformation de Véhicule
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Cette procédure permet de transformer un véhicule déjà homologué 
                  pour modifier ses caractéristiques techniques. Idéal pour les 
                  transformations de modèles ou l'augmentation de capacités.
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Délai: 15 jours ouvrables
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Frais: 35 000 FCFA
                  </Badge>
                </div>

                <Button size="lg" className="w-full sm:w-auto">
                  Commencer la demande
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-8 text-white">
                  <Wrench className="w-16 h-16 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Transformation Technique</h3>
                  <p className="text-purple-100">
                    Modifiez les caractéristiques de votre véhicule selon vos besoins spécifiques.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Examples */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Exemples de transformations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examples.map((example, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Car className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <span className="text-sm">{example}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Requirements */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Documents requis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Process Steps */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Processus de transformation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Avantages de la transformation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Wrench className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Flexibilité technique</h3>
                    <p className="text-sm text-muted-foreground">
                      Adaptez votre véhicule à vos besoins spécifiques
                    </p>
                  </div>
                  <div className="text-center">
                    <Car className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Mise à jour</h3>
                    <p className="text-sm text-muted-foreground">
                      Modernisez votre véhicule selon les dernières normes
                    </p>
                  </div>
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Documentation officielle</h3>
                    <p className="text-sm text-muted-foreground">
                      Obtention de la nouvelle documentation technique
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DemandeTransformationVehicule;
