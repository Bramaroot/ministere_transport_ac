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
import { Search, Filter, Plus, Edit, Trash2, Eye, FileText, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
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
    fetchTenders();
  }, [filters]);

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
        await deleteTender(tenderId);
        await fetchTenders();
        toast({
          title: "Succès",
          description: "Appel d'offres supprimé avec succès.",
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de l'appel d'offres.",
          variant: "destructive",
        });
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
      if (editingTender) {
        await updateTender(editingTender.id, tenderData);
        toast({
          title: "Succès",
          description: "Appel d'offres modifié avec succès.",
        });
      } else {
        await createTender(tenderData);
        toast({
          title: "Succès",
          description: "Appel d'offres créé avec succès.",
        });
      }
      await fetchTenders();
      handleCloseForms();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la sauvegarde de l'appel d'offres: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
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
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span>Chargement des appels d'offres...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : error ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                              <div className="flex flex-col items-center gap-4">
                                <AlertCircle className="w-12 h-12 text-red-500" />
                                <p className="text-red-500">{error}</p>
                                <Button onClick={fetchTenders}>Réessayer</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : tenders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                              <div className="flex flex-col items-center gap-4">
                                <FileText className="w-12 h-12 text-muted-foreground" />
                                <p className="text-muted-foreground">Aucun appel d'offres trouvé</p>
                                <Button onClick={handleAddTender}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Créer un appel d'offres
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : tenders.map((tender) => (
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



