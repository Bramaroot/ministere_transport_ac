import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { submitPermisInternational } from '@/services/serviceService';
import PageBanner from '@/components/PageBanner';
import { AxiosError } from 'axios';
import jsPDF from 'jspdf';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const fileSchema = z.any()
  .refine((files: FileList) => files?.length == 1, 'Ce champ est requis.')
  .refine((files: FileList) => files?.[0]?.size <= MAX_FILE_SIZE, `La taille max est de 10MB.`)
  .refine(
    (files: FileList) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
    "Formats acceptés: .pdf, .jpg, .png"
  );

const photosSchema = z.any()
  .refine((files: FileList) => files?.length > 0, 'Au moins une photo est requise.')
  .refine((files: FileList) => files?.length <= 2, 'Deux photos maximum.')
  .refine((files: FileList) => Array.from(files).every((file: File) => file.size <= MAX_FILE_SIZE), `La taille max par photo est de 10MB.`)
  .refine(
    (files: FileList) => Array.from(files).every((file: File) => ACCEPTED_FILE_TYPES.includes(file.type)),
    "Formats acceptés: .jpg, .png"
  );

const formSchema = z.object({
  nom: z.string().min(2, { message: 'Le nom est requis.' }),
  prenom: z.string().min(2, { message: 'Le prénom est requis.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }).optional().or(z.literal('')),
  telephone: z.string().optional(),
  demande_manuscrite: fileSchema,
  copie_permis_national: fileSchema,
  copie_ancien_permis: fileSchema.optional(),
  photos_identite: photosSchema,
});

const DemandePermisInternational: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ success: boolean; message: string; codeSuivi?: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
    },
  });

  const handleDownloadPdf = () => {
    if (submissionStatus?.codeSuivi) {
      const doc = new jsPDF();
      doc.text("Récépissé de demande de Permis de Conduire International", 20, 20);
      doc.text(`Code de suivi : ${submissionStatus.codeSuivi}`, 20, 30);
      doc.save(`recepisse_${submissionStatus.codeSuivi}.pdf`);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSubmissionStatus(null);

    const formData = new FormData();
    formData.append('nom', values.nom);
    formData.append('prenom', values.prenom);
    if (values.email) formData.append('email', values.email);
    if (values.telephone) formData.append('telephone', values.telephone);

    formData.append('demande_manuscrite', values.demande_manuscrite[0]);
    formData.append('copie_permis_national', values.copie_permis_national[0]);
    if (values.copie_ancien_permis && values.copie_ancien_permis.length > 0) {
      formData.append('copie_ancien_permis', values.copie_ancien_permis[0]);
    }
    for (let i = 0; i < values.photos_identite.length; i++) {
      formData.append('photos_identite', values.photos_identite[i]);
    }

    try {
      const result = await submitPermisInternational(formData);
      setSubmissionStatus({ success: true, message: 'Votre demande a été soumise avec succès!', codeSuivi: result.codeSuivi });
      form.reset();
    } catch (error: AxiosError) {
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la soumission.";
      setSubmissionStatus({ success: false, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (submissionStatus?.success) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Demande Soumise avec Succès</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Votre demande de permis de conduire international a bien été enregistrée.</p>
            <p className="mb-2">Veuillez conserver précieusement votre code de suivi :</p>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-2xl font-bold tracking-wider">{submissionStatus.codeSuivi}</p>
            </div>
            <p className="mt-4 text-sm text-gray-600">Vous pourrez utiliser ce code sur la page "Suivi de demande" pour connaître l'état d'avancement de votre dossier.</p>
            <Button onClick={handleDownloadPdf} className="mt-6 mr-2">Télécharger le Récépissé</Button>
            <Button onClick={() => setSubmissionStatus(null)} className="mt-6">Faire une autre demande</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageBanner title="Demande de Permis de Conduire International" description="Remplissez les informations ci-dessous et joignez les documents requis." />
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Formulaire de demande</CardTitle>
            <CardDescription>Remplissez les informations ci-dessous et joignez les documents requis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="nom" render={({ field }) => (
                    <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Votre nom de famille" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="prenom" render={({ field }) => (
                    <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input placeholder="Votre prénom" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email (Optionnel)</FormLabel><FormControl><Input placeholder="votre.email@exemple.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="telephone" render={({ field }) => (
                    <FormItem><FormLabel>Téléphone (Optionnel)</FormLabel><FormControl><Input placeholder="+227 12 34 56 78" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Documents à joindre</h3>
                  <FormField control={form.control} name="demande_manuscrite" render={({ field }) => (
                    <FormItem><FormLabel>Demande manuscrite</FormLabel><FormControl><Input type="file" {...form.register('demande_manuscrite')} /></FormControl><FormMessage /></FormItem>
                  )} />
                  
                  <FormField control={form.control} name="copie_permis_national" render={({ field }) => (
                    <FormItem><FormLabel>Copie légalisée du permis national</FormLabel><FormControl><Input type="file" {...form.register('copie_permis_national')} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="copie_ancien_permis" render={({ field }) => (
                    <FormItem><FormLabel>Copie légalisée de l’ancien permis international (Optionnel)</FormLabel><FormControl><Input type="file" {...form.register('copie_ancien_permis')} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="photos_identite" render={({ field }) => (
                    <FormItem><FormLabel>Deux photos d’identité</FormLabel><FormControl><Input type="file" multiple {...form.register('photos_identite')} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {submissionStatus && !submissionStatus.success && (
                  <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">
                    {submissionStatus.message}
                  </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Soumission en cours...' : 'Soumettre la demande'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DemandePermisInternational;
