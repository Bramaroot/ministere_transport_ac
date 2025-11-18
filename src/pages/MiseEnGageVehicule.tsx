import { useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, CreditCard, Clock, CheckCircle, FileText, AlertCircle } from "lucide-react";

const MiseEnGageVehicule = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requirements = [
    "Carte grise du véhicule",
    "Justificatif d'identité du propriétaire",
    "Justificatif de domicile",
    "Certificat de non-gage",
    "Évaluation du véhicule par un expert",
    "Contrat de prêt avec l'institution financière"
  ];

  const benefits = [
    "Accès au crédit avec votre véhicule comme garantie",
    "Taux d'intérêt préférentiels",
    "Montants de prêt plus élevés",
    "Processus de crédit accéléré"
  ];

  const steps = [
    {
      step: 1,
      title: "Évaluation du véhicule",
      description: "Faites évaluer votre véhicule par un expert agréé"
    },
    {
      step: 2,
      title: "Remplir le formulaire",
      description: "Complétez le formulaire de mise en gage avec les informations du véhicule"
    },
    {
      step: 3,
      title: "Télécharger les documents",
      description: "Joignez tous les documents requis pour la mise en gage"
    },
    {
      step: 4,
      title: "Paiement des frais",
      description: "Effectuez le paiement des frais de mise en gage (10 000 FCFA)"
    },
    {
      step: 5,
      title: "Certificat de mise en gage",
      description: "Réception du certificat officiel de mise en gage"
    }
  ];

  return (
    <div className="min-h-screen">
      <PageBanner 
        title="Mise en Gage de Véhicule"
        description="Mettez votre véhicule en gage pour obtenir un prêt auprès d'une institution financière"
      />

      <main className="py-16">
        <div className="container">
          {/* Service Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Mise en Gage de Véhicule
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Cette procédure vous permet de mettre votre véhicule en gage 
                  pour obtenir un prêt auprès d'une institution financière. 
                  Votre véhicule servira de garantie pour le crédit.
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Délai: 5 jours ouvrables
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Frais: 10 000 FCFA
                  </Badge>
                </div>

                <Button size="lg" className="w-full sm:w-auto">
                  Commencer la demande
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 text-white">
                  <CreditCard className="w-16 h-16 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Garantie Financière</h3>
                  <p className="text-pink-100">
                    Utilisez votre véhicule comme garantie pour obtenir un prêt.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Avantages de la mise en gage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
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
              Processus de mise en gage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-16">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="w-5 h-5" />
                  Informations importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-orange-700">
                  <p className="text-sm">
                    • Le véhicule reste en votre possession pendant la durée du prêt
                  </p>
                  <p className="text-sm">
                    • En cas de non-remboursement, l'institution financière peut saisir le véhicule
                  </p>
                  <p className="text-sm">
                    • Le certificat de mise en gage doit être présenté lors de toute transaction
                  </p>
                  <p className="text-sm">
                    • La mise en gage est enregistrée au niveau national
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MiseEnGageVehicule;
