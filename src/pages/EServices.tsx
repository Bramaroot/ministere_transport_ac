import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Car, Globe, Clock, CheckCircle, Plane, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import DocumentsModal from "@/components/DocumentsModal";

const EServices = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShowDocuments = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  const services = [
    // Aviation Civilet


    // Services de Transport
    {
      id: "permis-international",
      title: "Permis International",
      description: "Obtenez votre permis de conduire international pour voyager à l'étranger",
      icon: Globe,
      features: [
        "Valide dans plus de 150 pays",
        "Délai de traitement : 5 jours ouvrables",
        "Documentation numérique",
        "Suivi en temps réel"
      ],
      path: "/e-services/demande-permis-international",
      color: "bg-blue-500",
      hasOnlineForm: true,
      documents: [
        "Demande manuscrite adressée au Ministre en charge des transports",
        "Timbre fiscal de 10 000F, code général des impôts",
        "Copie légalisée du permis national",
        "Copie légalisée de l'ancien permis international",
        "Deux photos d'identité"
      ]
    },
    {
      id: "carte-grise-internationale",
      title: "Carte Grise Internationale",
      description: "Obtenez votre carte grise internationale pour votre véhicule",
      icon: Car,
      features: [
        "Reconnaissance internationale",
        "Délai de traitement : 7 jours ouvrables",
        "Documentation complète",
        "Validité internationale"
      ],
      path: "/e-services/carte-grise-internationale",
      color: "bg-indigo-500",
      documents: [
        "Demande manuscrite adressée au Ministre en charge des transports",
        "Timbre fiscal de 10 000 F, code général des impôts",
        "Copie légalisée de la carte grise ou copie de l'ancienne carte grise internationale"
      ]
    },

    // Échange de Permis
    {
      id: "echange-permis-etranger",
      title: "Échange de Permis de Conduire Étranger",
      description: "Échangez votre permis de conduire étranger contre un permis nigérien",
      icon: Globe,
      features: [
        "Reconnaissance des permis étrangers",
        "Délai de traitement : 10 jours ouvrables",
        "Certificat d'authenticité requis",
        "Procédure simplifiée"
      ],
      path: "/e-services/echange-permis-etranger",
      color: "bg-teal-500",
      documents: [
        "Demande manuscrite adressée au Ministre en charge des transports",
        "Certificat de résidence",
        "Permis étranger à échanger",
        "Copie légalisée d'une pièce d'identité",
        "Taxes fiscales de 12000f (timbre 10 000f CGI et quittance 2000f)",
        "Deux (2) photos d'identité",
        "Certificat d'authenticité du pays ayant délivré le permis à échanger"
      ]
    },

    // Auto-école
    {
      id: "ouverture-auto-ecole",
      title: "Ouverture et Exploitation d'Auto-École",
      description: "Obtenez l'autorisation d'ouvrir et d'exploiter une auto-école",
      icon: Car,
      features: [
        "Autorisation d'ouverture",
        "Délai de traitement : 30 jours ouvrables",
        "Formation professionnelle",
        "Contrôle qualité"
      ],
      path: "/e-services/ouverture-auto-ecole",
      color: "bg-violet-500",
      documents: [
        "Demande d'ouverture d'auto-école adressée au Ministre en charge des transports",
        "Quittance de 40 000 F",
        "25 000F de timbre, code général des impôts",
        "Extrait de naissance ou jugement supplétif (personne âgée d'au moins 21 ans)",
        "Certificat de nationalité nigérienne ou autorisation d'exercice pour étrangers",
        "Certificat de résidence au Niger",
        "Extrait de casier judiciaire datant de moins de trois (03) mois",
        "Quatre (04) photographies d'identité format 4x4",
        "Certificat médical de visite et contre visite (moins de 3 mois)",
        "Copie certifiée conforme des titres et références professionnelles",
        "Photocopies légalisées des diplômes d'au moins deux (02) moniteurs",
        "Lettre d'engagement à respecter les prescriptions",
        "Note descriptive des locaux, équipement et matériels",
        "Copie des documents prouvant les conditions du dirigeant",
        "Lettre d'engagement légalisée d'employer des moniteurs qualifiés"
      ]
    },

    // Homologation des Véhicules
    {
      id: "homologation-vehicules",
      title: "Homologation des Véhicules Terrestres à Moteur",
      description: "Homologuez votre véhicule selon les normes nigériennes",
      icon: Car,
      features: [
        "Conformité aux normes nationales",
        "Délai de traitement : 10 jours ouvrables",
        "Inspection technique incluse",
        "Certificat d'homologation"
      ],
      path: "/e-services/homologation-vehicules",
      color: "bg-emerald-500",
      documents: [
        "Demande manuscrite adressée au Ministre en charge des transports",
        "Copie de Procès-verbal de constat dressé par le GUAN ou les directions régionales des transports",
        "Quittance fiscale",
        "Fiche de garage",
        "Copie de la carte grise"
      ]
    },

    // Authenticité de Permis
    {
      id: "authenticite-permis",
      title: "Authenticité de Permis de Conduire",
      description: "Vérifiez l'authenticité d'un permis de conduire",
      icon: FileText,
      features: [
        "Vérification d'authenticité",
        "Délai de traitement : 5 jours ouvrables",
        "Certificat d'authenticité",
        "Sécurité renforcée"
      ],
      path: "/e-services/authenticite-permis",
      color: "bg-amber-500",
      documents: [
        "Demande manuscrite adressée au Ministre en charge des transports",
        "Copie légalisée du permis de conduire"
      ]
    },

    // Mise en Gage
    {
      id: "mise-en-gage-vehicule",
      title: "Inscription de Gage sur la Carte Grise d'un Véhicule",
      description: "Inscrivez un gage sur la carte grise de votre véhicule",
      icon: FileText,
      features: [
        "Inscription de gage",
        "Délai de traitement : 5 jours ouvrables",
        "Certificat d'inscription",
        "Sans frais"
      ],
      path: "/e-services/mise-en-gage-vehicule",
      color: "bg-pink-500",
      documents: [
        "Demande manuscrite adressée au Ministre en charge des transports",
        "Copie du contrat de gage de véhicule automobile",
        "Timbre fiscal 10 000 CGI",
        "Copie de la carte grise du véhicule",
        "Copie de pièce d'identité de l'intéressé"
      ]
    },

    // Carte Grise W et WW
    {
      id: "carte-grise-w-ww",
      title: "Carte Grise W et WW",
      description: "Obtenez une carte grise W ou WW pour votre véhicule",
      icon: Car,
      features: [
        "Carte grise spécialisée",
        "Délai de traitement : 10 jours ouvrables",
        "Autorisation d'entrepôt",
        "Assurance requise"
      ],
      path: "/e-services/carte-grise-w-ww",
      color: "bg-rose-500",
      documents: [
        "Demande manuscrite adressée au Ministre en charge des transports",
        "Autorisation d'ouverture d'entrepôt privé",
        "Reçu du paiement d'impôt",
        "Police d'assurance d'un an liée au numéro du certificat d'immatriculation W",
        "Timbre fiscal de 17000f, code général des impôts",
        "Quittance de 25000f"
      ]
    },

    // Agréments Transport Matières Dangereuses
    {
      id: "agrements-matières-dangereuses",
      title: "Agréments de Transport des Matières Dangereuses",
      description: "Obtenez l'agrément pour transporter des matières dangereuses",
      icon: Truck,
      features: [
        "Transport spécialisé",
        "Délai de traitement : 30 jours ouvrables",
        "Formation obligatoire",
        "Sécurité renforcée"
      ],
      path: "/e-services/agrements-matières-dangereuses",
      color: "bg-red-500",
      documents: [
        "Demande datée et signée du responsable de la société ou de l'organisme demandeur",
        "Statuts de la société ou de l'organisme",
        "Liste des véhicules destinés au transport des matières dangereuses et de leur conducteur",
        "Copies des titres de transport de chacun des véhicules",
        "Attestation de capacité professionnelle du conducteur (formation spécifique)",
        "Attestation de capacité technique délivrée par les services compétents",
        "Liste du personnel qualifié chargé de la supervision",
        "Copies de l'agrément des véhicules destinés au transport des matières dangereuses"
      ]
    },

    // Titre de Transport
    {
      id: "titre-transport",
      title: "Titre de Transport de Personnes et de Marchandises",
      description: "Obtenez le titre de transport pour personnes et marchandises",
      icon: Truck,
      features: [
        "Transport de personnes et marchandises",
        "Délai de traitement : 15 jours ouvrables",
        "Visite technique obligatoire",
        "Assurance requise"
      ],
      path: "/e-services/titre-transport",
      color: "bg-cyan-500",
      documents: [
        "Visite technique automobile",
        "Reçu délivré par la chambre de commerce et d'industrie du Niger",
        "Attestation de la CNSS pour le chauffeur",
        "Attestation d'assurance valable",
        "Patente de l'année en cours",
        "Vignette de l'année en cours",
        "Quittance de 2000 FCFA",
        "Copie de la carte grise du véhicule",
        "Copie de la carte d'identité du propriétaire (personne physique) ou statut de la société (personne morale)"
      ]
    },

    // Permis Biométrique
    {
      id: "permis-biometrique",
      title: "Édition de Permis de Conduire Biométrique",
      description: "Obtenez votre permis de conduire biométrique",
      icon: FileText,
      features: [
        "Permis biométrique sécurisé",
        "Délai de traitement : 7 jours ouvrables",
        "Technologie HARUN Printing",
        "Sécurité renforcée"
      ],
      path: "/e-services/permis-biometrique",
      color: "bg-slate-500",
      documents: [
        "Permis national",
        "Frais de 10700 FCFA"
      ]
    },

    // Immatriculation GUAN
    {
      id: "immatriculation-guan",
      title: "Immatriculation et Ré-immatriculation des Véhicules (GUAN)",
      description: "Immatriculez ou ré-immatriculez votre véhicule via le Guichet Unique Automobile",
      icon: Car,
      features: [
        "Guichet Unique Automobile",
        "Délai de traitement : 5 jours ouvrables",
        "Procédure simplifiée",
        "Service centralisé"
      ],
      path: "/e-services/immatriculation-guan",
      color: "bg-blue-600",
      documents: [
        "Documents spécifiques selon le type d'immatriculation",
        "Visite technique obligatoire",
        "Assurance valide",
        "Pièces d'identité du propriétaire"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <PageBanner
        title="E-Services"
        description="Accédez aux services en ligne du Ministère des Transports et de l'Aviation Civile"
      />

      <main className="py-16">
        <div className="container">
          {/* Introduction */}
          <section className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Services en Ligne
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Simplifiez vos démarches administratives grâce à nos services numériques.
              Effectuez vos demandes en ligne, suivez l'avancement de vos dossiers et
              recevez vos documents par voie électronique.
            </p>
          </section>

          {/* Services Grid */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={service.id} className="h-full hover-lift transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${service.color} text-white mb-4`}>
                        <service.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {service.external ? (
                      <a href={service.path} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full" size="lg">
                          Accéder au site ANAC
                        </Button>
                      </a>
                    ) : service.hasOnlineForm ? (
                      <div className="space-y-3">
                        <Link to={service.path}>
                          <Button className="w-full" size="lg">
                            Demande en ligne
                          </Button>
                        </Link>
                        {service.documents && (
                          <Button
                            variant="outline"
                            className="w-full"
                            size="lg"
                            onClick={() => handleShowDocuments(service)}
                          >
                            Voir les documents à fournir
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground text-center">
                          Rassemblez les documents requis et présentez-vous au service compétent
                        </p>
                        {service.documents && (
                          <Button
                            variant="outline"
                            className="w-full"
                            size="lg"
                            onClick={() => handleShowDocuments(service)}
                          >
                            Voir les documents à fournir
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>


        </div>
      </main>

      <Footer />

      {/* Modal pour afficher les documents requis */}
      {selectedService && (
        <DocumentsModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          serviceTitle={selectedService.title}
          documents={selectedService.documents}
        />
      )}
    </div>
  );
};

export default EServices;
