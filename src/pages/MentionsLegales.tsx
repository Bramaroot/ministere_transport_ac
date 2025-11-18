import { useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Building, Mail, Phone, MapPin, Calendar } from "lucide-react";

const MentionsLegales = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        <PageBanner 
          title="Mentions Légales"
          description="Informations légales et réglementaires du site"
        />

        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="space-y-8">
              {/* Éditeur du site */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    Éditeur du site
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                      <h4 className="font-semibold mb-2">Ministère des Transports et de l'Aviation Civile</h4>
                      <p className="text-muted-foreground text-sm">
                        Organe de tutelle des transports et de l'aviation civile au Niger
                          </p>
                        </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Niamey, Niger</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>+227 20 72 XX XX</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>contact@transports.gouv.ne</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Directeur de publication */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Directeur de publication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Le Ministre des Transports et de l'Aviation Civile
                  </p>
                </CardContent>
              </Card>

              {/* Hébergement */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    Hébergement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le site est hébergé sur des serveurs sécurisés avec une disponibilité optimale.
                  </p>
                </CardContent>
              </Card>

              {/* Propriété intellectuelle */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Propriété intellectuelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    L'ensemble du contenu de ce site (textes, images, logos) est protégé par le droit d'auteur. 
                    Toute reproduction sans autorisation préalable est interdite.
                  </p>
                </CardContent>
              </Card>

              {/* Responsabilité */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Responsabilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le Ministère s'efforce de fournir des informations exactes et à jour. L'utilisateur est responsable 
                    de l'utilisation qu'il fait des informations et services proposés sur le site.
                  </p>
                </CardContent>
              </Card>

              {/* Protection des données */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Protection des données personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le traitement des données personnelles collectées sur ce site est régi par notre 
                    <a href="/politique-confidentialite" className="text-primary hover:underline ml-1">
                      Politique de Confidentialité
                    </a>.
                  </p>
                </CardContent>
              </Card>

              {/* Droit applicable */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Droit applicable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le présent site est soumis au droit nigérien. En cas de litige, les tribunaux nigériens seront seuls compétents.
                  </p>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="bg-primary/5 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>contact@transports.gouv.ne</span>
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

export default MentionsLegales;