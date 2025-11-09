import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { User } from "@/services/userService";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (isEditing && !dataToSubmit.mot_de_passe) {
      delete (dataToSubmit as any).mot_de_passe;
    }
    onSubmit(dataToSubmit);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mot_de_passe">
                Mot de passe {isEditing ? '(laisser vide pour ne pas changer)' : '*'}
              </Label>
              <Input
                id="mot_de_passe"
                type="password"
                value={formData.mot_de_passe}
                onChange={(e) => handleChange('mot_de_passe', e.target.value)}
                required={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger>
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
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => handleChange('actif', checked)}
                />
                <Label htmlFor="actif">Actif</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
