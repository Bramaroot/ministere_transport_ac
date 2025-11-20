import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Mail, User as UserIcon, Lock, AlertCircle, Loader2, Shield, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProfile, updateProfile, changePassword, Profile } from "@/services/profileService";

const AdminProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour le formulaire de profil
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
  });

  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancien_mot_de_passe: "",
    nouveau_mot_de_passe: "",
    confirmer_mot_de_passe: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();

      if (response.success) {
        setProfile(response.data);
        setFormData({
          nom: response.data.nom || "",
          prenom: response.data.prenom || "",
          email: response.data.email || "",
        });
      } else {
        setError('Erreur lors du chargement du profil');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await updateProfile(formData);

      if (response.success) {
        setProfile(response.data);
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées avec succès.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la mise à jour du profil.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.nouveau_mot_de_passe !== passwordData.confirmer_mot_de_passe) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.nouveau_mot_de_passe.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await changePassword(passwordData);

      if (response.success) {
        toast({
          title: "Mot de passe modifié",
          description: "Votre mot de passe a été modifié avec succès.",
        });
        setPasswordData({
          ancien_mot_de_passe: "",
          nouveau_mot_de_passe: "",
          confirmer_mot_de_passe: "",
        });
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Erreur lors du changement de mot de passe.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du changement de mot de passe.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getUserInitials = () => {
    if (profile?.prenom && profile?.nom) {
      return `${profile.prenom[0]}${profile.nom[0]}`.toUpperCase();
    }
    if (profile?.nom_utilisateur) {
      return profile.nom_utilisateur.substring(0, 2).toUpperCase();
    }
    return "AD";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-30 shadow-sm">
            <div className="container py-4 px-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Mon Profil
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Gérer vos informations personnelles et votre sécurité
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="container max-w-5xl mx-auto space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                  <span className="text-lg">Chargement du profil...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 mb-4 text-lg">{error}</p>
                  <Button onClick={fetchProfile} size="lg">Réessayer</Button>
                </div>
              ) : (
                <>
                  {/* Avatar & Basic Info Card */}
                  <Card className="shadow-lg border-l-4 border-l-primary">
                    <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                          <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/70 text-white font-bold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-2xl flex items-center gap-2">
                            <UserCircle className="w-6 h-6 text-primary" />
                            {profile?.prenom} {profile?.nom}
                          </CardTitle>
                          <CardDescription className="text-base mt-1">
                            {profile?.role || "Administrateur"} • {profile?.email}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Personal Information */}
                  <Card className="shadow-lg">
                    <CardHeader className="border-b bg-muted/30">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-primary" />
                        Informations Personnelles
                      </CardTitle>
                      <CardDescription>
                        Mettez à jour vos informations de base
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="prenom" className="text-base font-semibold">Prénom *</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="prenom"
                              value={formData.prenom}
                              onChange={(e) =>
                                setFormData({ ...formData, prenom: e.target.value })
                              }
                              className="pl-11 h-12 text-base"
                              disabled={saving}
                              placeholder="Votre prénom"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nom" className="text-base font-semibold">Nom *</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="nom"
                              value={formData.nom}
                              onChange={(e) =>
                                setFormData({ ...formData, nom: e.target.value })
                              }
                              className="pl-11 h-12 text-base"
                              disabled={saving}
                              placeholder="Votre nom"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email" className="text-base font-semibold">Adresse Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              className="pl-11 h-12 text-base"
                              disabled={saving}
                              placeholder="votre.email@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button onClick={handleSaveProfile} size="lg" disabled={saving} className="gap-2">
                          {saving ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              Enregistrer les modifications
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security - Change Password */}
                  <Card className="shadow-lg">
                    <CardHeader className="border-b bg-muted/30">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Sécurité du Compte
                      </CardTitle>
                      <CardDescription>
                        Modifiez votre mot de passe pour sécuriser votre compte
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="ancien_mot_de_passe" className="text-base font-semibold">
                            Mot de passe actuel *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="ancien_mot_de_passe"
                              type="password"
                              value={passwordData.ancien_mot_de_passe}
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, ancien_mot_de_passe: e.target.value })
                              }
                              className="pl-11 h-12 text-base"
                              disabled={saving}
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="nouveau_mot_de_passe" className="text-base font-semibold">
                              Nouveau mot de passe *
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="nouveau_mot_de_passe"
                                type="password"
                                value={passwordData.nouveau_mot_de_passe}
                                onChange={(e) =>
                                  setPasswordData({ ...passwordData, nouveau_mot_de_passe: e.target.value })
                                }
                                className="pl-11 h-12 text-base"
                                disabled={saving}
                                placeholder="••••••••"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Minimum 6 caractères
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmer_mot_de_passe" className="text-base font-semibold">
                              Confirmer le mot de passe *
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="confirmer_mot_de_passe"
                                type="password"
                                value={passwordData.confirmer_mot_de_passe}
                                onChange={(e) =>
                                  setPasswordData({ ...passwordData, confirmer_mot_de_passe: e.target.value })
                                }
                                className="pl-11 h-12 text-base"
                                disabled={saving}
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={handleChangePassword}
                            disabled={saving || !passwordData.ancien_mot_de_passe || !passwordData.nouveau_mot_de_passe}
                            size="lg"
                            variant="secondary"
                            className="gap-2"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Modification...
                              </>
                            ) : (
                              <>
                                <Lock className="w-5 h-5" />
                                Modifier le mot de passe
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </main>

          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminProfile;
