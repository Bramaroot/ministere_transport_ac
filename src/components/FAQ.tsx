import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
   
    {
      question: "Quels sont les délais pour l'immatriculation d'un véhicule ?",
      answer: "L'immatriculation d'un véhicule prend généralement entre 7 à 14 jours ouvrables après le dépôt d'un dossier complet. Vous devez fournir la carte grise d'origine, un certificat de dédouanement, et une attestation d'assurance valide."
    },
    {
      question: "Comment consulter les appels d'offres du ministère ?",
      answer: "Les appels d'offres sont publiés régulièrement sur notre site web dans la section Actualités > Appels d'Offres. Vous pouvez également vous abonner à notre newsletter pour recevoir les notifications automatiquement."
    },
    {
      question: "Quelles sont les normes de sécurité routière en vigueur ?",
      answer: "Les normes incluent le port obligatoire de la ceinture de sécurité, le respect des limitations de vitesse (50 km/h en ville, 90 km/h hors agglomération), l'interdiction de l'utilisation du téléphone au volant, et le contrôle technique périodique des véhicules."
    },
    {
      question: "Comment signaler un problème d'infrastructure routière ?",
      answer: "Vous pouvez signaler tout problème via notre formulaire de contact en ligne, par téléphone au +227 20 72 XX XX, ou directement auprès de nos directions régionales. Votre signalement sera traité dans les meilleurs délais."
    } 
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4 animate-fade-in">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card rounded-lg px-6 border"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
