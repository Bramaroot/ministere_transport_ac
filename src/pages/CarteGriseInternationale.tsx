import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Globe, Clock, CheckCircle, FileText, AlertCircle } from "lucide-react";

const CarteGriseInternationale = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requirements = [
    "Carte grise nationale en cours de validité",
    "Permis de conduire national",
    "Justificatif de domicile",
    "Pièce d'identité (CNI ou passeport)",
    "Justificatif de voyage à l'étranger",
    "Photo d'identité récente"
  ];

  const steps = [
    {
      step: 1,
      title: "Remplir le formulaire",
      description: "Complétez le formulaire de demande en ligne avec vos informations personnelles et véhicule"
    },
    {
      step: 2,
      title: "Télécharger les documents",
      description: "Joignez tous les documents requis en format PDF ou image"
    },
    {
      step: 3,
      title: "Paiement des frais",
      description: "Effectuez le paiement des frais de traitement (15 000 FCFA)"
    },
    {
      step: 4,
      title: "Traitement",
      description: "Votre demande sera traitée dans un délai de 7 jours ouvrables"
    },
    {
      step: 5,
      title: "Réception",
      description: "Recevez votre carte grise internationale par email ou retrait sur place"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <PageBanner 
        title="Carte Grise Internationale"
        description="Obtenez votre carte grise internationale pour votre véhicule"
      />

      <main className="py-16">
        <div className="container">
          {/* Service Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Carte Grise Internationale
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  La carte grise internationale permet la reconnaissance de votre véhicule 
                  dans les pays étrangers. Elle est essentielle pour voyager avec votre 
                  véhicule à l'étranger.
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Délai: 7 jours ouvrables
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Frais: 15 000 FCFA
                  </Badge>
                </div>

                <Button size="lg" className="w-full sm:w-auto">
                  Commencer la demande
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                  <Car className="w-16 h-16 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Reconnaissance Internationale</h3>
                  <p className="text-blue-100">
                    Votre véhicule sera reconnu dans plus de 150 pays avec cette carte grise internationale.
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
              Processus de demande
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
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
                <CardTitle>Avantages de la carte grise internationale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Reconnaissance internationale</h3>
                    <p className="text-sm text-muted-foreground">
                      Valide dans plus de 150 pays à travers le monde
                    </p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Traitement rapide</h3>
                    <p className="text-sm text-muted-foreground">
                      Délai de traitement de seulement 7 jours ouvrables
                    </p>
                  </div>
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Documentation numérique</h3>
                    <p className="text-sm text-muted-foreground">
                      Recevez votre document par voie électronique
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

export default CarteGriseInternationale;
