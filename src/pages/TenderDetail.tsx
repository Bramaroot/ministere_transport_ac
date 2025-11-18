import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft, Download, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  getTenderById, 
  Tender, 
  formatTenderDate, 
  getTenderCategoryLabel, 
  getTenderStatusLabel,
  formatTenderAmount
} from "@/services/tenderService";

const TenderDetail = () => {
  const { id } = useParams();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTender = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await getTenderById(parseInt(id));
      
      if (response.success) {
        setTender(response.data);
      } else {
        setError('Appel d\'offres non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'appel d\'offres:', error);
      setError('Erreur lors du chargement de l\'appel d\'offres');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTender();
  }, [fetchTender]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="py-8">
          <div className="container max-w-6xl">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement de l'appel d'offres...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen">
        <main className="py-8">
          <div className="container max-w-6xl">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Appel d'offres non trouvé</h2>
              <p className="text-muted-foreground mb-6">{error || 'L\'appel d\'offres demandé n\'existe pas.'}</p>
              <Button asChild>
                <Link to="/appels-offres">Retour aux appels d'offres</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="py-8">
        <div className="container max-w-6xl">
          <Link to="/appels-offres">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour aux appels d'offres
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge className="bg-primary/90">{getTenderCategoryLabel(tender.categorie)}</Badge>
              <Badge className="bg-secondary">{getTenderStatusLabel(tender.statut)}</Badge>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {tender.titre}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="font-mono text-sm">Réf: {tender.reference}</span>
              <span>•</span>
              <span>Budget: {tender.montant_budget ? formatTenderAmount(tender.montant_budget, tender.devise_budget) : 'Non spécifié'}</span>
            </div>
          </div>

          {/* Alert */}
          {tender.date_limite && (
            <Alert className="mb-8 animate-scale-in border-secondary bg-secondary/5">
              <AlertCircle className="h-4 w-4 text-secondary" />
              <AlertDescription>
                Date limite de soumission: <strong>{formatTenderDate(tender.date_limite)}</strong>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Description du projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {tender.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact */}
              <Card className="bg-primary/5 animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="font-medium">Direction des Marchés Publics</p>
                  <p className="text-muted-foreground">Email: marches@transports.gouv.ne</p>
                  <p className="text-muted-foreground">Tél: +227 20 72 XX XX</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TenderDetail;
