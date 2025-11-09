import React, { useState, useEffect } from 'react';
import { getPermisInternationalApplicationById, updatePermisInternationalApplicationStatus } from '@/services/adminService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ExternalLink, Printer } from 'lucide-react';
import ApplicationPreviewA4 from './ApplicationPreviewA4';

interface ModalProps {
    applicationId: number;
    onClose: () => void;
}

interface ApplicationDetails {
    id: number;
    code_suivi: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    status: string;
    created_at: string;
    updated_at: string;
    path_demande_manuscrite: string;
    path_timbre_fiscal: string;
    path_copie_permis_national: string;
    path_copie_ancien_permis?: string;
    paths_photos_identite: string[]; // Assuming JSONB is parsed to array
}

const PermisInternationalDetailModal: React.FC<ModalProps> = ({ applicationId, onClose }) => {
    const [application, setApplication] = useState<ApplicationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false); // State for A4 preview

    useEffect(() => {
        const fetchApplication = async () => {
            setIsLoading(true);
            try {
                const data = await getPermisInternationalApplicationById(applicationId);
                
                // Robust JSON parsing for photo paths
                if (data.paths_photos_identite && typeof data.paths_photos_identite === 'string') {
                    try {
                        data.paths_photos_identite = JSON.parse(data.paths_photos_identite);
                    } catch (e) {
                        console.error("Failed to parse photo paths:", e);
                        data.paths_photos_identite = []; // Default to empty array on parse error
                    }
                } else if (!data.paths_photos_identite) {
                    data.paths_photos_identite = []; // Default to empty array if null/undefined
                }

                setApplication(data);
            } catch (err) {
                setError("Impossible de charger les détails de la demande.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplication();
    }, [applicationId]);

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await updatePermisInternationalApplicationStatus(applicationId, newStatus);
            onClose(); // Close modal on success
        } catch (err) {
            setError("Erreur lors de la mise à jour du statut.");
        } finally {
            setIsUpdating(false);
        }
    };

    const getFileName = (path: string) => path.split('/').pop();

    const renderDocumentLink = (path: string | undefined, label: string) => {
        if (!path) return <p className="text-sm text-gray-500">{label}: Non fourni</p>;
        const fileName = getFileName(path);
        // Use the full path to the API endpoint to avoid frontend routing issues
        const fileUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/documents/permis-international/${application?.code_suivi}/${fileName}`;

        return (
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
                <span className="truncate">{label}</span>
                <ExternalLink className="w-4 h-4 text-gray-600" />
            </a>
        );
    };

    if (showPreview && application) {
        return <ApplicationPreviewA4 application={application} onClose={() => setShowPreview(false)} />;
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Détails de la Demande</DialogTitle>
                    <DialogDescription>Code de suivi: {application?.code_suivi}</DialogDescription>
                </DialogHeader>
                
                {isLoading && <p>Chargement...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {application && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <h4 className="font-semibold">Informations du demandeur</h4>
                            <p><strong>Nom:</strong> {application.prenom} {application.nom}</p>
                            <p><strong>Email:</strong> {application.email || 'Non fourni'}</p>
                            <p><strong>Téléphone:</strong> {application.telephone || 'Non fourni'}</p>
                            <p><strong>Statut:</strong> <Badge>{application.status}</Badge></p>
                            <p><strong>Soumis le:</strong> {format(new Date(application.created_at), 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold">Documents Fournis</h4>
                            {renderDocumentLink(application.path_demande_manuscrite, "Demande manuscrite")}
                            {renderDocumentLink(application.path_timbre_fiscal, "Timbre fiscal")}
                            {renderDocumentLink(application.path_copie_permis_national, "Copie permis national")}
                            {renderDocumentLink(application.path_copie_ancien_permis, "Copie ancien permis")}
                            {application.paths_photos_identite?.map((photoPath, index) => 
                                renderDocumentLink(photoPath, `Photo d'identité ${index + 1}`)
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!application || isLoading}>
                        <Printer className="mr-2 h-4 w-4" /> Aperçu A4
                    </Button>
                    <Button variant="outline" onClick={onClose} disabled={isUpdating}>Fermer</Button>
                    <Button variant="destructive" onClick={() => handleStatusUpdate('rejetee')} disabled={isUpdating}>Rejeter</Button>
                    <Button variant="default" onClick={() => handleStatusUpdate('approuvee')} disabled={isUpdating}>Approuver</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PermisInternationalDetailModal;
