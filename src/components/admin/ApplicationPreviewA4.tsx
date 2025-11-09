import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface ApplicationDetails {
    id: number;
    code_suivi: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    status: string;
    created_at: string;
    paths_photos_identite?: string[];
}

interface PreviewProps {
    application: ApplicationDetails;
    onClose: () => void;
}

const ApplicationPreviewA4: React.FC<PreviewProps> = ({ application, onClose }) => {
    const photoPath = application.paths_photos_identite?.[0];
    const photoUrl = photoPath 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/documents/permis-international/${application.code_suivi}/${photoPath.split('/').pop()}`
        : '/placeholder.svg'; // Fallback image

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 print:p-0">
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .printable-area, .printable-area * {
                            visibility: visible;
                        }
                        .printable-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            margin: 0;
                            padding: 0;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center no-print">
                    <h2 className="text-xl font-bold">Aperçu de la Demande</h2>
                    <div>
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="mr-2">
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                        </Button>
                        <Button variant="destructive" size="sm" onClick={onClose}>Fermer</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="printable-area w-[210mm] min-h-[297mm] mx-auto bg-white p-12 shadow-lg border">
                        <header className="flex justify-between items-start mb-12">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Fiche de Demande</h1>
                                <p className="text-gray-500">Permis de Conduire International</p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-sm">{application.code_suivi}</p>
                                <p className="text-sm text-gray-600">Date: {new Date(application.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                        </header>

                        <main>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 space-y-6">
                                    <h3 className="text-lg font-semibold border-b pb-2">Informations du Demandeur</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Nom</p>
                                            <p className="font-medium">{application.nom}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Prénom</p>
                                            <p className="font-medium">{application.prenom}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{application.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Téléphone</p>
                                            <p className="font-medium">{application.telephone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <img 
                                        src={photoUrl} 
                                        alt="Photo d'identité" 
                                        className="w-full h-auto border-4 border-gray-200"
                                        onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                                    />
                                </div>
                            </div>

                            <div className="mt-12">
                                <h3 className="text-lg font-semibold border-b pb-2">Statut de la Demande</h3>
                                <p className="mt-4 text-2xl font-bold uppercase">{application.status.replace(/_/g, ' ')}</p>
                            </div>
                        </main>

                        <footer className="absolute bottom-12 left-12 right-12 text-center text-xs text-gray-400 border-t pt-4">
                            Ministère des Transports et de l'Aviation Civile - République du Niger
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPreviewA4;
