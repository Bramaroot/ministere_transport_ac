import { useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Users, Building2, Award } from "lucide-react";
import MinisterMessage from "@/components/MinisterMessage";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageBanner
        title="À Propos du Ministère"
        description="Présentation de l'organisation, de la mission et de l'engagement du Ministère pour le développement stratégique des transports au Niger."
      />

      <div className="py-16 bg-gray-50">
        <div className="container space-y-16">
          {/* Section Organigramme */}
          <section id="organigramme">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-center text-primary">Organigramme</h2>
                <div className="space-y-8">
                  <div className="text-center p-6 bg-primary/5 rounded-lg max-w-md mx-auto">
                    <h3 className="font-bold text-2xl text-primary mb-2">Ministre</h3>
                    <p className="text-muted-foreground">Direction Générale</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-secondary/5 rounded-lg border border-secondary/20">
                      <h4 className="font-semibold text-xl mb-2">Direction des Transports Terrestres</h4>
                      <p className="text-sm text-muted-foreground">Gestion du réseau routier et ferroviaire</p>
                    </div>
                    <div className="text-center p-6 bg-secondary/5 rounded-lg border border-secondary/20">
                      <h4 className="font-semibold text-xl mb-2">Direction de l'Aviation Civile</h4>
                      <p className="text-sm text-muted-foreground">Supervision aéroportuaire et navigation</p>
                    </div>
                    <div className="text-center p-6 bg-secondary/5 rounded-lg border border-secondary/20">
                      <h4 className="font-semibold text-xl mb-2">Direction Administrative et Financière</h4>
                      <p className="text-sm text-muted-foreground">Gestion des ressources</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section Mot du Ministre */}
          <MinisterMessage />


          {/* Section Missions */}
          <section id="missions">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Nos Missions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Développement des Infrastructures</h3>
                      <p className="text-muted-foreground text-justify">
                        Planifier, construire et moderniser les infrastructures de transport terrestre et aérien
                        pour répondre aux besoins de la population.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Sécurité et Réglementation</h3>
                      <p className="text-muted-foreground text-justify">
                        Assurer la sécurité des usagers en établissant et en faisant respecter les normes et
                        réglementations en matière de transport.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Coopération Internationale</h3>
                      <p className="text-muted-foreground text-justify">
                        Développer des partenariats stratégiques avec les organisations régionales et
                        internationales pour le financement de projets d'envergure.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Innovation et Modernisation</h3>
                      <p className="text-muted-foreground text-justify">
                        Intégrer les nouvelles technologies et les meilleures pratiques internationales
                        dans la gestion des transports au Niger.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section Directions */}
          <section id="directions">
            <h2 className="text-3xl font-bold mb-8 text-center">Nos Directions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Direction Générale des Transports Terrestres</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Responsable de la planification, du développement et de l'entretien du réseau routier national.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Gestion du réseau routier</li>
                    <li>Transport ferroviaire</li>
                    <li>Sécurité routière</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Direction de l'Aviation Civile</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Supervise l'ensemble des activités liées au transport aérien et à la gestion des aéroports.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Gestion aéroportuaire</li>
                    <li>Navigation aérienne</li>
                    <li>Sécurité aérienne</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Direction Administrative et Financière</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Gère les ressources humaines, financières et matérielles du ministère.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Gestion budgétaire</li>
                    <li>Ressources humaines</li>
                    <li>Logistique</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section Services Rattachés */}
          <section id="services-rattaches">
            <h2 className="text-3xl font-bold mb-8 text-center">Services Rattachés au Ministère</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-3">ANAC</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Agence Nationale de l'Aviation Civile du Niger.
                  </p>
                  <a href="https://www.anac.ne" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visiter le site
                  </a>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-3">CNUT</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Conseil National des Utilisateurs des Transports du Niger.
                  </p>
                  <a href="https://www.cnut.ne" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visiter le site
                  </a>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-3">ANISER</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Agence Nationale de la Sécurité Routière du Niger.
                  </p>
                  {/* Pas de lien direct trouvé pour ANISER */}
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-3">Direction Nationale Météo</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Direction Nationale de la Météorologie du Niger.
                  </p>
                  <a href="https://www.niger-meteo.ne" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visiter le site
                  </a>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-3">CFTTR</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Centre de Formation aux Techniques des Transports Routiers.
                  </p>
                  <a href="http://www.cfttr.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visiter le site
                  </a>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-3">SONILOGA</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Société Nigérienne de Logistique et de Gestion des Transports.
                  </p>
                  <a href="https://www.soniloga.ne" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visiter le site
                  </a>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;