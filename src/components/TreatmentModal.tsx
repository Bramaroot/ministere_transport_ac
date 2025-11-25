import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertCircle,
    Check,
    Clock,
    FileCheck,
    Loader2,
    X as XIcon
} from "lucide-react";
import { toast } from "sonner";

interface TreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: any;
    onStatusChange: (requestId: number, newStatus: string, comment: string) => void;
}

const statusOptions = [
    { value: "approuvee", label: "Approuver" },
    { value: "en_cours_de_traitement", label: "Marquer comme traité" },
    { value: "rejetee", label: "Rejeter" }
];

const TreatmentModal = ({ isOpen, onClose, request, onStatusChange }: TreatmentModalProps) => {
    const [comment, setComment] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setComment("");
            setSelectedStatus("");
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!selectedStatus) {
            toast.error("Action requise", {
                description: "Veuillez sélectionner un nouveau statut.",
            });
            return;
        }

        if (selectedStatus === "rejetee" && !comment.trim()) {
            toast.error("Commentaire requis", {
                description: "Veuillez fournir un motif de rejet.",
            });
            return;
        }

        setIsSaving(true);
        try {
            await onStatusChange(request.id, selectedStatus, comment);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
            toast.error("Erreur", {
                description: "La mise à jour du statut a échoué.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <Clock className="w-6 h-6 text-primary" />
                        Traiter la demande
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Dossier: <span className="font-mono">{request?.reference}</span> | Demandeur: {request?.demandeur_details?.nom_complet}
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="status" className="font-semibold">Nouveau statut *</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Sélectionner une action..." />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="comment" className="font-semibold">
                            Commentaire / Motif {selectedStatus === "rejetee" && <span className="text-red-500">*</span>}
                        </Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={
                                selectedStatus === "rejetee"
                                    ? "Indiquez le motif du rejet..."
                                    : "Ajoutez une note interne (optionnel)..."
                            }
                            rows={4}
                        />
                        {selectedStatus === "rejetee" && (
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Ce motif sera communiqué au demandeur.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving || !selectedStatus}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                        Enregistrer le statut
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TreatmentModal;
