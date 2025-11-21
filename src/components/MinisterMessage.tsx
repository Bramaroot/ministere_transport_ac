import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const MinisterMessage = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Message du Ministre
          </h2>
          <p className="text-muted-foreground text-lg">
            Vision stratégique et engagement institutionnel pour le
            développement des transports au Niger
          </p>
        </div>

        <Card className="max-w-5xl mx-auto glass-card animate-scale-in">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Photo du ministre */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <img
                      src="/Mr le Ministre.jpeg"
                      alt="Ministre des Transports"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-bold text-xl">
                      Colonel - Major Abdourahamane Amadou
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ministre des Transports et de l'Aviation Civile
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      République du Niger
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="lg:col-span-2">
                <Quote className="w-12 h-12 text-primary/20 mb-6" />
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg font-medium text-foreground">
                    Chers Concitoyens, Chers Partenaires,
                  </p>
                  <p>
                    Le secteur des transports est l'un des piliers fondamentaux
                    du développement économique et social de notre pays. Il est
                    le vecteur de notre unité nationale, le lien entre nos
                    régions, et la clé de voûte de notre intégration économique
                    sous régionale. C'est avec un profond sentiment d'honneur et
                    une lourde responsabilité que je m'adresse à vous
                    aujourd'hui en tant que Ministre des Transports.
                  </p>
                  <p>
                    Notre vision est claire :{" "}
                    <strong className="text-foreground">
                      faire du Niger un hub logistique de référence en Afrique
                      de l'Ouest
                    </strong>
                    , grâce à un réseau de transports moderne, sûr, durable et
                    accessible à tous.
                  </p>

                  {/* <div className="space-y-3">
                    <p className="font-medium text-foreground">Pour la réaliser, nos actions s'articuleront autour de plusieurs axes fondamentaux :</p>
                    
                    <div className="space-y-3 pl-4">
                      <div className="flex gap-3">
                        <span className="text-primary font-bold text-lg">1.</span>
                        <div>
                          <p className="font-medium text-foreground">La modernisation des infrastructures :</p>
                          <p className="text-sm">
                            Nous œuvrerons sans relâche à l'entretien, la réhabilitation et l'extension de notre réseau routier, 
                            ferroviaire et aéroportuaire. L'objectif est de désenclaver nos territoires, de fluidifier la circulation 
                            des biens et des personnes et de soutenir la compétitivité de notre économie.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-primary font-bold text-lg">2.</span>
                        <div>
                          <p className="font-medium text-foreground">La sécurité, une exigence absolue :</p>
                          <p className="text-sm">
                            La sécurité des usagers de la route, des passagers du transport routier, aérien et dans un futur proche, 
                            ferroviaire, est non négociable. Nous avons pour ambitions de renforcer la réglementation, les contrôles 
                            techniques et les campagnes de sensibilisation couplées à des mesures de contrôle adéquates pour faire baisser 
                            durablement le nombre d'accidents et garantir à chacun un voyage en toute sérénité.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-primary font-bold text-lg">3.</span>
                        <div>
                          <p className="font-medium text-foreground">L'amélioration du réseau routier à l'échelle régionale :</p>
                          <p className="text-sm">
                            Conscients des grands changements ayant lieu dans le monde en général et dans la région en particulier, 
                            nous devons créer des voies de communication résilientes permettant un désenclavement en toute circonstances 
                            indépendamment des perturbations potentielles dans la Sous-Région ou la Région.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-primary font-bold text-lg">4.</span>
                        <div>
                          <p className="font-medium text-foreground">L'amélioration de la gouvernance du secteur :</p>
                          <p className="text-sm">
                            Nous engageons d'ores et déjà des réformes courageuses pour plus de transparence, d'efficacité et de lutte 
                            contre la corruption dans les services liés au Transport. Notre ambition est d'offrir un service public de qualité, 
                            au service exclusif des usagers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <p className="font-semibold text-foreground pt-4">
                    Je vous remercie de votre confiance et de votre engagement à
                    nos côtés.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MinisterMessage;
