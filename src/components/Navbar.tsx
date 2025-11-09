import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoNiger from "@/assets/logo-niger.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      title: "Accueil",
      path: "/",
    },
    {
      title: "À Propos",
      path: "/about",
      submenu: [
        { title: "Organigramme", path: "/about/organigramme" },
        { title: "Message du Ministre", path: "/about/message-ministre" },
        { title: "Missions", path: "/about/missions" },
        { title: "Directions", path: "/about/directions" }
      ],
    },
    {
      title: "Actualités",
      path: "/actualites",
      submenu: [
        { title: "Communications", path: "/actualites/communications" },
        { title: "Appels d'Offres", path: "/actualites/appels-offres" },
        { title: "Événements", path: "/evenements" }
      ],
    },
     
    {
      title: "Projets",
      path: "/projets",
      submenu: [
        { title: "Transport Terrestre", path: "/projets/transport-terrestre" },
        { title: "Aviation Civile", path: "/projets/aviation-civile" }
      ],
    },

    // {
    //   title: "Publications",
    //   path: "/publications",
    //   submenu: [
    //     { title: "Rapports Annuels", path: "/publications/rapports-annuels" },
    //     { title: "Statistiques", path: "/publications/statistiques" },
    //     { title: "Guides et Procédures", path: "/publications/guides-procedures" },
    //     { title: "Études et Recherches", path: "/publications/etudes-recherches" }
    //   ],
    // },
    {
      title: "E-services",
      path: "/e-services",
      submenu: [
        { title: "Aviation Civile", path: "/e-services", submenu: [
          { title: "Site ANAC", path: "https://anac-niger.org", external: true }
        ]},
        { title: "Permis & Documents", path: "/e-services", submenu: [
          { title: "Permis International", path: "/e-services/permis-international" },
          { title: "Carte Grise Internationale", path: "/e-services/carte-grise-internationale" },
          { title: "Permis de Conduire", path: "/e-services/permis-conduire" }
        ]},
        { title: "Homologation", path: "/e-services", submenu: [
          { title: "Homologation Simple", path: "/e-services/demande-homologation-simple" },
          { title: "Transformation Véhicule", path: "/e-services/demande-transformation-vehicule" },
          { title: "Homologation Véhicule", path: "/e-services/homologation-vehicule" }
        ]},
        { title: "Autorisations Transport", path: "/e-services", submenu: [
          { title: "Permis Exploitation Ligne", path: "/e-services/permis-exploitation-ligne-transport" },
          { title: "Transport Marchandises", path: "/e-services/autorisation-transport-marchandises" },
          { title: "Transport Personnes", path: "/e-services/autorisation-transport-personnes" }
        ]},
        { title: "Services Spécialisés", path: "/e-services", submenu: [
          { title: "Produits Stratégiques", path: "/e-services/agrement-transport-produits-strategiques" },
          { title: "Mise en Gage Véhicule", path: "/e-services/mise-en-gage-vehicule" }
        ]}
      ],
    },
    {
      title: "Suivi de Demande",
      path: "/suivi-demande",
    },
    { title: "Contact", path: "/contact" },  ];

  return (
    <>
      {/* Government Banner */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
        <div className="container flex items-center justify-center gap-2">
          <span>République du Niger</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Fraternité · Travail · Progrès</span>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-white"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={logoNiger}
                alt="Logo Niger"
                className="w-12 h-12 object-contain"
              />
              <div className="hidden md:block">
                <div
                  className={`font-bold text-sm leading-tight transition-colors ${
                    isScrolled ? "text-white" : "text-[#FF8C00]"
                  }`}
                >
                  Ministère des Transports
                </div>
                <div
                  className={`text-sm leading-tight font-bold transition-colors ${
                    isScrolled ? "text-white/80" : "text-[#00A651]"
                  }`}
                >
                  et de l'Aviation Civile
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() =>
                    item.submenu && setActiveDropdown(item.title)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      isScrolled
                        ? "hover:bg-white/20 text-white"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {item.title}
                    {item.submenu && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {item.submenu && activeDropdown === item.title && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-lg rounded-lg p-2 animate-fade-in z-50">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  const searchInput = prompt("Rechercher dans les services du Ministère:");
                  if (searchInput) {
                    window.location.href = `/search?q=${encodeURIComponent(
                      searchInput
                    )}`;
                  }
                }}
              >
                <Search className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t animate-slide-up max-h-[calc(100vh-8rem)] overflow-y-auto">
            <nav className="container py-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.title}>
                  <Link
                    to={item.path}
                    className="block px-4 py-3 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent/50 hover:text-accent-foreground transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
