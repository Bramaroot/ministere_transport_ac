import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    X,
    Download,
    FileText,
    User,
    Phone,
    Mail,
    Calendar,
    MapPin,
    CreditCard,
    Camera
} from "lucide-react";

interface RequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: any;
}

const RequestDetailsModal = ({ isOpen, onClose, request }: RequestDetailsModalProps) => {
    const formatDate = (dateString) => {
        if (!dateString) return "Non renseigné";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            en_attente: { label: "En attente", variant: "secondary", color: "text-orange-600" },
            traite: { label: "Traité", variant: "default", color: "text-blue-600" },
            rejete: { label: "Rejeté", variant: "destructive", color: "text-red-600" },
            approuve: { label: "Approuvé", variant: "default", color: "text-green-600" }
        };

        const config = statusConfig[status] || { label: status, variant: "secondary", color: "text-gray-600" };
        return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
                <DialogHeader className="print:hidden">
                    <DialogTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Dossier de demande - {request.id}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handlePrint}>
                                <Download className="w-4 h-4 mr-2" />
                                Imprimer
                            </Button>
                            <Button variant="outline" size="sm" onClick={onClose}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Contenu principal - Format A4 */}
                <div className="print:bg-white print:p-8 print:min-h-[297mm] print:w-[210mm] print:mx-auto print:shadow-none">

                    {/* En-tête du document */}
                    <div className="text-center mb-8 print:mb-6">
                        <h1 className="text-2xl font-bold mb-2 print:text-xl">MINISTÈRE DES TRANSPORTS ET DE L'AVIATION CIVILE</h1>
                        <h2 className="text-xl font-semibold mb-2 print:text-lg">RÉPUBLIQUE DU NIGER</h2>
                        <h3 className="text-lg font-medium text-blue-600 mb-4 print:text-base">DEMANDE DE PERMIS INTERNATIONAL</h3>
                        <div className="flex justify-between items-center">
                            <div className="text-sm">
                                <strong>N° de dossier :</strong> {request.id}
                            </div>
                            <div className="text-sm">
                                <strong>Date de soumission :</strong> {formatDateTime(request.dateSoumission)}
                            </div>
                            <div>
                                {getStatusBadge(request.statut)}
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Informations personnelles */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Informations Personnelles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Nom complet</label>
                                        <p className="text-lg font-semibold">{request.prenom} {request.nom}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date de naissance</label>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(request.dateNaissance)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Téléphone</label>
                                        <p className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            {request.telephone}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email</label>
                                        <p className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {request.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Lieu de naissance</label>
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {request.lieuNaissance || "Non renseigné"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Nationalité</label>
                                        <p>{request.nationalite || "Non renseigné"}</p>
                                    </div>
                                </div>
                            </div>

                            {request.adresse && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-600">Adresse complète</label>
                                    <p className="mt-1">{request.adresse}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Informations du permis national */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Permis National
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Numéro du permis</label>
                                        <p className="text-lg font-semibold">{request.numeroPermisNational}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Catégorie(s)</label>
                                        <p className="text-lg font-semibold">{request.categoriePermis}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date de délivrance</label>
                                        <p>{formatDate(request.dateDelivrancePermis)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Lieu de délivrance</label>
                                        <p>{request.lieuDelivrancePermis}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ancien permis international */}
                    {request.numeroAncienPermis && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Ancien Permis International
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Numéro de l'ancien permis</label>
                                            <p className="text-lg font-semibold">{request.numeroAncienPermis}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Date de délivrance</label>
                                            <p>{formatDate(request.dateDelivranceAncien)}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Date d'expiration</label>
                                            <p>{formatDate(request.dateExpirationAncien)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Documents fournis */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Documents Fournis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">Copie du permis national</h4>
                                        <p className="text-sm text-gray-600">
                                            {request.documents.copiePermisNational ?
                                                `✓ ${request.documents.copiePermisNational}` :
                                                "✗ Non fourni"
                                            }
                                        </p>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">Ancien permis international</h4>
                                        <p className="text-sm text-gray-600">
                                            {request.documents.copieAncienPermis ?
                                                `✓ ${request.documents.copieAncienPermis}` :
                                                "✗ Non fourni"
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-semibold mb-2">Photos d'identité</h4>
                                    <div className="space-y-2">
                                        {request.documents.photosIdentite && request.documents.photosIdentite.length > 0 ? (
                                            request.documents.photosIdentite.map((photo, index) => (
                                                <p key={index} className="text-sm text-gray-600">
                                                    ✓ Photo {index + 1}: {photo}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-600">✗ Aucune photo fournie</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations administratives */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Administratives</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Statut de la demande</label>
                                    <div className="mt-1">{getStatusBadge(request.statut)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Date de soumission</label>
                                    <p>{formatDateTime(request.dateSoumission)}</p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold mb-2">Frais requis</h4>
                                <p className="text-sm text-gray-600">
                                    • Timbre fiscal : 10 000 FCFA<br />
                                    • Frais de traitement : Selon les modalités en vigueur
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pied de page */}
                    <div className="mt-8 text-center text-sm text-gray-500 print:mt-6">
                        <p>Document généré automatiquement le {new Date().toLocaleDateString('fr-FR')}</p>
                        <p>Ministère des Transports et de l'Aviation Civile - République du Niger</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RequestDetailsModal;
