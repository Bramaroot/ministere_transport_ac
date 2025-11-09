import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Clock, CheckCircle, FileText, AlertCircle } from "lucide-react";

const AutorisationTransportMarchandises = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requirements = [
    "Certificat de capacité de transport",
    "Justificatif d'identité du demandeur",
    "Plan d'activité de transport",
    "Justificatif de domicile",
    "Certificat d'immatriculation des véhicules",
    "Assurance responsabilité civile"
  ];

  const types = [
    "Transport de marchandises générales",
    "Transport de produits périssables",
    "Transport de matériaux de construction",
    "Transport de produits chimiques",
    "Transport de denrées alimentaires"
  ];

  const steps = [
    {
      step: 1,
      title: "Remplir le formulaire",
      description: "Complétez le formulaire de demande d'autorisation de transport"
    },
    {
      step: 2,
      title: "Télécharger les documents",
      description: "Joignez tous les documents requis pour l'autorisation"
    },
    {
      step: 3,
      title: "Paiement des frais",
      description: "Effectuez le paiement des frais d'autorisation (50 000 FCFA)"
    },
    {
      step: 4,
      title: "Étude du dossier",
      description: "Votre dossier sera étudié par les services compétents"
    },
    {
      step: 5,
      title: "Délivrance",
      description: "Réception de votre autorisation de transport de marchandises"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <PageBanner 
        title="Autorisation de Transport de Marchandises"
        description="Obtenez l'autorisation de transporter des marchandises"
      />

      <main className="py-16">
        <div className="container">
          {/* Service Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Transport de Marchandises
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Cette autorisation vous permet d'exercer légalement l'activité de 
                  transport de marchandises au Niger. Elle est obligatoire pour tous 
                  les transporteurs professionnels.
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Délai: 15 jours ouvrables
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Frais: 50 000 FCFA
                  </Badge>
                </div>

                <Button size="lg" className="w-full sm:w-auto">
                  Commencer la demande
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white">
                  <Package className="w-16 h-16 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Transport Professionnel</h3>
                  <p className="text-amber-100">
                    Obtenez l'autorisation légale pour exercer le transport de marchandises.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Types of Transport */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Types de transport autorisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {types.map((type, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Truck className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm">{type}</span>
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
              Processus d'autorisation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
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
                <CardTitle>Avantages de l'autorisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Truck className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Activité légale</h3>
                    <p className="text-sm text-muted-foreground">
                      Exercice légal de l'activité de transport de marchandises
                    </p>
                  </div>
                  <div className="text-center">
                    <Package className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Diversification</h3>
                    <p className="text-sm text-muted-foreground">
                      Transport de différents types de marchandises
                    </p>
                  </div>
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Certificat de capacité</h3>
                    <p className="text-sm text-muted-foreground">
                      Obtention du certificat de capacité de transport
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

export default AutorisationTransportMarchandises;
