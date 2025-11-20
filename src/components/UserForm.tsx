import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Lock, Shield, Loader2 } from "lucide-react";
import { User } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

const userRoles = [
  { value: 'admin', label: 'Admin' },
  { value: 'editeur', label: 'Éditeur' },
  { value: 'consultant', label: 'Consultant' }
];

export const UserForm = ({ user, onSubmit, onClose, isOpen }: UserFormProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'consultant',
    actif: true,
  });

  const isEditing = !!user;

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        mot_de_passe: '', // Ne pas pré-remplir le mot de passe
        role: user.role || 'consultant',
        actif: user.actif,
      });
    } else if (isOpen && !user) {
      // Reset for new user
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        mot_de_passe: '',
        role: 'consultant',
        actif: true,
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSubmit = { ...formData };
      if (isEditing && !dataToSubmit.mot_de_passe) {
        delete (dataToSubmit as any).mot_de_passe;
      }
      await onSubmit(dataToSubmit);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
            {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les informations de l\'utilisateur ci-dessous.' : 'Créez un nouvel utilisateur en remplissant le formulaire ci-dessous.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" />
              Informations personnelles
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-base font-semibold">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  required
                  className="h-11"
                  placeholder="Prénom de l'utilisateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom" className="text-base font-semibold">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                  className="h-11"
                  placeholder="Nom de l'utilisateur"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-base font-semibold">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="h-11"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Section Authentification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Authentification
            </h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="mot_de_passe" className="text-base font-semibold">
                Mot de passe {isEditing ? '' : '*'}
              </Label>
              <Input
                id="mot_de_passe"
                type="password"
                value={formData.mot_de_passe}
                onChange={(e) => handleChange('mot_de_passe', e.target.value)}
                required={!isEditing}
                className="h-11"
                placeholder={isEditing ? "Laisser vide pour ne pas changer" : "Minimum 6 caractères"}
              />
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  Laisser vide pour conserver le mot de passe actuel
                </p>
              )}
            </div>
          </div>

          {/* Section Paramètres du compte */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Paramètres du compte
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base font-semibold">Rôle *</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3 pt-8">
                <Switch
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => handleChange('actif', checked)}
                />
                <Label htmlFor="actif" className="text-base font-semibold cursor-pointer">
                  Compte actif
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  {isEditing ? 'Modifier' : 'Créer'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
