import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import PageBanner from "@/components/PageBanner";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Votre message a été envoyé avec succès!");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageBanner
        title="Nous contacter"
        description="Pour tout renseignement complémentaire, n’hésitez pas à nous contacter."
      />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary py-4 text-primary-foreground">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg opacity-90">
              Nous sommes à votre écoute pour toute question ou demande
              d'information
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-4">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">
                  Informations de Contact
                </h2>

                <Card className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Adresse</h3>
                      <p className="text-muted-foreground">
                        Avenue de la République
                        <br />
                        BP 732, Niamey
                        <br />
                        République du Niger
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Téléphone</h3>
                      <p className="text-muted-foreground">
                        +227 20 72 34 56
                        <br />
                        +227 20 72 34 57
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-muted-foreground">
                        contact@transports.gouv.ne
                        <br />
                        info@transports.gouv.ne
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Horaires d'ouverture
                      </h3>
                      <p className="text-muted-foreground">
                        Lundi - Vendredi: 8h00 - 17h00
                        <br />
                      
                        <br />
                        Samedi: Fermé
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Envoyez-nous un message
                </h2>
                <Card className="glass-card p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        required
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="votre.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-2"
                      >
                        Téléphone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+227 XX XX XX XX"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-2"
                      >
                        Sujet *
                      </label>
                      <Input
                        id="subject"
                        required
                        placeholder="Objet de votre message"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        required
                        rows={6}
                        placeholder="Votre message..."
                        className="resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Envoyer le message
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>

     
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
