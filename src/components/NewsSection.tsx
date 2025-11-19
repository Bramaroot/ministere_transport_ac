import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsArticle {
  id: number;
  titre: string;
  contenu: string;
  url_image?: string;
  active: boolean;
  date_creation: string;
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      // Filtrer seulement les actualités actives et prendre les 3 plus récentes
      const activeNews = data.filter((item: NewsArticle) => item.active).slice(0, 3);
      setNews(activeNews);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      // En cas d'erreur, utiliser des données de fallback
      // setNews([
      //   {
      //     id: 1,
      //     titre: "Bienvenue sur le portail du Ministère des Transports",
      //     contenu: "Le Ministère des Transports et de l'Aviation Civile du Niger vous souhaite la bienvenue sur son nouveau portail numérique.",
      //     url_image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop",
      //     active: true,
      //     date_creation: new Date().toISOString(),
      //   }
      // ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex justify-between items-end mb-12 animate-slide-up">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Actualités Récentes
            </h2>
            <p className="text-muted-foreground text-lg">
              Restez informé des dernières nouvelles du secteur
            </p>
          </div>
          <Link to="/actualites">
            <Button variant="outline" className="group">
              Voir tout
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <Link
                key={item.id}
                to={`/actualites/${item.slug || item.id}`}
                className="group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="overflow-hidden h-full hover-lift hover:shadow-xl transition-all">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.url_image || 'https://via.placeholder.com/800x500?text=Image+non+disponible'}
                      alt={item.titre}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 backdrop-blur">
                        Actualité
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.date_creation).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.titre}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {item.contenu.length > 150 ? `${item.contenu.substring(0, 150)}...` : item.contenu}
                    </p>
                    <div className="mt-4 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      Lire la suite
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
