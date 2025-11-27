import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Mail, Timer } from "lucide-react";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRateLimited && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isRateLimited && countdown === 0) {
      setIsRateLimited(false);
      setCountdown(60); // Reset for next time
    }
    return () => clearTimeout(timer);
  }, [isRateLimited, countdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.success && response.accessToken && response.user) {
        login(response.accessToken, response.user);
        toast.success("Connexion réussie", {
          description: "Bienvenue dans votre espace.",
        });

        setTimeout(() => {
          if (response.user.role === 'admin') {
            navigate("/mtac-dash-admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 100);
      } else {
        toast.error("Erreur de connexion", {
          description: response.message || "Identifiants incorrects.",
          classNames: {
            title: 'text-red-500',
            description: 'text-red-400',
          },
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        // C'est une erreur de rate limiting, gérée par l'UI du compte à rebours
        setIsRateLimited(true);
      } else {
        // C'est une autre erreur
        toast.error("Erreur de connexion", {
          description: "Identifiants incorrects ou problème serveur.",
          classNames: {
            title: 'text-red-500',
            description: 'text-red-400',
          },
        });
      }
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
                  disabled={isRateLimited}
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
                  disabled={isRateLimited}
                />
              </div>
            </div>

            {isRateLimited ? (
              <div className="flex flex-col items-center justify-center text-center bg-destructive/10 text-destructive p-3 rounded-md">
                <Timer className="h-6 w-6 mb-2" />
                <p className="font-semibold">Trop de tentatives</p>
                <p className="text-sm">Veuillez réessayer dans {countdown} seconde{countdown > 1 ? 's' : ''}.</p>
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
