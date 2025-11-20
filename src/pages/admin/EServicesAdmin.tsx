import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import { Eye, Search, FileCheck, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, ServerCrash } from "lucide-react";
import PermisInternationalDetailModal from "@/components/admin/PermisInternationalDetailModal";
import TreatmentModal from "@/components/TreatmentModal";
import { getPermisInternationalApplications, updatePermisInternationalApplicationStatus } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const statusDetails = {
    en_attente: { label: "En attente", className: "bg-orange-100 text-orange-800 border-orange-200", icon: "" },
    approuvee: { label: "Approuvé", className: "bg-green-100 text-green-800 border-green-200", icon: "" },
    traitee: { label: "Traité", className: "bg-blue-100 text-blue-800 border-blue-200", icon: "" },
    rejetee: { label: "Rejeté", className: "bg-red-100 text-red-800 border-red-200", icon: "" },
};

const EServicesAdmin = () => {
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
            setRequests(data.applications);
            setTotalPages(data.totalPages);
            setTotalRequests(data.totalApplications);
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
            fetchRequests(); // Re-fetch data to reflect changes
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

    const Pagination = () => (
        <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} ({totalRequests} demandes)
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm font-medium">{currentPage}</span>
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
        <div className="min-h-screen flex w-full bg-muted/30">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-30">
                    <div className="container py-3">
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des E-Services</h1>
                        <p className="text-muted-foreground text-sm">
                            Administration des demandes de permis de conduire international.
                        </p>
                    </div>
                </header>
                
                <main className="flex-1 p-4 sm:p-6">
                    <div className="space-y-6">
                        {/* Filters and search */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                placeholder="Rechercher par nom, email ou référence..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48">
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
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
                                    <Button variant="ghost" onClick={fetchRequests}>
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Table of requests */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b">
                                <CardTitle>Demandes de Permis International</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16 text-center">#</TableHead>
                                                <TableHead>Demandeur</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Soumission</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center h-48">
                                                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                                                        <p className="mt-2 text-muted-foreground">Chargement des demandes...</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : error ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center h-48">
                                                        <ServerCrash className="w-8 h-8 mx-auto text-destructive" />
                                                        <p className="mt-2 text-destructive font-semibold">{error}</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : requests.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center h-48">
                                                        <Search className="w-8 h-8 mx-auto text-muted-foreground" />
                                                        <h3 className="mt-2 text-lg font-semibold">Aucune demande trouvée</h3>
                                                        <p className="text-muted-foreground">Essayez de modifier vos filtres.</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                requests.map((request, index) => (
                                                    <TableRow key={request.id}>
                                                        <TableCell className="text-center font-medium text-muted-foreground">
                                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-semibold">{request.demandeur_details?.nom_complet}</div>
                                                            <div className="text-xs text-muted-foreground font-mono">{request.reference}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">{request.demandeur_details?.email}</div>
                                                            <div className="text-xs text-muted-foreground">{request.demandeur_details?.telephone}</div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')}
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(request.statut)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)} className="gap-2">
                                                                    <Eye className="w-4 h-4" />
                                                                    <span className="hidden sm:inline">Voir</span>
                                                                </Button>
                                                                {request.statut === 'en_attente' && (
                                                                    <Button size="sm" onClick={() => handleTreatRequest(request)} className="gap-2">
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
                        onStatusChange={handleStatusChange}
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
    );
};

export default EServicesAdmin;