import { useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accessibility, Eye, MousePointer, Volume2, Keyboard, Monitor, Smartphone, Mail, Phone, Calendar } from "lucide-react";

const Accessibilite = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        <PageBanner 
          title="Accessibilité"
          description="Engagement pour un site accessible à tous"
        />

        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="space-y-8">
              {/* Engagement */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-primary" />
                    Notre engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Le Ministère des Transports et de l'Aviation Civile s'engage à rendre son site web accessible à tous les citoyens, 
                    conformément aux standards internationaux d'accessibilité numérique. Nous nous efforçons de garantir une expérience 
                    utilisateur optimale pour tous, quel que soit le handicap ou les technologies d'assistance utilisées.
                  </p>
                </CardContent>
              </Card>

              {/* Standards d'accessibilité */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    Standards d'accessibilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Notre site respecte les standards internationaux d'accessibilité (WCAG 2.1) et s'efforce de garantir 
                    une expérience utilisateur accessible à tous.
                  </p>
                </CardContent>
              </Card>

              {/* Fonctionnalités d'accessibilité */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Fonctionnalités d'accessibilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le site propose une navigation au clavier complète, un contraste suffisant, des textes alternatifs pour les images, 
                    et une structure sémantique appropriée pour les technologies d'assistance.
                  </p>
                </CardContent>
              </Card>

              {/* Technologies d'assistance */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    Technologies d'assistance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le site est compatible avec les lecteurs d'écran, la navigation vocale, et reste fonctionnel 
                    avec un zoom important. Toutes les fonctionnalités sont accessibles au clavier.
                  </p>
                </CardContent>
              </Card>

              {/* Raccourcis clavier */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-primary" />
                    Raccourcis clavier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le site supporte la navigation complète au clavier avec les raccourcis standards : 
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-1">Tab</kbd> pour naviguer, 
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-1">Entrée</kbd> pour activer, 
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-1">Échap</kbd> pour fermer.
                  </p>
                </CardContent>
              </Card>

              {/* Responsive design */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Design responsive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Le site s'adapte automatiquement à tous les types d'écrans (ordinateur, tablette, smartphone) 
                    et reste fonctionnel avec un zoom important.
                  </p>
                </CardContent>
              </Card>

              {/* Amélioration continue */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="w-5 h-5 text-primary" />
                    Amélioration continue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Nous effectuons régulièrement des tests d'accessibilité et formons notre équipe 
                    aux bonnes pratiques pour améliorer continuellement l'expérience utilisateur.
                  </p>
                </CardContent>
              </Card>

              {/* Signalement d'accessibilité */}
              <Card className="bg-primary/5 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Signalement d'accessibilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Si vous rencontrez des difficultés d'accessibilité sur ce site, nous vous encourageons 
                    à nous le signaler pour que nous puissions améliorer l'expérience utilisateur :
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>accessibilite@transports.gouv.ne</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+227 20 72 XX XX</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs mt-4">
                    Nous nous engageons à répondre à vos demandes dans les meilleurs délais 
                    et à apporter les corrections nécessaires.
                  </p>
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

export default Accessibilite;
