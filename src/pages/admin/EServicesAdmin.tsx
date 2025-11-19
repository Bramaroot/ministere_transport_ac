import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import { Eye, Search, Filter, Download } from "lucide-react";
import RequestDetailsModal from "./RequestDetailsModal";

const EServicesAdmin = () => {
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        // Route protégée par AdminRoute
    }, []);

    // Données simulées des demandes de permis international
    const mockRequests = [
        {
            id: "REQ-001",
            nom: "Diallo",
            prenom: "Aminata",
            dateNaissance: "1985-03-15",
            telephone: "+227 90 12 34 56",
            email: "aminata.diallo@email.com",
            numeroPermisNational: "PER-2023-001234",
            categoriePermis: "B",
            dateDelivrancePermis: "2023-01-15",
            lieuDelivrancePermis: "Niamey",
            numeroAncienPermis: "INT-2020-567890",
            dateDelivranceAncien: "2020-06-10",
            dateExpirationAncien: "2025-06-10",
            statut: "en_attente",
            dateSoumission: "2024-01-15T10:30:00Z",
            documents: {
                copiePermisNational: "permis_national_aminata.pdf",
                copieAncienPermis: "ancien_permis_aminata.pdf",
                photosIdentite: ["photo1_aminata.jpg", "photo2_aminata.jpg"]
            }
        },
        {
            id: "REQ-002",
            nom: "Moussa",
            prenom: "Ibrahim",
            dateNaissance: "1990-07-22",
            telephone: "+227 80 45 67 89",
            email: "ibrahim.moussa@email.com",
            numeroPermisNational: "PER-2022-002345",
            categoriePermis: "A, B",
            dateDelivrancePermis: "2022-08-20",
            lieuDelivrancePermis: "Zinder",
            numeroAncienPermis: null,
            dateDelivranceAncien: null,
            dateExpirationAncien: null,
            statut: "traite",
            dateSoumission: "2024-01-10T14:20:00Z",
            documents: {
                copiePermisNational: "permis_national_ibrahim.pdf",
                copieAncienPermis: null,
                photosIdentite: ["photo1_ibrahim.jpg", "photo2_ibrahim.jpg"]
            }
        },
        {
            id: "REQ-003",
            nom: "Oumarou",
            prenom: "Fatima",
            dateNaissance: "1988-12-05",
            telephone: "+227 95 78 90 12",
            email: "fatima.oumarou@email.com",
            numeroPermisNational: "PER-2023-003456",
            categoriePermis: "B, C",
            dateDelivrancePermis: "2023-03-10",
            lieuDelivrancePermis: "Maradi",
            numeroAncienPermis: "INT-2019-123456",
            dateDelivranceAncien: "2019-04-15",
            dateExpirationAncien: "2024-04-15",
            statut: "rejete",
            dateSoumission: "2024-01-05T09:15:00Z",
            documents: {
                copiePermisNational: "permis_national_fatima.pdf",
                copieAncienPermis: "ancien_permis_fatima.pdf",
                photosIdentite: ["photo1_fatima.jpg", "photo2_fatima.jpg"]
            }
        },
        {
            id: "REQ-004",
            nom: "Yacouba",
            prenom: "Mariam",
            dateNaissance: "1992-05-18",
            telephone: "+227 85 23 45 67",
            email: "mariam.yacouba@email.com",
            numeroPermisNational: "PER-2023-004567",
            categoriePermis: "B",
            dateDelivrancePermis: "2023-05-25",
            lieuDelivrancePermis: "Tahoua",
            numeroAncienPermis: null,
            dateDelivranceAncien: null,
            dateExpirationAncien: null,
            statut: "en_attente",
            dateSoumission: "2024-01-20T16:45:00Z",
            documents: {
                copiePermisNational: "permis_national_mariam.pdf",
                copieAncienPermis: null,
                photosIdentite: ["photo1_mariam.jpg", "photo2_mariam.jpg"]
            }
        }
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            en_attente: { label: "En attente", variant: "secondary" },
            traite: { label: "Traité", variant: "default" },
            rejete: { label: "Rejeté", variant: "destructive" },
            approuve: { label: "Approuvé", variant: "default" }
        };

        const config = statusConfig[status] || { label: status, variant: "secondary" };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const filteredRequests = mockRequests.filter(request => {
        const matchesSearch =
            request.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || request.statut === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AdminSidebar />

                <div className="flex-1 flex flex-col">
                    {/* Main Content */}
                    <main className="flex-1 bg-muted/30">
                        <div className="glass-card border-b sticky top-0 z-40 mb-8">
                            <div className="container py-4">
                                <div className="flex items-center gap-4">
                                    <SidebarTrigger />
                                    <Link to="/" className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                            <span className="text-primary-foreground font-bold">
                                                NE
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">
                                                Ministère des Transports
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Administration
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="container py-8">
                            <div className="space-y-6">
                                {/* En-tête */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold">E-Services</h1>
                                        <p className="text-muted-foreground">
                                            Gestion des demandes de permis international
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Exporter
                                        </Button>
                                    </div>
                                </div>

                                {/* Statistiques */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Total demandes</p>
                                                    <p className="text-2xl font-bold">{mockRequests.length}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">En attente</p>
                                                    <p className="text-2xl font-bold text-orange-600">
                                                        {mockRequests.filter(r => r.statut === 'en_attente').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Traitées</p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {mockRequests.filter(r => r.statut === 'traite').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Rejetées</p>
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {mockRequests.filter(r => r.statut === 'rejete').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Filtres et recherche */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                    <Input
                                                        placeholder="Rechercher par nom, prénom, email ou ID..."
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
                                                        <SelectItem value="traite">Traité</SelectItem>
                                                        <SelectItem value="rejete">Rejeté</SelectItem>
                                                        <SelectItem value="approuve">Approuvé</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tableau des demandes */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Demandes de Permis International</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>ID</TableHead>
                                                        <TableHead>Nom complet</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Téléphone</TableHead>
                                                        <TableHead>Permis national</TableHead>
                                                        <TableHead>Statut</TableHead>
                                                        <TableHead>Date soumission</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredRequests.map((request) => (
                                                        <TableRow key={request.id}>
                                                            <TableCell className="font-medium">{request.id}</TableCell>
                                                            <TableCell>{request.prenom} {request.nom}</TableCell>
                                                            <TableCell>{request.email}</TableCell>
                                                            <TableCell>{request.telephone}</TableCell>
                                                            <TableCell>{request.numeroPermisNational}</TableCell>
                                                            <TableCell>{getStatusBadge(request.statut)}</TableCell>
                                                            <TableCell>{formatDate(request.dateSoumission)}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleViewRequest(request)}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    Visualiser
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {filteredRequests.length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                Aucune demande trouvée
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Modal de visualisation */}
                                {selectedRequest && (
                                    <RequestDetailsModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        request={selectedRequest}
                                    />
                                )}
                            </div>
                        </div>
                    </main>

                    <AdminFooter />
                </div>
            </div>
        </SidebarProvider>
    );
};

export default EServicesAdmin;
