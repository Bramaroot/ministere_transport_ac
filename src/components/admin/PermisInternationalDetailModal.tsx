import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ExternalLink, Printer, X, User, Phone, Mail, FileText, Calendar, MapPin, CheckCircle2, XCircle, Clock, Image } from 'lucide-react';
import ApplicationPreviewA4 from './ApplicationPreviewA4';
import TreatmentModal from '@/components/TreatmentModal';
import { cn } from '@/lib/utils';

const statusDetails = {
    en_attente: { label: "En attente", color: "text-orange-600", bgColor: "bg-orange-100" },
    approuvee: { label: "Approuvé", color: "text-green-600", bgColor: "bg-green-100" },
    traitee: { label: "Traité", color: "text-blue-600", bgColor: "bg-blue-100" },
    rejetee: { label: "Rejeté", color: "text-red-600", bgColor: "bg-red-100" },
};

const PermisInternationalDetailModal = ({ isOpen, onClose, request, onStatusChange }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [showTreatment, setShowTreatment] = useState(false);

    if (!isOpen || !request) return null;

    console.log("🔍 Modal - Request reçu:", request);
    console.log("🔍 Modal - Documents:", request.documents);
    console.log("🔍 Modal - Reference:", request.reference);

    const getStatusBadge = (status) => {
        const details = statusDetails[status] || { label: status, color: "text-gray-600", bgColor: "bg-gray-100" };
        return (
            <span className={cn("px-3 py-1 text-sm font-semibold rounded-full", details.color, details.bgColor)}>
                {details.label}
            </span>
        );
    };

    const renderDocumentLink = (doc, reference) => {
        if (!doc || !doc.chemin_fichier) return null;

        // chemin_fichier contient déjà le chemin complet comme "permis_international/reference/file.pdf"
        const fileUrl = `/private_uploads/${doc.chemin_fichier}`;

        return (
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
                <span className="truncate font-medium text-sm">{doc.type_document.replace(/_/g, ' ')}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
        );
    };

    const photoPath = request.documents?.find(doc => doc.type_document === 'photo_identite')?.chemin_fichier;
    const photoUrl = photoPath
        ? `/private_uploads/${photoPath}`
        : null;

    if (showPreview) {
        return <ApplicationPreviewA4 request={request} onClose={() => setShowPreview(false)} />;
    }

    if (showTreatment) {
        return <TreatmentModal
            isOpen={showTreatment}
            onClose={() => {
                setShowTreatment(false);
                onClose(); // Ferme aussi la modale parent
            }}
            request={request}
            onStatusChange={async (id, status, comment) => {
                await onStatusChange(id, status, comment);
                setShowTreatment(false);
                onClose(); // Ferme aussi la modale parent après mise à jour
            }}
        />;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Détails de la Demande</DialogTitle>
                    <DialogDescription>
                        Référence du dossier : <span className="font-mono">{request.reference}</span>
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                    {/* Colonne gauche: Photo */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg border-b pb-2">Photo d'Identité</h4>
                        <div className="w-full aspect-[3/4] border-2 border-gray-200 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt="Photo d'identité"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement.innerHTML = '<div class="flex flex-col items-center justify-center gap-2 text-muted-foreground"><Image class="w-12 h-12" /><p class="text-sm">Photo non disponible</p></div>';
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <Image className="w-12 h-12" />
                                    <p className="text-sm">Photo non disponible</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="font-semibold text-lg border-b pb-2">Documents Fournis</h4>
                            <div className="space-y-2">
                                {request.documents && request.documents.length > 0 ? (
                                    request.documents.map(doc => renderDocumentLink(doc, request.reference))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Aucun document fourni.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <h4 className="font-semibold text-lg border-b pb-2">Statut</h4>
                            <div className="mt-3">{getStatusBadge(request.statut)}</div>
                        </div>
                    </div>

                    {/* Colonne droite: Informations */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg border-b pb-2">Informations du Demandeur</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Nom Complet:</span><p>{request.demandeur_details?.nom_complet}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Email:</span><p>{request.demandeur_details?.email}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Téléphone:</span><p>{request.demandeur_details?.telephone}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Adresse:</span><p>{request.demandeur_details?.adresse || 'Non spécifiée'}</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6">
                            <h4 className="font-semibold text-lg border-b pb-2">Détails du Permis National</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Numéro:</span><p>{request.permis_details?.numero_permis}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Catégorie:</span><p>{request.permis_details?.categorie}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Délivré le:</span><p>{request.permis_details?.date_delivrance ? format(new Date(request.permis_details.date_delivrance), 'dd/MM/yyyy') : 'Non spécifié'}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><span className="font-medium">Expire le:</span><p>{request.permis_details?.date_expiration ? format(new Date(request.permis_details.date_expiration), 'dd/MM/yyyy') : 'Non spécifié'}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
                    <div className="flex gap-2 flex-1">
                        <Button variant="secondary" onClick={() => setShowPreview(true)}>
                            <Printer className="mr-2 h-4 w-4" /> Aperçu A4
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            <X className="mr-2 h-4 w-4" /> Fermer
                        </Button>
                    </div>
                    {onStatusChange && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                                onClick={async () => {
                                    await onStatusChange(request.id, 'approuvee', '');
                                    onClose();
                                }}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Approuver
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                                onClick={() => setShowTreatment(true)}
                            >
                                <Clock className="mr-2 h-4 w-4" /> Traiter
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                                onClick={() => setShowTreatment(true)}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Rejeter
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PermisInternationalDetailModal;
