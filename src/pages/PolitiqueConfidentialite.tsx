import { useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Database, Mail, Phone, Calendar, AlertTriangle } from "lucide-react";

const PolitiqueConfidentialite = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        <PageBanner 
          title="Politique de Confidentialité"
          description="Protection et traitement de vos données personnelles"
        />

        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="space-y-8">
              {/* Introduction */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Le Ministère des Transports et de l'Aviation Civile s'engage à protéger la vie privée et les données personnelles 
                    de ses utilisateurs. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                  </p>
                </CardContent>
              </Card>

              {/* Données collectées */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Données personnelles collectées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Nous collectons uniquement les données nécessaires pour fournir nos services : 
                    nom, prénom, adresse e-mail, numéro de téléphone, et données de navigation anonymisées.
                  </p>
                </CardContent>
              </Card>

              {/* Finalités du traitement */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Finalités du traitement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Les données sont utilisées pour traiter vos demandes de services, gérer votre compte utilisateur, 
                    et améliorer la qualité de nos services.
                  </p>
                </CardContent>
              </Card>

              {/* Base légale */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Base légale du traitement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le traitement des données est nécessaire à l'exécution des missions d'intérêt public du Ministère 
                    et au respect des obligations légales.
                  </p>
                </CardContent>
              </Card>

              {/* Partage des données */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Partage des données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Vos données peuvent être partagées entre les services du Ministère pour le traitement de vos demandes. 
                    Elles ne sont pas transmises à des tiers sans votre consentement, sauf obligation légale.
                  </p>
                </CardContent>
              </Card>

              {/* Sécurité des données */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Sécurité des données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées 
                    pour protéger vos données personnelles contre tout accès non autorisé.
                  </p>
                </CardContent>
              </Card>

              {/* Droits des utilisateurs */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Vos droits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Vous disposez des droits d'accès, de rectification, d'effacement et d'opposition concernant vos données personnelles. 
                    Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous.
                  </p>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Ce site utilise des cookies techniques nécessaires au fonctionnement et des cookies de performance 
                    pour améliorer l'expérience utilisateur. Vous pouvez gérer vos préférences via les paramètres de votre navigateur.
                  </p>
                </CardContent>
              </Card>

              {/* Durée de conservation */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Durée de conservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, 
                    conformément aux obligations légales applicables.
                  </p>
                </CardContent>
              </Card>

              {/* Contact DPO */}
              <Card className="bg-primary/5 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact - Délégué à la Protection des Données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Pour exercer vos droits ou pour toute question concernant le traitement de vos données personnelles :
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>dpo@transports.gouv.ne</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+227 20 72 XX XX</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dernière mise à jour */}
              <div className="text-center text-sm text-muted-foreground">
                <Badge variant="outline" className="mb-2">
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;
