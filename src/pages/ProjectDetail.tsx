import { ArrowLeft, Calendar, Building2, Plane, Truck, Clock, TrendingUp } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project, getProjectById } from "@/services/projectService"; // Import Project and getProjectById

// Fonction pour obtenir l'icône et la couleur selon le secteur
const getSectorInfo = (sector?: string) => {
  switch (sector) {
    case "Transport Terrestre":
      return { icon: Truck, color: "bg-blue-500" };
    case "Aviation Civile":
      return { icon: Plane, color: "bg-green-500" };
    case "Infrastructures":
      return { icon: Building2, color: "bg-purple-500" };
    default:
      return { icon: Building2, color: "bg-gray-500" };
  }
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>(); // Ensure id is typed as string
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("ID du projet manquant.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const fetchedProject = await getProjectById(id);
        setProject(fetchedProject);
      } catch (err) {
        console.error("Erreur lors du chargement du projet:", err);
        setError("Impossible de charger les détails du projet.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]); // Re-fetch when ID changes

  if (loading) {
    return (
      <>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Chargement du projet...</h1>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Button onClick={() => navigate("/projets")} variant="outline">
            Retour aux projets
          </Button>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Projet non trouvé</h1>
          <Button onClick={() => navigate("/projets")} variant="outline">
            Retour aux projets
          </Button>
        </div>
      </>
    );
  }

  const { icon: SectorIcon, color: sectorColor } = getSectorInfo(project.sector);

  return (
    <>
      <PageBanner
        title={project.title}
        description={project.description || "Description du projet"}
      />

      <div className="container py-16 px-0 max-w-full">
        {/* Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/projets")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux projets
          </Button>
        </div>

        {/* Image et informations principales sur toute la largeur */}
        <div className="w-full mb-12">
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
            <img 
              src={project.image || "/assets/hero-transport.jpg"} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 text-white">
                <div className={`p-2 rounded-lg ${sectorColor} text-white`}>
                  <SectorIcon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{project.sector || "Infrastructure"}</span>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="text-sm bg-white/90 text-black">
                {project.status || "En cours"}
              </Badge>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="space-y-6 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Informations du projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Durée:</span>
                    <span className="font-medium">{project.duration || "Non spécifiée"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Budget:</span>
                    <span className="font-medium">{project.budget || "Non spécifié"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Secteur:</span>
                    <span className="font-medium">{project.sector || "Infrastructure"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Statut:</span>
                    <span className="font-medium">{project.status || "En cours"}</span>
                  </div>
                  
                  {project.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Créé le:</span>
                      <span className="font-medium">
                        {new Date(project.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Description du projet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {project.description || "Aucune description disponible pour ce projet."}
                </p>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Détails techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Objectifs</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Améliorer la connectivité et les échanges</li>
                      <li>• Moderniser les infrastructures de transport</li>
                      <li>• Renforcer la sécurité routière</li>
                      <li>• Faciliter le commerce et le développement économique</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Impact attendu</h4>
                    <p className="text-sm text-muted-foreground">
                      Ce projet contribuera significativement au développement des infrastructures de transport 
                      et améliorera la qualité de vie des citoyens du Niger.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;