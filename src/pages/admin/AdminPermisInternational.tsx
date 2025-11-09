import React, { useState, useEffect, useCallback } from 'react';
import { getPermisInternationalApplications } from '@/services/adminService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import PermisInternationalDetailModal from '@/components/admin/PermisInternationalDetailModal';

// Debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

interface Application {
    id: number;
    code_suivi: string;
    nom: string;
    prenom: string;
    status: string;
    created_at: string;
}

const AdminPermisInternational: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // Initialize with 'all'
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // State for the detail modal
    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getPermisInternationalApplications(
                currentPage, 
                10, 
                debouncedSearchTerm, 
                statusFilter === 'all' ? '' : statusFilter // Pass empty string if 'all'
            );
            setApplications(data.data);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError("Impossible de charger les demandes.");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, statusFilter]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, statusFilter]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleViewDetails = (id: number) => {
        setSelectedApplicationId(id);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedApplicationId(null);
        fetchApplications(); // Refetch data to show updated status
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approuvee': return 'default';
            case 'rejetee': return 'destructive';
            case 'en_cours_de_traitement': return 'secondary';
            default: return 'outline';
        }
    };

    const statusOptions = ['en_attente', 'en_cours_de_traitement', 'approuvee', 'rejetee'];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="flex-1 p-4 md:p-8 bg-gray-50">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestion des Demandes de Permis International</h1>

                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                placeholder="Chercher par nom, code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    {statusOptions.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading && <p className="text-center">Chargement des demandes...</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {!isLoading && !error && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">#</TableHead>
                                        <TableHead>Code de Suivi</TableHead>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Date de Soumission</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((app, index) => (
                                        <TableRow key={app.id}>
                                            <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                            <TableCell className="font-mono">{app.code_suivi}</TableCell>
                                            <TableCell>{`${app.prenom} ${app.nom}`}</TableCell>
                                            <TableCell>{format(new Date(app.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(app.status)}>{app.status.replace(/_/g, ' ')}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(app.id)}>
                                                    Voir Détails
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Pagination className="mt-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

                    {isModalOpen && selectedApplicationId && (
                        <PermisInternationalDetailModal
                            applicationId={selectedApplicationId}
                            onClose={handleCloseModal}
                        />
                    )}
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AdminPermisInternational;
