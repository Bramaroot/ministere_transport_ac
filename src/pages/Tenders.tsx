import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, FileText, Search, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getPublishedTenders, 
  Tender, 
  TenderFilters, 
  formatTenderDate, 
  getTenderCategoryLabel, 
  getTenderStatusLabel,
  formatTenderAmount
} from "@/services/tenderService";

const Tenders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenders = useCallback(async () => {
    try {
      setLoading(true);
      const filters: TenderFilters = {
        page: 1,
        limit: 20,
        categorie: categoryFilter === 'all' ? undefined : categoryFilter,
        search: searchTerm || undefined
      };
      
      const response = await getPublishedTenders(filters);
      
      if (response.success) {
        setTenders(response.data);
      } else {
        setError('Erreur lors du chargement des appels d\'offres');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des appels d\'offres:', error);
      setError('Erreur lors du chargement des appels d\'offres');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTenders();
  }, [fetchTenders]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <PageBanner 
          title="Appels d'Offres"
          description="Consultez tous nos marchés publics et opportunités de collaboration"
        />

        {/* Filters */}
        <section className="py-8 border-b bg-card">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un appel d'offres..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="infrastructures">Infrastructures</SelectItem>
                  <SelectItem value="aviation">Aviation Civile</SelectItem>
                  <SelectItem value="securite">Sécurité Routière</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Tenders List */}
        <section className="py-12">
          <div className="container">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des appels d'offres...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchTenders}>Réessayer</Button>
              </div>
            ) : tenders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun appel d'offres trouvé</h3>
                <p className="text-muted-foreground">Il n'y a actuellement aucun appel d'offres disponible.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tenders.map((tender, index) => (
                  <Link
                    key={tender.id}
                    to={`/appels-offres/${tender.id}`}
                    className="group animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Card className="h-full hover-lift hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {getTenderCategoryLabel(tender.categorie)}
                          </Badge>
                          <Badge className={tender.statut === "publie" ? "bg-secondary/90" : "bg-muted"}>
                            {getTenderStatusLabel(tender.statut)}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {tender.titre}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            Réf: {tender.reference}
                          </p>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                          {tender.date_limite && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>Date limite: {formatTenderDate(tender.date_limite)}</span>
                            </div>
                          )}
                          {tender.montant_budget && (
                            <div className="font-semibold text-primary">
                              Budget: {formatTenderAmount(tender.montant_budget, tender.devise_budget)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                          Consulter le dossier
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
      </main>

      <Footer />
    </div>
  );
};

export default Tenders;
