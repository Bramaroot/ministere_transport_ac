import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, Shield, ArrowLeft, Clock } from 'lucide-react';

interface OTPData {
  email: string;
  code: string;
}

export default function AdminLogin2FA() {
  const [otpData, setOtpData] = useState<OTPData>({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes par défaut
  const navigate = useNavigate();

  // Timer pour l'expiration de l'OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Récupérer l'email depuis le localStorage ou utiliser un email par défaut
  useEffect(() => {
    const userEmail = localStorage.getItem('admin_email') || 'ibrahimking719@gmail.com';
    setOtpData(prev => ({ ...prev, email: userEmail }));
  }, []);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');



    try {
      const requestBody = JSON.stringify(otpData);

      const response = await fetch('/api/auth/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour recevoir et envoyer les cookies
        body: requestBody
      });


      if (!response.ok) {
        const errorText = await response.text();
        //nsole.error('❌ Contenu de l\'erreur:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log('📥 Réponse reçue:', data);

      if (data.success) {
        // console.log('✅ Vérification réussie');
        // console.log('🔑 Access Token reçu:', data.accessToken);
        // console.log('👤 Utilisateur:', data.user);

        // Utiliser le nouveau système avec accessToken
        if (data.accessToken) {
          // Import setAccessToken from api.ts to set the access token in memory
          const { setAccessToken } = await import('../api');
          setAccessToken(data.accessToken);
        }

        // Garder aussi le token legacy pour compatibilité
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');

        //console.log('💾 Données stockées dans localStorage');
        navigate('/admin');
      } else {
        // console.error('❌ Échec de la vérification:', data.message);
        setError(data.message);
      }
    } catch (error) {
      //console.error('💥 Erreur lors de la vérification:', error);
      if (error instanceof Error) {
        // console.error('💥 Message d\'erreur:', error.message);
        // console.error('💥 Stack trace:', error.stack);
      }
      setError('Erreur de vérification: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    // console.log('🔄 Début du renvoi OTP');
    // console.log('📧 Email pour renvoi:', otpData.email);

    setLoading(true);
    setError('');

    try {
      const requestBody = JSON.stringify({ email: otpData.email });
      // console.log('📤 Données de renvoi:', requestBody);
      // console.log('🌐 URL de renvoi:', 'http://localhost:3001/api/auth/admin/resend-otp');

      const response = await fetch('/api/auth/admin/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour envoyer les cookies
        body: requestBody
      });

      // console.log('📡 Statut de la réponse (renvoi):', response.status);
      // console.log('📡 Headers de la réponse (renvoi):', response.headers);

      if (!response.ok) {
        // console.error('❌ Erreur HTTP (renvoi):', response.status, response.statusText);
        const errorText = await response.text();
        // console.error('❌ Contenu de l\'erreur (renvoi):', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log('📥 Réponse de renvoi reçue:', data);

      if (data.success) {
        // console.log('✅ Renvoi réussi');
        setTimeLeft(300);
        setSuccess('Nouveau code envoyé');
      } else {
        // console.error('❌ Échec du renvoi:', data.message);
        setError(data.message);
      }
    } catch (error) {
      // console.error('💥 Erreur lors du renvoi:', error);
      if (error instanceof Error) {
        // console.error('💥 Message d\'erreur (renvoi):', error.message);
        // console.error('💥 Stack trace (renvoi):', error.stack);
      }
      setError('Erreur lors du renvoi: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <img src="logo-niger.jpg" alt="logo" className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Vérification du Code</CardTitle>
          <CardDescription>
            Entrez le code de vérification reçu par email
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center mb-4">
              <Mail className="mx-auto h-12 w-12 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">
                Un code de vérification a été envoyé à
              </p>
              <p className="font-medium text-gray-900">{otpData.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code de vérification
              </label>
              <Input
                type="text"
                placeholder="123456"
                value={otpData.code}
                onChange={(e) => setOtpData(prev => ({ ...prev, code: e.target.value }))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            {timeLeft > 0 && (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="mr-1 h-4 w-4" />
                Code expire dans {formatTime(timeLeft)}
              </div>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                disabled={loading || timeLeft === 0}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  'Vérifier le code'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Renvoyer le code'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}