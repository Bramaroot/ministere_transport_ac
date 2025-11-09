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
import { TenderForm } from "@/components/TenderForm";
import { Search, Filter, Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import {
  getTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
  Tender,
  TenderFilters,
  formatTenderDate,
  formatTenderDateTime,
  getTenderCategoryLabel,
  getTenderStatusLabel,
  formatTenderAmount
} from "@/services/tenderService";
import { testAuthentication, forceLogin } from "@/utils/authTest";

const AdminTenders = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTender, setEditingTender] = useState<Tender | null>(null);
  const [filters, setFilters] = useState<TenderFilters>({
    page: 1,
    limit: 20,
    statut: 'all',
    categorie: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  const tenderCategories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'travaux', label: 'Travaux' },
    { value: 'fournitures', label: 'Fournitures' },
    { value: 'services', label: 'Services' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'autre', label: 'Autre' }
  ];

  const tenderStatuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'publie', label: 'Publié' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'cloture', label: 'Clôturé' },
    { value: 'attribue', label: 'Attribué' },
    { value: 'annule', label: 'Annulé' }
  ];

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await getTenders(filters);

      if (response.success) {
        setTenders(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError('Erreur lors du chargement des appels d\'offres');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des appels d\'offres:', error);
      setError('Erreur lors du chargement des appels d\'offres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchTenders();
    }
  }, [navigate, filters]);

  const handleFilterChange = (key: keyof TenderFilters, value: string | number) => {
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

  const handleViewTender = (tenderId: number) => {
    navigate(`/appels-offres/${tenderId}`);
  };

  const handleEditTender = (tender: Tender) => {
    setEditingTender(tender);
    setShowEditForm(true);
  };

  const handleDeleteTender = async (tenderId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet appel d\'offres ?')) {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const token = localStorage.getItem('token');

        if (!isAuthenticated || !token) {
          alert('Vous devez être connecté pour effectuer cette action. Veuillez vous reconnecter.');
          navigate('/login');
          return;
        }

        await deleteTender(tenderId, token);
        await fetchTenders(); // Recharger la liste
        alert('Appel d\'offres supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);

        if (error instanceof Error && error.message.includes('401')) {
          alert('Session expirée. Veuillez vous reconnecter.');
          localStorage.clear();
          navigate('/login');
        } else {
          alert('Erreur lors de la suppression de l\'appel d\'offres');
        }
      }
    }
  };

  const handleAddTender = () => {
    setShowAddForm(true);
  };

  const handleCloseForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingTender(null);
  };

  const handleFormSubmit = async (tenderData: any) => {
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

      console.log('Données à envoyer:', tenderData);
      console.log('Token utilisé:', token);

      if (editingTender) {
        console.log('Mise à jour de l\'appel d\'offres:', editingTender.id);
        const result = await updateTender(editingTender.id, tenderData, token);
        console.log('Résultat de la mise à jour:', result);
        alert('Appel d\'offres modifié avec succès');
      } else {
        console.log('Création d\'un nouvel appel d\'offres');
        const result = await createTender(tenderData, token);
        console.log('Résultat de la création:', result);
        alert('Appel d\'offres créé avec succès');
      }
      await fetchTenders(); // Recharger la liste
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
        alert(`Erreur lors de la sauvegarde de l'appel d'offres: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

  const getTenderStatusColor = (status: string) => {
    switch (status) {
      case 'publie':
        return 'bg-green-500';
      case 'en_cours':
        return 'bg-blue-500';
      case 'cloture':
        return 'bg-gray-500';
      case 'attribue':
        return 'bg-purple-500';
      case 'annule':
        return 'bg-red-500';
      case 'brouillon':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTenderCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'travaux':
        return 'bg-orange-500';
      case 'fournitures':
        return 'bg-blue-500';
      case 'services':
        return 'bg-green-500';
      case 'consultation':
        return 'bg-purple-500';
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
                  <p className="mt-4 text-muted-foreground">Chargement des appels d'offres...</p>
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
                  <h1 className="text-3xl font-bold">Gestion des Appels d'Offres</h1>
                  <p className="text-muted-foreground">Gérez les appels d'offres du ministère</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTender}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel appel d'offres
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

                    <Select value={filters.categorie || 'all'} onValueChange={(value) => handleFilterChange('categorie', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenderCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filters.statut || 'all'} onValueChange={(value) => handleFilterChange('statut', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenderStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={() => setFilters({ page: 1, limit: 20, statut: 'all', categorie: 'all', search: '' })}>
                      Réinitialiser
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des appels d'offres */}
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={fetchTenders}>Réessayer</Button>
                </div>
              ) : (
                <>
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Référence</TableHead>
                          <TableHead>Titre</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Date limite</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenders.map((tender) => (
                          <TableRow key={tender.id}>
                            <TableCell>
                              <div className="font-mono text-sm">
                                {tender.reference}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium line-clamp-1">{tender.titre}</p>
                                {tender.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">{tender.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getTenderCategoryColor(tender.categorie)} text-white`}>
                                {getTenderCategoryLabel(tender.categorie)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getTenderStatusColor(tender.statut)}>
                                {getTenderStatusLabel(tender.statut)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatTenderAmount(tender.montant_budget, tender.devise_budget)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {tender.date_limite ? formatTenderDate(tender.date_limite) : 'Non spécifiée'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewTender(tender.id)}
                                  title="Voir l'appel d'offres"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTender(tender)}
                                  title="Modifier l'appel d'offres"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteTender(tender.id)}
                                  title="Supprimer l'appel d'offres"
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
      <TenderForm
        tender={editingTender}
        onSubmit={handleFormSubmit}
        onClose={handleCloseForms}
        isOpen={showAddForm || showEditForm}
      />
    </SidebarProvider>
  );
};

export default AdminTenders;



