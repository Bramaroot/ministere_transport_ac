import { useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen, BarChart, Download, Clock, Construction } from "lucide-react";
import { Link } from "react-router-dom";

const Publications = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

   
  return (
    <div className="min-h-screen">
      <PageBanner 
        title="Publications"
        description="Accédez aux publications officielles du Ministère des Transports et de l'Aviation Civile"
      />

      <main className="py-16">
        <div className="container">
          {/* Message de développement en cours */}
          <section className="mb-16">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Construction className="w-16 h-16 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-orange-800 mb-4">
                  Section en Cours de Développement
                </h2>
                <p className="text-orange-700 text-lg mb-6 max-w-2xl mx-auto">
                  Nous travaillons actuellement sur cette section pour vous offrir un accès 
                  complet aux publications officielles du ministère. Cette fonctionnalité 
                  sera bientôt disponible.
                </p>
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Disponible prochainement</span>
                </div>
              </CardContent>
            </Card>
          </section>

 
         </div>
      </main>
    </div>
  );
};

export default Publications;
