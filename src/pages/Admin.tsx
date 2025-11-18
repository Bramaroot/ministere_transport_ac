import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import {
  FileText,
  FileEdit,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getStats, StatsResponse } from "@/services/statsService";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/mtac-dash-login");
    } else {
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await getStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Erreur lors du chargement des statistiques');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      label: "Articles",
      value: stats?.articles || 0,
      trend: "+2",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Appels d'Offres",
      value: stats?.tenders || 0,
      trend: "En cours",
      icon: FileEdit,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Événements",
      value: stats?.events || 0,
      trend: "Actifs",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Utilisateurs",
      value: stats?.users || 0,
      trend: "Inscrits",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Main Content */}
          <main className="flex-1 bg-muted/30">
            <div className="glass-card border-b sticky top-0 z-40 mb-8">
              <div className="container py-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">
                        NE
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm">
                        Ministère des Transports
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Administration
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="container py-8">
              <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
                <p className="text-muted-foreground">
                  Bienvenue dans votre espace d'administration
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-8 h-8 bg-muted rounded"></div>
                          <div className="w-16 h-4 bg-muted rounded"></div>
                        </div>
                        <div className="w-16 h-8 bg-muted rounded mb-2"></div>
                        <div className="w-20 h-4 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : error ? (
                  <div className="col-span-full text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={fetchStats}>Réessayer</Button>
                  </div>
                ) : (
                  statsCards.map((stat, index) => (
                    <Card
                      key={stat.label}
                      className="animate-scale-in hover:shadow-lg transition-shadow"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <span className={`text-sm font-medium ${stat.color}`}>
                            {stat.trend}
                          </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Recent Activity */}
              {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Articles */}
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Articles Récents
                      </CardTitle>
                      <CardDescription>
                        Derniers articles publiés
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.recentArticles.map((article, index) => (
                          <div key={article.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{article.titre}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(article.date_creation).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {article.statut === 'publie' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Tenders */}
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileEdit className="w-5 h-5 text-green-600" />
                        Appels d'Offres Récents
                      </CardTitle>
                      <CardDescription>
                        Derniers appels d'offres
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.recentTenders.map((tender, index) => (
                          <div key={tender.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <FileEdit className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{tender.titre}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(tender.date_creation).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {tender.statut === 'publie' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Events */}
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Événements Récents
                      </CardTitle>
                      <CardDescription>
                        Derniers événements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.recentEvents.map((event, index) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{event.titre}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.date_creation).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {event.statut === 'publie' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Activity 
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Activité Récente</CardTitle>
                  <CardDescription>
                    Dernières modifications du site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Publication d'une actualité",
                        time: "Il y a 2 heures",
                        user: "Admin Principal",
                      },
                      {
                        action: "Mise à jour d'un appel d'offres",
                        time: "Il y a 5 heures",
                        user: "Éditeur",
                      },
                      {
                        action: "Ajout d'un nouveau document",
                        time: "Hier",
                        user: "Admin Principal",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 pb-4 border-b last:border-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <LayoutDashboard className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            Par {activity.user}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </main>
          
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
