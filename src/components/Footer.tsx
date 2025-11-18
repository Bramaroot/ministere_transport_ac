import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import logoNiger from "@/assets/logo-niger.jpg";

const Footer = () => {
  const footerLinks = {
    "Le Ministère": [
      { label: "Mot du Ministre", path: "/ministere/mot-ministre" },
      { label: "Organigramme", path: "/about" },
      { label: "Missions", path: "/about" },
      { label: "Directions", path: "/about" },
    ],
    Services: [
      { label: "Appels d'Offres", path: "/actualites/appels-offres" },
      { label: "Permis de Conduire", path: "/transport/permis" },
      { label: "Immatriculation", path: "/transport/immatriculation" },
    ],
    Ressources: [
      { label: "Réglementation", path: "/publications" },
      { label: "Statistiques", path: "/publications" },
      { label: "Rapports Annuels", path: "/publications" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-light mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  <img
                    src={logoNiger}
                    alt="Logo Niger"
                    className="w-12 h-12 object-contain"
                  />
                </span>
              </div>
              <div>
                <div className="font-bold text-lg leading-tight text-primary-foreground">
                  Ministère des Transports
                </div>
                <div className="text-lg font-bold text-primary-foreground/80">
                  et de l'Aviation Civile
                </div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/90 mb-4">
              Œuvrant pour le développement des infrastructures de transport et
              la modernisation du secteur aérien au Niger.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Niamey, République du Niger</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+227 20 72 72 72</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Mail className="w-4 h-4 text-secondary" />
                <span>
                  contact@transports.gouv.ne / info@transports.gouv.ne
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4 text-primary-foreground">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social & Bottom */}
        <div className="border-t border-primary-light/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <div className="p-2 rounded-full text-white bg-secondary/50 cursor-not-allowed opacity-50">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-full text-white bg-secondary/50 cursor-not-allowed opacity-50">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-full text-white bg-secondary/50 cursor-not-allowed opacity-50">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-full text-white bg-secondary/50 cursor-not-allowed opacity-50">
                <Youtube className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/80">
              <Link
                to="/mentions-legales"
                className="hover:text-secondary transition-colors"
              >
                Mentions Légales
              </Link>
              <span>·</span>
              <Link
                to="/politique-confidentialite"
                className="hover:text-secondary transition-colors"
              >
                Politique de Confidentialité
              </Link>
              <span>·</span>
              <Link
                to="/accessibilite"
                className="hover:text-secondary transition-colors"
              >
                Accessibilité
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-primary-foreground/70 mt-6">
            © {new Date().getFullYear()} Ministère des Transports et de
            l'Aviation Civile - République du Niger. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
