import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Mail, Phone, User, Globe } from "lucide-react";
import { getEventById, Event, formatEventDate, formatEventTime, getEventTypeLabel, getEventStatusLabel } from "@/services/eventService";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getEventById(parseInt(id));
      
      if (response.success) {
        setEvent(response.data);
      } else {
        setError('Événement non trouvé');
      }
    } catch (err) {
      setError('Erreur lors du chargement de l\'événement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'publie':
        return 'bg-green-500';
      case 'brouillon':
        return 'bg-yellow-500';
      case 'annule':
        return 'bg-red-500';
      case 'termine':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
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
        <div className="container py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen">
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate("/evenements")} variant="outline">
            Retour aux événements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageBanner
        title={event.titre}
        description={event.description || "Détails de l'événement"}
      />

      <main className="py-16">
        <div className="container">
          {/* Navigation */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/evenements")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux événements
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image de l'événement */}
              {event.image_url && (
                <Card>
                  <CardContent className="p-0">
                    <img 
                      src={event.image_url} 
                      alt={event.titre}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {event.description || "Aucune description disponible pour cet événement."}
                  </p>
                </CardContent>
              </Card>

              {/* Informations supplémentaires */}
              
            </div>

            {/* Sidebar avec informations */}
            <div className="space-y-6">
              {/* Informations principales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    
                  </div>

                  {event.heure_debut && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formatEventTime(event.heure_debut)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <p className="font-medium">{event.lieu}</p>
                  </div>
                </CardContent>
              </Card>

 
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;

