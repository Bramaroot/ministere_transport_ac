import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="container text-center py-20 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-4">Page non trouvée</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/actualites">
                  <Search className="w-5 h-5 mr-2" />
                  Voir les actualités
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default NotFound;
