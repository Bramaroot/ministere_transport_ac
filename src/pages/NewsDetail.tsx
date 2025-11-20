import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Share2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NewsArticle {
  id: number;
  titre: string;
  contenu: string;
  url_image?: string;
  date_creation: string;
  slug?: string;
}

const NewsDetail = () => {
  const { id } = useParams(); // Peut être un ID ou un slug
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      // Le backend gère automatiquement ID ou slug
      const response = await fetch(`/api/news/${id}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l\'article.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.titre,
        text: `Lisez cet article : ${article?.titre}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Copié !", description: "Le lien de l\'article a été copié dans le presse-papiers." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <>
        <div className="container text-center py-20">
          <h1 className="text-2xl font-bold">Article non trouvé</h1>
          <p className="text-muted-foreground mb-6">L'article que vous cherchez n'existe pas ou a été déplacé.</p>
          <Link to="/actualites">
            <Button>Retour aux actualités</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="py-8">
        <div className="container">
          <Link to="/actualites">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour aux actualités
            </Button>
          </Link>

          <article className="max-w-4xl mx-auto">
            <div className="mb-8 animate-slide-up">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {article.titre}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Publié le {new Date(article.date_creation).toLocaleDateString()}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="group" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>

            {article.url_image && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-8 animate-scale-in bg-muted">
                <img
                  src={article.url_image}
                  alt={article.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=Image+non+disponible';
                  }}
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none mb-12 animate-fade-in"
              dangerouslySetInnerHTML={{ __html: article.contenu.replace(/\n/g, '<br />') }}
            />

          </article>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;