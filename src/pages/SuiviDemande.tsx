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
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  codeSuivi: z.string().min(1, { message: 'Le code de suivi est requis.' }).length(19, { message: 'Le code de suivi doit contenir 16 caractères (ex: xxxx-xxxx-xxxx-xxxx).' }),
});

const SuiviDemande: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<{ status: string; created_at: string; updated_at: string } | null>(null);
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
    } catch (err: AxiosError) {
      const errorMessage = err.response?.data?.message || "Une erreur est survenue lors de la récupération du statut.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
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
                  {isLoading ? 'Recherche en cours...' : 'Rechercher le statut'}
                </Button>
              </form>
            </Form>

            {isLoading && <p className="text-center mt-4">Chargement...</p>}

            {error && (
              <div className="text-red-500 text-center p-4 bg-red-100 rounded-md mt-6">
                {error}
              </div>
            )}

            {statusResult && (
              <div className="mt-6 p-6 border rounded-md bg-green-50">
                <h4 className="text-lg font-semibold mb-3">Statut de votre demande :</h4>
                <p className="mb-2"><strong>Statut actuel :</strong> <span className="font-bold text-green-700">{statusResult.status}</span></p>
                <p className="mb-2"><strong>Date de soumission :</strong> {format(new Date(statusResult.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p><strong>Dernière mise à jour :</strong> {format(new Date(statusResult.updated_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default SuiviDemande;
