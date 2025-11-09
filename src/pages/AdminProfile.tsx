import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Save, Mail, Phone, MapPin, User as UserIcon, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProfile, updateProfile, changePassword, uploadAvatar, Profile } from "@/services/profileService";

const AdminProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  // États pour le formulaire de profil
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    bio: "",
  });

  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancien_mot_de_passe: "",
    nouveau_mot_de_passe: "",
    confirmer_mot_de_passe: "",
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, [navigate]);

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
          telephone: response.data.telephone || "",
          adresse: response.data.adresse || "",
          bio: response.data.bio || "",
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setSaving(true);
        const response = await uploadAvatar(file);
        
        if (response.success) {
          setProfile(prev => prev ? { ...prev, avatar: response.data.avatar_url } : null);
          toast({
            title: "Avatar mis à jour",
            description: "Votre photo de profil a été mise à jour.",
          });
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'avatar:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de l'upload de l'avatar.",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <main className="flex-1 bg-muted/30">
            <div className="glass-card border-b sticky top-0 z-40 mb-8">
              <div className="container py-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-xl font-bold">Mon Profil</h1>
                    <p className="text-sm text-muted-foreground">
                      Gérer vos informations personnelles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="container py-8 max-w-4xl">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">Chargement du profil...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={fetchProfile}>Réessayer</Button>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-6">
                    {/* Avatar Section - Masquée car la colonne avatar n'existe pas encore */}
                    {false && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Photo de Profil</CardTitle>
                          <CardDescription>
                            Ajoutez ou modifiez votre photo de profil
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-6">
                            <Avatar className="w-24 h-24">
                              <AvatarImage src={profile?.avatar} />
                              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                {profile?.prenom?.[0] || profile?.nom_utilisateur?.[0] || 'A'}
                                {profile?.nom?.[0] || profile?.nom_utilisateur?.[1] || 'D'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Label
                                htmlFor="avatar-upload"
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                  <Camera className="w-4 h-4" />
                                  <span>Changer la photo</span>
                                </div>
                                <Input
                                  id="avatar-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleAvatarChange}
                                  disabled={saving}
                                />
                              </Label>
                              <p className="text-sm text-muted-foreground mt-2">
                                JPG, PNG ou GIF. Maximum 2MB.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Informations Personnelles</CardTitle>
                        <CardDescription>
                          Mettez à jour vos informations de base
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="prenom">Prénom</Label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="prenom"
                                value={formData.prenom}
                                onChange={(e) =>
                                  setFormData({ ...formData, prenom: e.target.value })
                                }
                                className="pl-9"
                                disabled={saving}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nom">Nom</Label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="nom"
                                value={formData.nom}
                                onChange={(e) =>
                                  setFormData({ ...formData, nom: e.target.value })
                                }
                                className="pl-9"
                                disabled={saving}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              className="pl-9"
                              disabled={saving}
                            />
                          </div>
                        </div>

                        {/* Champs masqués car les colonnes n'existent pas encore dans la base de données */}
                        {false && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="telephone">Téléphone</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  id="telephone"
                                  type="tel"
                                  value={formData.telephone}
                                  onChange={(e) =>
                                    setFormData({ ...formData, telephone: e.target.value })
                                  }
                                  className="pl-9"
                                  disabled={saving}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="adresse">Adresse</Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                  id="adresse"
                                  value={formData.adresse}
                                  onChange={(e) =>
                                    setFormData({ ...formData, adresse: e.target.value })
                                  }
                                  className="pl-9"
                                  disabled={saving}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="bio">Biographie</Label>
                              <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) =>
                                  setFormData({ ...formData, bio: e.target.value })
                                }
                                rows={4}
                                placeholder="Parlez-nous de vous..."
                                disabled={saving}
                              />
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} size="lg" disabled={saving}>
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6">
                    {/* Change Password */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Changer le mot de passe
                        </CardTitle>
                        <CardDescription>
                          Modifiez votre mot de passe pour sécuriser votre compte
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ancien_mot_de_passe">Mot de passe actuel</Label>
                          <Input
                            id="ancien_mot_de_passe"
                            type="password"
                            value={passwordData.ancien_mot_de_passe}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, ancien_mot_de_passe: e.target.value })
                            }
                            disabled={saving}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nouveau_mot_de_passe">Nouveau mot de passe</Label>
                          <Input
                            id="nouveau_mot_de_passe"
                            type="password"
                            value={passwordData.nouveau_mot_de_passe}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, nouveau_mot_de_passe: e.target.value })
                            }
                            disabled={saving}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmer_mot_de_passe">Confirmer le nouveau mot de passe</Label>
                          <Input
                            id="confirmer_mot_de_passe"
                            type="password"
                            value={passwordData.confirmer_mot_de_passe}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, confirmer_mot_de_passe: e.target.value })
                            }
                            disabled={saving}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={handleChangePassword} disabled={saving}>
                            {saving ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Lock className="w-4 h-4 mr-2" />
                            )}
                            {saving ? 'Modification...' : 'Modifier le mot de passe'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
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
