import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Shield } from "lucide-react";
import AdminLogin2FA from "@/components/AdminLogin2FA";
import { authService } from "@/services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [use2FA, setUse2FA] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Déterminer si c'est un admin (email avec @)
      const isAdmin = email.includes("@");

      if (isAdmin) {
        // Flux 2FA pour les admins
        const response = await fetch('/api/auth/admin/login-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            identifiant: email,
            mot_de_passe: password
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          // Identifiants corrects, stocker temporairement l'email pour la 2FA
          localStorage.setItem('admin_email', email);
          setUse2FA(true);
          toast({
            title: "Identifiants corrects",
            description: "Code de vérification envoyé à votre email",
          });
        } else {
          toast({
            title: "Erreur de connexion",
            description: data.message || "Identifiants incorrects",
            variant: "destructive",
          });
        }
      } else {
        // Flux standard pour les utilisateurs normaux (sans 2FA)
        const response = await authService.login(email, password);

        if (response.success && response.accessToken && response.user) {
          // Mettre à jour le contexte d'authentification
          login(response.accessToken, response.user);

          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans votre espace",
          });

          // Rediriger selon le rôle
          if (response.user.role === 'admin') {
            navigate("/mtac-dash-admin");
          } else {
            navigate("/");
          }
        } else {
          toast({
            title: "Erreur de connexion",
            description: response.message || "Identifiants incorrects",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Impossible de se connecter au serveur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si 2FA est activé, afficher le composant 2FA
  if (use2FA) {
    return <AdminLogin2FA />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md glass-card animate-scale-in">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/logo-niger.jpg" alt="logo" />
          </div>
          <CardTitle className="text-2xl">Espace Administrateur</CardTitle>
          <CardDescription>
            Ministère des Transports et de l'Aviation Civile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@transports.gouv.ne"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            <div className="text-sm text-center text-muted-foreground">

              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                <div className="flex items-center text-blue-800 text-xs">
                  <Shield className="mr-1 h-3 w-3" />
                  Les administrateurs utilisent l'authentification à deux facteurs
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
