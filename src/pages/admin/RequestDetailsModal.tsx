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
    Camera,
    Printer,
    Clock,
    CheckCircle2,
    XCircle,
    Check,
    Minus,
    DollarSign
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
            en_attente: {
                label: "En attente de traitement",
                className: "bg-orange-100 text-orange-700 border-orange-200",
                Icon: Clock
            },
            traite: {
                label: "Traité",
                className: "bg-blue-100 text-blue-700 border-blue-200",
                Icon: CheckCircle2
            },
            rejete: {
                label: "Rejeté",
                className: "bg-red-100 text-red-700 border-red-200",
                Icon: XCircle
            },
            approuve: {
                label: "Approuvé",
                className: "bg-green-100 text-green-700 border-green-200",
                Icon: CheckCircle2
            }
        };

        const config = statusConfig[status] || {
            label: status,
            className: "bg-gray-100 text-gray-700",
            Icon: null
        };

        return (
            <Badge className={`${config.className} px-3 py-1 flex items-center gap-1.5`}>
                {config.Icon && <config.Icon className="w-3.5 h-3.5" />}
                {config.label}
            </Badge>
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:shadow-none">
                {/* En-tête non imprimable */}
                <DialogHeader className="print:hidden border-b pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <span>Dossier de demande {request.id}</span>
                        </DialogTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="default"
                                onClick={handlePrint}
                                className="gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimer
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Contenu imprimable - Format A4 */}
                <div className="print:bg-white print:p-12 print:min-h-[297mm] print:w-[210mm] print:mx-auto">
                    {/* En-tête officiel pour impression */}
                    <div className="mb-8 print:mb-10">
                        {/* En-tête République avec armoiries */}
                        <div className="text-center mb-6 print:mb-8 border-b-4 border-double border-primary pb-6">
                            <div className="flex items-center justify-center gap-6 mb-4">
                                {/* Armoirie gauche */}
                                <div className="w-20 h-20 print:w-24 print:h-24">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        {/* Cercle extérieur vert */}
                                        <circle cx="50" cy="50" r="48" fill="#0DB02B" stroke="#000" strokeWidth="1"/>
                                        {/* Cercle orange */}
                                        <circle cx="50" cy="50" r="40" fill="#FF8C00"/>
                                        {/* Soleil central */}
                                        <circle cx="50" cy="50" r="25" fill="#FFD700"/>
                                        {/* Rayons du soleil */}
                                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                            const x1 = 50 + 28 * Math.cos(angle * Math.PI / 180);
                                            const y1 = 50 + 28 * Math.sin(angle * Math.PI / 180);
                                            const x2 = 50 + 38 * Math.cos(angle * Math.PI / 180);
                                            const y2 = 50 + 38 * Math.sin(angle * Math.PI / 180);
                                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD700" strokeWidth="2"/>;
                                        })}
                                        <text x="50" y="55" textAnchor="middle" fill="#000" fontSize="20" fontWeight="bold">NE</text>
                                    </svg>
                                </div>

                                {/* Texte central */}
                                <div>
                                    <h1 className="text-xl font-bold uppercase tracking-wide print:text-2xl">
                                        République du Niger
                                    </h1>
                                    <p className="text-lg italic font-semibold text-primary mt-1">
                                        Fraternité - Travail - Progrès
                                    </p>
                                    <div className="mt-3 text-sm">
                                        <p className="font-bold">MINISTÈRE DES TRANSPORTS</p>
                                        <p className="font-bold">ET DE L'AVIATION CIVILE</p>
                                    </div>
                                </div>

                                {/* Armoirie droite */}
                                <div className="w-20 h-20 print:w-24 print:h-24">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <circle cx="50" cy="50" r="48" fill="#0DB02B" stroke="#000" strokeWidth="1"/>
                                        <circle cx="50" cy="50" r="40" fill="#FF8C00"/>
                                        <circle cx="50" cy="50" r="25" fill="#FFD700"/>
                                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                            const x1 = 50 + 28 * Math.cos(angle * Math.PI / 180);
                                            const y1 = 50 + 28 * Math.sin(angle * Math.PI / 180);
                                            const x2 = 50 + 38 * Math.cos(angle * Math.PI / 180);
                                            const y2 = 50 + 38 * Math.sin(angle * Math.PI / 180);
                                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD700" strokeWidth="2"/>;
                                        })}
                                        <text x="50" y="55" textAnchor="middle" fill="#000" fontSize="20" fontWeight="bold">NE</text>
                                    </svg>
                                </div>
                            </div>

                            {/* Sous-titre */}
                            <p className="text-sm text-muted-foreground">
                                Direction Générale des Transports Routiers
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
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
                        </div>

                        {/* Titre du document */}
                        <div className="text-center mb-6 print:mb-8 bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-primary mb-3 print:text-3xl uppercase tracking-wide">
                                Demande de Permis de Conduire International
                            </h2>
                            <div className="flex items-center justify-center flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
                                    <span className="font-semibold text-muted-foreground">N° Dossier:</span>
                                    <span className="font-mono font-bold text-lg text-primary">
                                        {request.id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-semibold text-muted-foreground">Date:</span>
                                    <span className="font-medium">{formatDateTime(request.dateSoumission)}</span>
                                </div>
                                <div>
                                    {getStatusBadge(request.statut)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations personnelles */}
                    <Card className="mb-6 print:shadow-none print:border-2">
                        <CardHeader className="bg-muted/30 print:bg-gray-50">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="w-5 h-5 text-primary" />
                                INFORMATIONS PERSONNELLES DU DEMANDEUR
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Nom et Prénom(s)
                                        </label>
                                        <p className="text-lg font-bold mt-1">
                                            {request.prenom} {request.nom}
                                        </p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Date de naissance
                                        </label>
                                        <p className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {formatDate(request.dateNaissance)}
                                        </p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Téléphone
                                        </label>
                                        <p className="flex items-center gap-2 mt-1">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            {request.telephone}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Adresse email
                                        </label>
                                        <p className="flex items-center gap-2 mt-1">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            {request.email}
                                        </p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Lieu de naissance
                                        </label>
                                        <p className="flex items-center gap-2 mt-1">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            {request.lieuNaissance || "Non renseigné"}
                                        </p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Nationalité
                                        </label>
                                        <p className="mt-1">{request.nationalite || "Nigérienne"}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations du permis national */}
                    <Card className="mb-6 print:shadow-none print:border-2 print:page-break-inside-avoid">
                        <CardHeader className="bg-muted/30 print:bg-gray-50">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CreditCard className="w-5 h-5 text-primary" />
                                PERMIS DE CONDUIRE NATIONAL
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Numéro du permis
                                        </label>
                                        <p className="text-lg font-bold mt-1 font-mono">
                                            {request.numeroPermisNational}
                                        </p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Catégorie(s)
                                        </label>
                                        <p className="text-lg font-semibold mt-1 text-primary">
                                            {request.categoriePermis}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Date de délivrance
                                        </label>
                                        <p className="mt-1">{formatDate(request.dateDelivrancePermis)}</p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Lieu de délivrance
                                        </label>
                                        <p className="mt-1">{request.lieuDelivrancePermis}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ancien permis international si existe */}
                    {request.numeroAncienPermis && (
                        <Card className="mb-6 print:shadow-none print:border-2 print:page-break-inside-avoid">
                            <CardHeader className="bg-muted/30 print:bg-gray-50">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                    ANCIEN PERMIS INTERNATIONAL (Renouvellement)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Numéro
                                        </label>
                                        <p className="text-lg font-bold mt-1 font-mono">
                                            {request.numeroAncienPermis}
                                        </p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Délivré le
                                        </label>
                                        <p className="mt-1">{formatDate(request.dateDelivranceAncien)}</p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Expire le
                                        </label>
                                        <p className="mt-1 text-red-600 font-semibold">
                                            {formatDate(request.dateExpirationAncien)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Documents fournis */}
                    <Card className="mb-6 print:shadow-none print:border-2 print:page-break-inside-avoid">
                        <CardHeader className="bg-muted/30 print:bg-gray-50">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Camera className="w-5 h-5 text-primary" />
                                DOCUMENTS FOURNIS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-4 bg-muted/20">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                            request.documents.copiePermisNational ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {request.documents.copiePermisNational ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-1">Copie du permis national</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {request.documents.copiePermisNational || "Non fourni"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4 bg-muted/20">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                            request.documents.copieAncienPermis ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {request.documents.copieAncienPermis ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-1">Ancien permis international</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {request.documents.copieAncienPermis || "Non applicable"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4 bg-muted/20 col-span-2">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                            request.documents.photosIdentite?.length > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {request.documents.photosIdentite?.length > 0 ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-2">Photos d'identité</h4>
                                            {request.documents.photosIdentite && request.documents.photosIdentite.length > 0 ? (
                                                <ul className="space-y-1 text-sm text-muted-foreground">
                                                    {request.documents.photosIdentite.map((photo, index) => (
                                                        <li key={index}>• Photo {index + 1}: {photo}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-red-600">Aucune photo fournie</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations administratives et frais */}
                    <Card className="print:shadow-none print:border-2 print:page-break-inside-avoid">
                        <CardHeader className="bg-primary/5 print:bg-primary/10">
                            <CardTitle className="text-lg">Informations Administratives</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <span className="font-semibold">Statut de la demande:</span>
                                    {getStatusBadge(request.statut)}
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        Frais requis
                                    </h4>
                                    <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 rounded-lg p-4">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center justify-between">
                                                <span>• Timbre fiscal:</span>
                                                <span className="font-bold">10 000 FCFA</span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span>• Frais de traitement:</span>
                                                <span className="font-bold">Selon modalités en vigueur</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pied de page officiel */}
                    <div className="mt-12 pt-8 border-t-2 print:mt-16">
                        <div className="grid grid-cols-2 gap-8 text-sm">
                            <div>
                                <p className="font-semibold mb-2">Pour toute information:</p>
                                <p className="text-muted-foreground">
                                    Ministère des Transports et de l'Aviation Civile<br />
                                    Direction Générale des Transports Routiers<br />
                                    BP: 738 Niamey - Niger<br />
                                    Tél: +227 20 72 26 41<br />
                                    Email: contact@transport.ne
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-muted-foreground">
                                    Document généré automatiquement le:<br />
                                    <span className="font-semibold">
                                        {new Date().toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </p>
                                <p className="mt-4 text-xs text-muted-foreground italic">
                                    République du Niger - Fraternité, Travail, Progrès
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RequestDetailsModal;
