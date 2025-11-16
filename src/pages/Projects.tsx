import { useState, useEffect } from "react";
import { Plane, Truck, Building2, ArrowRight, Calendar, MapPin, Users, TrendingUp, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllProjects, getProjectStats, Project, ProjectStats } from "@/services/projectService";

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


const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les projets depuis l'API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectsData, statsData] = await Promise.all([
          getAllProjects(),
          getProjectStats()
        ]);

        setProjects(projectsData);
        setStats(statsData);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        setError('Erreur lors du chargement des projets');



      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projets/${projectId}`);
  };

  if (loading) {
    return (
      <>
        <PageBanner
          title="Projets et Infrastructures"
          description="Découvrez nos projets en cours et nos réalisations dans le domaine du transport"
        />
        <div className="container py-16">
          <div className="text-center">
            <div className="text-lg">Chargement des projets...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="Projets et Infrastructures"
        description="Découvrez nos projets en cours et nos réalisations dans le domaine du transport"
      />

      <div className="container py-16">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Projets en cartes modernes */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {projects.map((project) => {
              const { icon: SectorIcon, color: sectorColor } = getSectorInfo(project.sector);
              return (
                <Card
                  key={project.id}
                  className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  {/* Image du projet */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image || "/assets/hero-transport.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="text-xs bg-white/90 text-black">
                        {project.status || "En cours"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-white">
                        <div className={`p-2 rounded-lg ${sectorColor} text-white`}>
                          <SectorIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{project.sector || "Infrastructure"}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4">
                      {project.description || "Description du projet"}
                    </p>

                    {/* Informations détaillées */}
                    <div className="space-y-3 mb-4">
                      {project.duration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Durée:</span>
                          <span className="font-medium">{project.duration}</span>
                        </div>
                      )}

                      {project.budget && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium">{project.budget}</span>
                        </div>
                      )}

                      {project.created_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Créé le:</span>
                          <span className="font-medium">
                            {new Date(project.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Tag className="w-4 h-4" />
                        <span>{project.sector || "Infrastructure"}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>



        </div>
      </div>
    </>
  );
};

export default Projects;