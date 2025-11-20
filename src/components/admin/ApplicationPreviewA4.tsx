import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, X, MapPin, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusDetails = {
    en_attente: { label: "En attente", color: "text-orange-600", bgColor: "bg-orange-100" },
    approuve: { label: "Approuvé", color: "text-green-600", bgColor: "bg-green-100" },
    traite: { label: "Traité", color: "text-blue-600", bgColor: "bg-blue-100" },
    rejete: { label: "Rejeté", color: "text-red-600", bgColor: "bg-red-100" },
};

const ApplicationPreviewA4 = ({ request, onClose }) => {
    if (!request) return null;

    const photoPath = request.documents?.find(doc => doc.type_document === 'photo_identite')?.chemin_fichier;
    const photoUrl = photoPath 
        ? `${import.meta.env.VITE_API_URL}/uploads/private_uploads/permis_international/${request.reference}/${photoPath.split('/').pop()}`
        : '/placeholder.svg';

    const getStatusBadge = (status) => {
        const details = statusDetails[status] || { label: status, color: "text-gray-600", bgColor: "bg-gray-100" };
        return (
            <span className={cn("px-3 py-1 text-sm font-semibold rounded-full", details.color, details.bgColor)}>
                {details.label}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 print:hidden">
            <div className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-5xl h-full max-h-[95vh] flex flex-col">
                <div className="p-4 bg-white border-b flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">Aperçu de la Demande</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer / PDF
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="w-[210mm] min-h-[297mm] mx-auto bg-white p-8 shadow-lg border" id="printable-area">
                        {/* Official Header */}
                        <header className="text-center mb-8">
                            <div className="flex justify-between items-center">
                                <img src="/logo-niger.jpg" alt="Armoiries du Niger" className="h-24 w-24" />
                                <div className="flex-grow">
                                    <p className="font-serif text-sm">RÉPUBLIQUE DU NIGER</p>
                                    <p className="font-serif text-xs font-semibold tracking-widest">FRATERNITÉ - TRAVAIL - PROGRÈS</p>
                                    <h1 className="text-lg font-bold mt-2">MINISTÈRE DES TRANSPORTS ET DE L'AVIATION CIVILE</h1>
                                </div>
                                <img src="/logo-niger.jpg" alt="Armoiries du Niger" className="h-24 w-24" />
                            </div>
                            <div className="mt-4 border-double border-t-4 border-b-4 border-gray-800 h-2"></div>
                        </header>

                        {/* Title Block */}
                        <div className="text-center my-10 p-6 border-2 border-gray-300 bg-gray-50 rounded-lg">
                            <h2 className="text-2xl font-bold uppercase tracking-wider">Demande de Permis de Conduire International</h2>
                            <div className="mt-4 flex justify-around items-center text-sm">
                                <span>N° Dossier: <span className="font-mono font-semibold">{request.reference}</span></span>
                                <span>Date: <span className="font-semibold">{format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}</span></span>
                                <div>Statut: {getStatusBadge(request.statut)}</div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <main>
                            <div className="grid grid-cols-3 gap-8">
                                {/* Left: Applicant Details */}
                                <div className="col-span-2 space-y-6">
                                    <h3 className="text-xl font-semibold border-b-2 border-gray-300 pb-2 text-gray-700">Informations du Demandeur</h3>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                        <div className="col-span-2">
                                            <p className="text-gray-500">Nom Complet</p>
                                            <p className="font-medium text-base">{request.demandeur_details?.nom_complet}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Téléphone</p>
                                            <p className="font-medium">{request.demandeur_details?.telephone}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Email</p>
                                            <p className="font-medium">{request.demandeur_details?.email}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-500">Adresse</p>
                                            <p className="font-medium">{request.demandeur_details?.adresse || 'Non spécifiée'}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold border-b-2 border-gray-300 pb-2 text-gray-700 pt-6">Détails du Permis National</h3>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Numéro du Permis</p>
                                            <p className="font-medium">{request.permis_details?.numero_permis}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Catégorie</p>
                                            <p className="font-medium">{request.permis_details?.categorie}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Date de Délivrance</p>
                                            <p className="font-medium">{request.permis_details?.date_delivrance ? format(new Date(request.permis_details.date_delivrance), 'dd/MM/yyyy') : 'Non spécifié'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Date d'Expiration</p>
                                            <p className="font-medium">{request.permis_details?.date_expiration ? format(new Date(request.permis_details.date_expiration), 'dd/MM/yyyy') : 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Photo */}
                                <div className="col-span-1 flex flex-col items-center">
                                    <p className="text-center text-sm font-semibold text-gray-600 mb-2">Photo d'Identité</p>
                                    <div className="w-48 h-60 border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                                        <img 
                                            src={photoUrl} 
                                            alt="Photo d'identité" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="text-center text-xs text-gray-500 border-t-2 border-gray-300 pt-4 mt-12">
                            <p className="font-bold">MINISTÈRE DES TRANSPORTS ET DE L'AVIATION CIVILE</p>
                            <div className="flex items-center justify-center gap-4 mt-2">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> BP: 738 Niamey - Niger
                                </span>
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Tél: +227 20 72 26 41
                                </span>
                                <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> contact@transport.ne
                                </span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
            {/* Print-specific styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-area,
                    #printable-area * {
                        visibility: visible;
                    }
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 210mm;
                        background: white;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default ApplicationPreviewA4;

