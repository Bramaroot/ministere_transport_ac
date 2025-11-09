import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Hash, Clock, CheckCircle, FileText, AlertCircle } from "lucide-react";

const DemandeHomologationSimple = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requirements = [
    "Facture d'achat du véhicule",
    "Certificat de conformité du constructeur",
    "Certificat de douane (si importé)",
    "Justificatif d'identité du propriétaire",
    "Justificatif de domicile",
    "Photos du véhicule (avant, arrière, côtés)"
  ];

  const steps = [
    {
      step: 1,
      title: "Remplir le formulaire",
      description: "Complétez le formulaire de demande d'homologation avec les informations du véhicule"
    },
    {
      step: 2,
      title: "Télécharger les documents",
      description: "Joignez tous les documents requis pour l'homologation"
    },
    {
      step: 3,
      title: "Paiement des frais",
      description: "Effectuez le paiement des frais d'homologation (25 000 FCFA)"
    },
    {
      step: 4,
      title: "Inspection technique",
      description: "Le véhicule sera inspecté pour vérifier sa conformité"
    },
    {
      step: 5,
      title: "Attribution du numéro",
      description: "Un numéro de châssis unique sera attribué à votre véhicule"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <PageBanner 
        title="Demande d'Homologation (Simple)"
        description="Attribution d'un numéro de châssis pour première immatriculation"
      />

      <main className="py-16">
        <div className="container">
          {/* Service Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Homologation Simple
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  L'homologation simple permet d'attribuer un numéro de châssis unique 
                  à votre véhicule pour sa première immatriculation au Niger. 
                  Cette procédure est obligatoire pour tous les véhicules neufs.
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Délai: 10 jours ouvrables
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Frais: 25 000 FCFA
                  </Badge>
                </div>

                <Button size="lg" className="w-full sm:w-auto">
                  Commencer la demande
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
                  <Hash className="w-16 h-16 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Numéro de Châssis Unique</h3>
                  <p className="text-green-100">
                    Votre véhicule recevra un numéro de châssis unique pour son immatriculation au Niger.
                  </p>
                </div>
              </div>
            </div>
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
              Processus d'homologation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
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
                <CardTitle>Avantages de l'homologation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Hash className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Numéro unique</h3>
                    <p className="text-sm text-muted-foreground">
                      Attribution d'un numéro de châssis unique pour votre véhicule
                    </p>
                  </div>
                  <div className="text-center">
                    <Car className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Conformité nationale</h3>
                    <p className="text-sm text-muted-foreground">
                      Vérification de la conformité aux normes nigériennes
                    </p>
                  </div>
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Certificat d'homologation</h3>
                    <p className="text-sm text-muted-foreground">
                      Obtention du certificat officiel d'homologation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemandeHomologationSimple;
