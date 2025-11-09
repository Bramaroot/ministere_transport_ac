import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

interface DocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceTitle: string;
    documents: string[];
}

const DocumentsModal = ({ isOpen, onClose, serviceTitle, documents }: DocumentsModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Documents requis - {serviceTitle}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Liste des documents à fournir :</h3>
                        <p className="text-sm text-blue-700">
                            Rassemblez tous les documents ci-dessous et présentez-vous au service compétent
                            avec les originaux et les copies légalisées.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {documents.map((doc, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                    {index + 1}
                                </div>
                                <span className="text-sm text-gray-700 leading-relaxed">{doc}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">Important :</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Tous les documents doivent être légalisés</li>
                            <li>• Les photos doivent être récentes (moins de 6 mois)</li>
                            <li>• Les frais doivent être payés selon les modalités indiquées</li>
                            <li>• Présentez-vous avec les originaux et les copies</li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={onClose} variant="outline">
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentsModal;
