import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import {
    Eye,
    Search,
    FileCheck,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
    ServerCrash,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    BarChart3,
    Download,
    Filter,
    Mail,
    Phone,
    Calendar
} from "lucide-react";
import PermisInternationalDetailModal from "@/components/admin/PermisInternationalDetailModal";
import TreatmentModal from "@/components/TreatmentModal";
import { getPermisInternationalApplications, updatePermisInternationalApplicationStatus } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const statusDetails = {
    en_attente: { label: "En attente", className: "bg-orange-100 text-orange-800 border-orange-200", icon: "⏱️" },
    approuvee: { label: "Approuvé", className: "bg-green-100 text-green-800 border-green-200", icon: "✅" },
    traitee: { label: "Traité", className: "bg-blue-100 text-blue-800 border-blue-200", icon: "📋" },
    rejetee: { label: "Rejeté", className: "bg-red-100 text-red-800 border-red-200", icon: "❌" },
};

const AdminPermisInternational = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRequests, setTotalRequests] = useState(0);
    const itemsPerPage = 10;

    const { toast } = useToast();
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const status = statusFilter === 'all' ? '' : statusFilter;
            const data = await getPermisInternationalApplications(currentPage, itemsPerPage, debouncedSearchTerm, status);
            setRequests(Array.isArray(data.applications) ? data.applications : []);
            setTotalPages(data.totalPages || 1);
            setTotalRequests(data.totalApplications || 0);
        } catch (err) {
            setError("Impossible de charger les demandes. Veuillez réessayer plus tard.");
            toast({
                title: "Erreur de chargement",
                description: "La connexion avec le serveur a échoué.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, statusFilter, toast]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setIsDetailModalOpen(true);
    };

    const handleTreatRequest = (request) => {
        console.log("handleTreatRequest appelé avec:", request);
        setSelectedRequest(request);
        setIsTreatmentModalOpen(true);
        console.log("isTreatmentModalOpen devrait être true maintenant");
    };

    const handleStatusChange = async (requestId, newStatus, comment) => {
        try {
            await updatePermisInternationalApplicationStatus(requestId, newStatus, comment);
            toast({
                title: "Statut mis à jour",
                description: "La demande a été mise à jour avec succès.",
            });
            fetchRequests();
        } catch (error) {
            toast({
                title: "Erreur",
                description: "La mise à jour du statut a échoué.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status) => {
        const config = statusDetails[status] || { label: status, className: "bg-gray-100 text-gray-700", icon: "•" };
        return (
            <Badge variant="outline" className={cn("font-medium", config.className)}>
                <span className="mr-1.5">{config.icon}</span>
                {config.label}
            </Badge>
        );
    };

    // Calculate statistics
    const stats = {
        total: totalRequests,
        pending: Array.isArray(requests) ? requests.filter(r => r.statut === 'en_attente').length : 0,
        approved: Array.isArray(requests) ? requests.filter(r => r.statut === 'approuvee').length : 0,
        rejected: Array.isArray(requests) ? requests.filter(r => r.statut === 'rejetee').length : 0,
    };

    const Pagination = () => (
        <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} ({totalRequests} demandes au total)
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 text-sm font-medium bg-muted rounded">{currentPage}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
                <AdminSidebar />
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-30 shadow-sm">
                        <div className="container py-4 px-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        Gestion des Demandes de Permis International
                                    </h1>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Administration et suivi des demandes de permis de conduire international
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={fetchRequests} className="gap-2">
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    Actualiser
                                </Button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-6">
                        <div className="space-y-6 max-w-[1600px] mx-auto">
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Total des Demandes
                                        </CardTitle>
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{stats.total}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Toutes les demandes
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            En Attente
                                        </CardTitle>
                                        <Clock className="h-5 w-5 text-orange-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Nécessitent un traitement
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Approuvées
                                        </CardTitle>
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Demandes validées
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Rejetées
                                        </CardTitle>
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Demandes refusées
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Filters and search */}
                            <Card className="shadow-md">
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    placeholder="Rechercher par nom, email, référence..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-56">
                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger className="gap-2">
                                                    <Filter className="w-4 h-4" />
                                                    <SelectValue placeholder="Filtrer par statut" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                                    <SelectItem value="en_attente">En attente</SelectItem>
                                                    <SelectItem value="approuvee">Approuvé</SelectItem>
                                                    <SelectItem value="traitee">Traité</SelectItem>
                                                    <SelectItem value="rejetee">Rejeté</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Table of requests */}
                            <Card className="shadow-lg">
                                <CardHeader className="border-b bg-muted/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <CardTitle>Liste des Demandes</CardTitle>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {Array.isArray(requests) ? requests.length : 0} résultat(s)
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead className="w-16 text-center font-semibold">#</TableHead>
                                                    <TableHead className="font-semibold">Demandeur</TableHead>
                                                    <TableHead className="font-semibold">Contact</TableHead>
                                                    <TableHead className="font-semibold">Date de Soumission</TableHead>
                                                    <TableHead className="font-semibold">Statut</TableHead>
                                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isLoading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center h-48">
                                                            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                                                            <p className="mt-3 text-muted-foreground font-medium">Chargement des demandes...</p>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : error ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center h-48">
                                                            <ServerCrash className="w-10 h-10 mx-auto text-destructive" />
                                                            <p className="mt-3 text-destructive font-semibold">{error}</p>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={fetchRequests}
                                                                className="mt-3"
                                                            >
                                                                Réessayer
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : !Array.isArray(requests) || requests.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center h-48">
                                                            <Search className="w-10 h-10 mx-auto text-muted-foreground" />
                                                            <h3 className="mt-3 text-lg font-semibold">Aucune demande trouvée</h3>
                                                            <p className="text-muted-foreground mt-1">Essayez de modifier vos filtres de recherche</p>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    requests.map((request, index) => (
                                                        <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                                                            <TableCell className="text-center">
                                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center mx-auto">
                                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    <div className="font-semibold">{request.demandeur_details?.nom_complet}</div>
                                                                    <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded inline-block">
                                                                        {request.reference}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="space-y-1 text-sm">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                                        <span>{request.demandeur_details?.email}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                                        <span>{request.demandeur_details?.telephone}</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                                    {format(new Date(request.created_at), 'dd/MM/yyyy', { locale: fr })}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                                    {format(new Date(request.created_at), 'HH:mm', { locale: fr })}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{getStatusBadge(request.statut)}</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleViewRequest(request)}
                                                                        className="gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                        <span className="hidden sm:inline">Voir</span>
                                                                    </Button>
                                                                    {request.statut === 'en_attente' && (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => handleTreatRequest(request)}
                                                                            className="gap-2 bg-primary hover:bg-primary/90"
                                                                        >
                                                                            <FileCheck className="w-4 h-4" />
                                                                            <span className="hidden sm:inline">Traiter</span>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {totalPages > 1 && <Pagination />}
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                    <AdminFooter />
                </div>

                {/* Modals */}
                {selectedRequest && (
                    <>
                        <PermisInternationalDetailModal
                            isOpen={isDetailModalOpen}
                            onClose={() => setIsDetailModalOpen(false)}
                            request={selectedRequest}
                        />
                        <TreatmentModal
                            isOpen={isTreatmentModalOpen}
                            onClose={() => setIsTreatmentModalOpen(false)}
                            request={selectedRequest}
                            onStatusChange={handleStatusChange}
                        />
                    </>
                )}
            </div>
        </SidebarProvider>
    );
};

export default AdminPermisInternational;
