import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface NewsArticle {
  id: number;
  titre: string;
  contenu: string;
  url_image?: string;
  active: boolean;
  date_creation: string;
}

const News = () => {
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      // Filtrer seulement les actualités actives
      const activeNews = data.filter((item: NewsArticle) => item.active);
      setAllNews(activeNews);
      setFilteredNews(activeNews);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = allNews.filter(item =>
      item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contenu.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNews(results);
  }, [searchQuery, allNews]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <PageBanner 
        title="Actualités"
        description="Suivez toutes les nouvelles et annonces du Ministère des Transports et de l'Aviation Civile"
      />

      <section className="py-8 border-b bg-card">
        <div className="container">
          <div className="flex justify-end">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une actualité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/actualites/${item.id}`}
                  className="group animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className="overflow-hidden h-full hover-lift hover:shadow-xl transition-all">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={item.url_image || 'https://via.placeholder.com/800x500?text=Image+non+disponible'}
                        alt={item.titre}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.date_creation).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {item.titre}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3">
                        {item.contenu}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Aucune actualité trouvée.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;