import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, Search, Filter, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { getEvents, Event, EventFilters, formatEventDate, formatEventTime, getEventTypeLabel, getEventStatusLabel } from "@/services/eventService";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 12,
    type: 'all',
    statut: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  const eventTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'conference', label: 'Conférence' },
    { value: 'seminaire', label: 'Séminaire' },
    { value: 'formation', label: 'Formation' },
    { value: 'reunion', label: 'Réunion' },
    { value: 'ceremonie', label: 'Cérémonie' },
    { value: 'autre', label: 'Autre' }
  ];

 

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEvents(filters);
      
      if (response.success) {
        setEvents(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError('Erreur lors du chargement des événements');
      }
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (key: keyof EventFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

 

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'conference':
        return 'bg-blue-500';
      case 'seminaire':
        return 'bg-purple-500';
      case 'formation':
        return 'bg-green-500';
      case 'reunion':
        return 'bg-orange-500';
      case 'ceremonie':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des événements...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <PageBanner 
        title="Événements"
        description="Découvrez les événements du Ministère des Transports et de l'Aviation Civile"
      />

      {/* Navigation breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <span>/</span>
          <Link to="/actualites" className="hover:text-foreground flex items-center gap-1">
            <Newspaper className="w-4 h-4" />
            Actualités
          </Link>
          <span>/</span>
          <span className="text-foreground">Événements</span>
        </nav>
      </div>

      <main className="py-16">
        <div className="container">
          {/* Filtres */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Rechercher..."
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'événement" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.statut || 'all'} onValueChange={(value) => handleFilterChange('statut', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    
                  </Select>

                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({ page: 1, limit: 12, type: 'all', statut: 'all', search: '' })}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Liste des événements */}
          {error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchEvents}>Réessayer</Button>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun événement trouvé</h3>
              <p className="text-muted-foreground">
                Aucun événement ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <>
              <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => (
                    <Card key={event.id} className="h-full hover:shadow-lg transition-shadow">
                      {/* Image de l'événement */}
                      {event.image_url && (
                        <div className="relative">
                          <img 
                            src={event.image_url} 
                            alt={event.titre}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className={`${getEventTypeColor(event.type_evenement)} text-white`}>
                              {getEventTypeLabel(event.type_evenement)}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      <CardHeader>
                        {!event.image_url && (
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={`${getEventTypeColor(event.type_evenement)} text-white`}>
                              {getEventTypeLabel(event.type_evenement)}
                            </Badge>
                          </div>
                        )}
                        <CardTitle className="text-lg line-clamp-2">{event.titre}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatEventDate(event.date_debut)}</span>
                          </div>
                          
                          {event.heure_debut && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{formatEventTime(event.heure_debut)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{event.lieu}</span>
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="mt-4">
                          <Link to={`/evenements/${event.id}`}>
                            <Button className="w-full">
                              Voir les détails
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <section className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                      Page {pagination.currentPage} sur {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;

