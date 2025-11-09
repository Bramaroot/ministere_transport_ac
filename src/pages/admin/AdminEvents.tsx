import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import { EventForm } from "@/components/EventForm";
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus, Edit, Trash2, Eye, Upload } from "lucide-react";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent, Event, EventFilters, formatEventDate, formatEventTime, getEventTypeLabel, getEventStatusLabel } from "@/services/eventService";
import { uploadEventImage } from "@/services/uploadService";
import { testAuthentication, forceLogin } from "@/utils/authTest";
import ImageUpload from "@/components/ImageUpload";

const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 20,
    type: 'all',
    statut: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
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

  const eventStatuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'publie', label: 'Publié' },
    { value: 'annule', label: 'Annulé' },
    { value: 'termine', label: 'Terminé' }
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
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchEvents();
    }
  }, [navigate, filters]);

  const handleFilterChange = (key: keyof EventFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/evenements/${eventId}`);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEditForm(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const token = localStorage.getItem('token');
        
        if (!isAuthenticated || !token) {
          alert('Vous devez être connecté pour effectuer cette action. Veuillez vous reconnecter.');
          navigate('/login');
          return;
        }

        await deleteEvent(eventId, token);
        await fetchEvents(); // Recharger la liste
        alert('Événement supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        
        if (error instanceof Error && error.message.includes('401')) {
          alert('Session expirée. Veuillez vous reconnecter.');
          localStorage.clear();
          navigate('/login');
        } else {
          alert('Erreur lors de la suppression de l\'événement');
        }
      }
    }
  };

  const handleImageUpload = async (eventId: number, file: File) => {
    try {
      await uploadEventImage(eventId, file);
      await fetchEvents(); // Rafraîchir la liste des événements
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  };

  const handleAddEvent = () => {
    setShowAddForm(true);
  };

  const handleCloseForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingEvent(null);
  };

  const handleFormSubmit = async (eventData: any) => {
    try {
      // Vérifier l'authentification
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const token = localStorage.getItem('token');
      
      console.log('État d\'authentification:', {
        isAuthenticated,
        token,
        hasToken: !!token
      });

      if (!isAuthenticated || !token) {
        alert('Vous devez être connecté pour effectuer cette action. Veuillez vous reconnecter.');
        navigate('/login');
        return;
      }

      console.log('Données à envoyer:', eventData);
      console.log('Token utilisé:', token);

      if (editingEvent) {
        console.log('Mise à jour de l\'événement:', editingEvent.id);
        const result = await updateEvent(editingEvent.id, eventData, token);
        console.log('Résultat de la mise à jour:', result);
        alert('Événement modifié avec succès');
      } else {
        console.log('Création d\'un nouvel événement');
        const result = await createEvent(eventData, token);
        console.log('Résultat de la création:', result);
        alert('Événement créé avec succès');
      }
      await fetchEvents(); // Recharger la liste
      handleCloseForms();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      console.error('Détails de l\'erreur:', error);
      
      // Vérifier si c'est une erreur d'authentification
      if (error instanceof Error && error.message.includes('401')) {
        alert('Session expirée. Veuillez vous reconnecter.');
        localStorage.clear();
        navigate('/login');
      } else {
        alert(`Erreur lors de la sauvegarde de l'événement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

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
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-gray-50">
              <div className="container py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Chargement des événements...</p>
                </div>
              </div>
            </div>
            <AdminFooter />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-50">
            <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Événements</h1>
          <p className="text-muted-foreground">Gérez les événements du ministère</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              testAuthentication();
              if (!localStorage.getItem('token')) {
                forceLogin();
                alert('Token de test configuré !');
              }
            }}
            title="Tester l'authentification"
          >
            🔧 Test Auth
          </Button>
          <Button onClick={handleAddEvent}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
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
              <SelectContent>
                {eventStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setFilters({ page: 1, limit: 20, type: 'all', statut: 'all', search: '' })}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des événements */}
      {error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchEvents}>Réessayer</Button>
        </div>
      ) : (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {event.image_url && (
                          <img 
                            src={event.image_url} 
                            alt={event.titre}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{event.titre}</p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getEventTypeColor(event.type_evenement)} text-white`}>
                        {getEventTypeLabel(event.type_evenement)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatEventDate(event.date_debut)}</p>
                        {event.heure_debut && (
                          <p className="text-muted-foreground">{formatEventTime(event.heure_debut)}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="line-clamp-1">{event.lieu}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getEventStatusColor(event.statut)}>
                        {getEventStatusLabel(event.statut)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewEvent(event.id)}
                          title="Voir l'événement"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          title="Modifier l'événement"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                handleImageUpload(event.id, file);
                              }
                            };
                            input.click();
                          }}
                          title="Uploader une image"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteEvent(event.id)}
                          title="Supprimer l'événement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
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
            </div>
          )}
        </>
      )}
            </div>
          </div>
          <AdminFooter />
        </div>
      </div>
      
      {/* Formulaire d'ajout/modification */}
      <EventForm
        event={editingEvent}
        onSubmit={handleFormSubmit}
        onClose={handleCloseForms}
        isOpen={showAddForm || showEditForm}
      />
    </SidebarProvider>
  );
};

export default AdminEvents;

