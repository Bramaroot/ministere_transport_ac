import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Shield } from "lucide-react";
import AdminLogin2FA from "@/components/AdminLogin2FA";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [use2FA, setUse2FA] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérifier si c'est un admin - faire la vérification des identifiants d'abord
      if (email.includes("@")) {


        const requestBody = JSON.stringify({
          identifiant: email,
          mot_de_passe: password
        });


        // Vérifier les identifiants admin via l'API (utiliser le proxy Vite)
        const response = await fetch('/api/auth/admin/login-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Important pour envoyer les cookies
          body: requestBody
        });



        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          // Identifiants corrects, stocker l'email et passer à la 2FA
          localStorage.setItem('admin_email', email);
          setUse2FA(true);
          setIsLoading(false);
          toast({
            title: "Identifiants corrects",
            description: "Code de vérification envoyé à votre email",
          });
        } else {
          // Identifiants incorrects
          toast({
            title: "Erreur de connexion",
            description: data.message || "Identifiants incorrects",
            variant: "destructive",
          });
          setIsLoading(false);
        }
        return;
      }

      // Simulate authentication pour les utilisateurs normaux
      setTimeout(() => {
        if (email === "user@example.com" && password === "password") {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("token", "user123");
          localStorage.setItem("user", JSON.stringify({
            id: 2,
            nom_utilisateur: "user",
            email: "user@example.com",
            role: "consultant"
          }));
          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans votre espace",
          });
          navigate("/");
        } else {
          toast({
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      });
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
