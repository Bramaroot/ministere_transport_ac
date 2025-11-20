import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    XCircle,
    Clock,
    FileCheck,
    AlertCircle,
    Check,
    X as XIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: any;
    onStatusChange: (requestId: number, newStatus: string, comment: string) => void;
}

const TreatmentModal = ({ isOpen, onClose, request, onStatusChange }: TreatmentModalProps) => {
    const [comment, setComment] = useState("");
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const { toast } = useToast();

    console.log("TreatmentModal rendu - isOpen:", isOpen, "request:", request);

    const handleSubmit = async () => {
        if (!selectedAction) {
            toast({
                title: "Action requise",
                description: "Veuillez sélectionner une action (Approuver, Rejeter, ou Traiter)",
                variant: "destructive",
            });
            return;
        }

        if (selectedAction === "rejetee" && !comment.trim()) {
            toast({
                title: "Commentaire requis",
                description: "Veuillez fournir un motif de rejet",
                variant: "destructive",
            });
            return;
        }

        try {
            await onStatusChange(request.id, selectedAction, comment);

            setComment("");
            setSelectedAction(null);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
        }
    };

    const actions = [
        {
            id: "approuvee",
            label: "Approuver",
            icon: CheckCircle2,
            color: "bg-green-100 hover:bg-green-200 text-green-700 border-green-300",
            activeColor: "bg-green-500 text-white border-green-600",
            description: "Approuver la demande de permis international"
        },
        {
            id: "traitee",
            label: "Marquer comme traité",
            icon: FileCheck,
            color: "bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300",
            activeColor: "bg-blue-500 text-white border-blue-600",
            description: "La demande a été traitée"
        },
        {
            id: "rejetee",
            label: "Rejeter",
            icon: XCircle,
            color: "bg-red-100 hover:bg-red-200 text-red-700 border-red-300",
            activeColor: "bg-red-500 text-white border-red-600",
            description: "Rejeter la demande (motif requis)"
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <span>Traiter la demande</span>
                            <p className="text-sm font-normal text-muted-foreground mt-1">
                                Dossier: {request?.reference}
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informations du demandeur */}
                    <div className="p-4 bg-muted/30 rounded-lg border">
                        <h3 className="font-semibold mb-2">Demandeur</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><span className="text-muted-foreground">Nom:</span> {request?.demandeur_details?.nom_complet}</p>
                            <p><span className="text-muted-foreground">Téléphone:</span> {request?.demandeur_details?.telephone}</p>
                            <p><span className="text-muted-foreground">Email:</span> {request?.demandeur_details?.email}</p>
                            <p><span className="text-muted-foreground">Permis:</span> {request?.permis_details?.numero_permis}</p>
                        </div>
                    </div>

                    {/* Statut actuel */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Statut actuel:</span>
                        <Badge variant="outline" className={
                            request?.statut === "en_attente" ? "bg-orange-100 text-orange-700 border-orange-300" :
                            request?.statut === "traitee" ? "bg-blue-100 text-blue-700 border-blue-300" :
                            request?.statut === "rejetee" ? "bg-red-100 text-red-700 border-red-300" :
                            "bg-green-100 text-green-700 border-green-300"
                        }>
                            {request?.statut === "en_attente" && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                            {request?.statut === "traitee" && <FileCheck className="w-3.5 h-3.5 mr-1.5" />}
                            {request?.statut === "rejetee" && <XCircle className="w-3.5 h-3.5 mr-1.5" />}
                            {request?.statut === "approuvee" && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                            {request?.statut === "en_attente" ? "En attente" :
                             request?.statut === "traitee" ? "Traité" :
                             request?.statut === "rejetee" ? "Rejeté" :
                             "Approuvé"}
                        </Badge>
                    </div>

                    {/* Actions disponibles */}
                    <div>
                        <Label className="text-base font-semibold mb-3 block">
                            Choisir une action
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                            {actions.map((action) => (
                                <button
                                    key={action.id}
                                    type="button"
                                    onClick={() => setSelectedAction(action.id)}
                                    className={`
                                        flex items-start gap-4 p-4 rounded-lg border-2 transition-all
                                        ${selectedAction === action.id ? action.activeColor : action.color}
                                    `}
                                >
                                    <action.icon className="w-6 h-6 mt-0.5 shrink-0" />
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold mb-1">{action.label}</p>
                                        <p className="text-sm opacity-90">{action.description}</p>
                                    </div>
                                    {selectedAction === action.id && (
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Commentaire */}
                    <div>
                        <Label htmlFor="comment" className="text-base font-semibold mb-2 block">
                            Commentaire {selectedAction === "rejetee" && (
                                <span className="text-red-500">*</span>
                            )}
                        </Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={
                                selectedAction === "rejetee"
                                    ? "Indiquez le motif du rejet..."
                                    : "Ajoutez un commentaire ou des notes (optionnel)..."
                            }
                            rows={4}
                            className="resize-none"
                        />
                        {selectedAction === "rejetee" && (
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Le motif du rejet sera communiqué au demandeur
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setComment("");
                            setSelectedAction(null);
                            onClose();
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedAction}
                        className={
                            selectedAction === "approuvee" ? "bg-green-600 hover:bg-green-700" :
                            selectedAction === "rejetee" ? "bg-red-600 hover:bg-red-700" :
                            "bg-blue-600 hover:bg-blue-700"
                        }
                    >
                        {selectedAction === "approuvee" && <Check className="w-4 h-4 mr-2" />}
                        {selectedAction === "rejetee" && <XIcon className="w-4 h-4 mr-2" />}
                        {selectedAction === "traitee" && <FileCheck className="w-4 h-4 mr-2" />}
                        {selectedAction === "approuvee" ? "Approuver la demande" :
                         selectedAction === "rejetee" ? "Rejeter la demande" :
                         selectedAction === "traitee" ? "Marquer comme traité" :
                         "Valider"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TreatmentModal;
