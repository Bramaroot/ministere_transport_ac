import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users, Shield, Plane, Truck, Ship, BarChart3, Handshake } from "lucide-react";

const About = () => {
  

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            À Propos du Ministère
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-justify">
            Le Ministère des Transports et de l'Aviation Civile de la République du Niger œuvre pour le développement 
            d'un réseau de transport moderne, sécurisé et efficace au service du développement national et de l'amélioration 
            des conditions de vie de nos concitoyens.
          </p>
        </div>

         

        <Card className="glass-card animate-fade-in">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Notre Engagement Institutionnel</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
                  Depuis sa création, le Ministère des Transports et de l'Aviation Civile de la République du Niger 
                  s'engage institutionnellement à améliorer la mobilité des personnes et des biens, tout en garantissant 
                  la sécurité et l'efficacité de nos infrastructures de transport nationales.
                </p>
                <p className="text-muted-foreground leading-relaxed text-justify">
                  Notre administration travaille en étroite collaboration avec nos partenaires institutionnels nationaux 
                  et internationaux pour réaliser des projets d'envergure qui transforment 
                  le paysage des transports nigériens et contribuent au développement économique durable de notre République.
                </p>
              </div>
              <img src="/as.jpg" alt="About" className="w-full h-full object-cover rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Section Missions */}
        <div className="mt-16">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Nos Missions
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Le Ministère des Transports et de l'Aviation Civile s'engage à remplir ses missions 
              essentielles pour le développement et la modernisation du secteur des transports au Niger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mission 1 */}
            <Card className="glass-card animate-fade-in hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Politiques Publiques</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Œuvrer pour la mise en œuvre des politiques publiques en matière de transport 
                  et de l'aviation civile pour assurer un développement harmonieux du secteur.
                </p>
              </CardContent>
            </Card>

            {/* Mission 2 */}
            <Card className="glass-card animate-fade-in hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Sécurité des Infrastructures</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Prendre des mesures pour s'assurer du respect des normes de sécurité dans 
                  la réalisation des infrastructures de transport.
                </p>
              </CardContent>
            </Card>

            {/* Mission 3 */}
            <Card className="glass-card animate-fade-in hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Suivi de la Qualité</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Renforcer les mécanismes de suivi de la qualité des services offerts par 
                  les opérateurs de transport aérien, terrestre ou fluvial.
                </p>
              </CardContent>
            </Card>

            {/* Mission 4 */}
            <Card className="glass-card animate-fade-in hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Plane className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Services Aériens</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Renforcer les initiatives d'offre de services de transport, notamment dans le secteur aérien 
                  pour faciliter la mobilité entre les différents chefs-lieux de région.
                </p>
              </CardContent>
            </Card>

            {/* Mission 5 */}
            <Card className="glass-card animate-fade-in hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Handshake className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Partenariats Stratégiques</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Développer des partenariats stratégiques avec les opérateurs spécialisés dans le transport aérien 
                  des marchandises pour désenclaver le pays dans le domaine de l'import-export des biens.
                </p>
              </CardContent>
            </Card>

            {/* Mission 6 */}
            <Card className="glass-card animate-fade-in hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Mesure des Résultats</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Mettre en place un cadre approprié de mesure des résultats et d'appréciation de la performance 
                  des actions du Ministère.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
