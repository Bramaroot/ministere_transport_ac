import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PageBanner from '@/components/PageBanner';
import { getPermisInternationalStatus } from '@/services/serviceService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AxiosError } from 'axios';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  codeSuivi: z.string().min(1, { message: 'Le code de suivi est requis.' }).length(19, { message: 'Le code de suivi doit contenir 19 caractères (ex: xxxx-xxxx-xxxx-xxxx).' }),
});

const SuiviDemande: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<{ status: string; created_at: string; updated_at: string; description?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeSuivi: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setStatusResult(null);
    setError(null);

    try {
      const result = await getPermisInternationalStatus(values.codeSuivi);
      setStatusResult(result);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || "Une erreur est survenue lors de la récupération du statut.";
        setError(errorMessage);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approuvee':
        return {
          containerClasses: 'bg-green-50 border-green-200',
          textClasses: 'text-green-800',
          label: 'Approuvée'
        };
      case 'rejetee':
        return {
          containerClasses: 'bg-red-50 border-red-200',
          textClasses: 'text-red-800',
          label: 'Rejetée'
        };
      case 'en_cours_de_traitement':
        return {
          containerClasses: 'bg-white border-gray-300',
          textClasses: 'text-blue-800',
          label: 'En cours de traitement'
        };
      case 'en_attente':
        return {
          containerClasses: 'bg-orange-50 border-orange-200',
          textClasses: 'text-orange-800',
          label: 'En attente de traitement'
        };
      default:
        return {
          containerClasses: 'bg-gray-100 border-gray-200',
          textClasses: 'text-gray-800',
          label: status
        };
    }
  };
  
  const statusInfo = statusResult ? getStatusInfo(statusResult.status) : null;

  return (
    <>
      <PageBanner title="Suivi de Demande" />
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Suivre l'état de votre demande</CardTitle>
            <CardDescription>Entrez votre code de suivi pour consulter le statut de votre dossier de permis international.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="codeSuivi" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code de suivi</FormLabel>
                    <FormControl>
                      <Input placeholder="xxxx-xxxx-xxxx-xxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recherche en cours...</> : 'Rechercher le statut'}
                </Button>
              </form>
            </Form>

            {error && (
              <div className="text-red-600 text-center p-4 bg-red-50 border border-red-200 rounded-md mt-6">
                {error}
              </div>
            )}

            {statusResult && statusInfo && (
              <div className={cn("mt-6 p-6 border rounded-lg", statusInfo.containerClasses)}>
                <h4 className="text-lg font-semibold mb-3">Statut de votre demande :</h4>
                <p className="mb-2"><strong>Statut actuel :</strong> <span className={cn("font-bold", statusInfo.textClasses)}>{statusInfo.label}</span></p>
                
                {statusResult.status === 'rejetee' && statusResult.description && (
                  <p className="mb-2 text-sm text-red-700">
                    <strong>Motif de rejet :</strong> {statusResult.description}
                  </p>
                )}

                <p className="mb-2 text-sm"><strong>Date de soumission :</strong> {format(new Date(statusResult.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p className="text-sm"><strong>Dernière mise à jour :</strong> {format(new Date(statusResult.updated_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SuiviDemande;
