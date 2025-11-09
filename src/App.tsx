import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Tenders from "./pages/Tenders";
import TenderDetail from "./pages/TenderDetail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminNews from "./pages/AdminNews";
import AdminTenders from "./pages/admin/AdminTenders";
import AdminUsers from "./pages/AdminUsers";

import AdminProfile from "./pages/AdminProfile";
import AdminProjects from "./pages/admin/AdminProjects";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import EServices from "./pages/EServices";
import PermisInternational from "./pages/PermisInternational";
import HomologationVehicule from "./pages/HomologationVehicule";
import PermisConduire from "./pages/PermisConduire";
import CarteGriseInternationale from "./pages/CarteGriseInternationale";
import DemandeHomologationSimple from "./pages/DemandeHomologationSimple";
import DemandeTransformationVehicule from "./pages/DemandeTransformationVehicule";
import AutorisationTransportMarchandises from "./pages/AutorisationTransportMarchandises";
import MiseEnGageVehicule from "./pages/MiseEnGageVehicule";
import DemandePermisInternational from "./pages/DemandePermisInternational";
import SuiviDemande from "./pages/SuiviDemande"; // Import the new component
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import AdminEvents from "./pages/admin/AdminEvents";
import EServicesAdmin from "./pages/admin/EServicesAdmin";
import AdminPermisInternational from "./pages/admin/AdminPermisInternational";
import Publications from "./pages/Publications";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Accessibilite from "./pages/Accessibilite";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/projets" element={<Projects />} />
          <Route path="/projets/:id" element={<ProjectDetail />} />
          <Route path="/actualites" element={<News />} />
          <Route path="/actualites/communications" element={<News />} />
          <Route path="/actualites/appels-offres" element={<Tenders />} />
          <Route path="/actualites/:id" element={<NewsDetail />} />
          <Route path="/appels-offres" element={<Tenders />} />
          <Route path="/e-services" element={<EServices />} />
          <Route path="/e-services/permis-international" element={<PermisInternational />} />
          <Route path="/e-services/demande-permis-international" element={<DemandePermisInternational />} />
          <Route path="/e-services/carte-grise-internationale" element={<CarteGriseInternationale />} />
          <Route path="/e-services/demande-homologation-simple" element={<DemandeHomologationSimple />} />
          <Route path="/e-services/demande-transformation-vehicule" element={<DemandeTransformationVehicule />} />
          <Route path="/e-services/homologation-vehicule" element={<HomologationVehicule />} />
          <Route path="/e-services/permis-exploitation-ligne-transport" element={<PermisInternational />} />
          <Route path="/e-services/autorisation-transport-marchandises" element={<AutorisationTransportMarchandises />} />
          <Route path="/e-services/autorisation-transport-personnes" element={<AutorisationTransportMarchandises />} />
          <Route path="/e-services/agrement-transport-produits-strategiques" element={<PermisInternational />} />
          <Route path="/e-services/mise-en-gage-vehicule" element={<MiseEnGageVehicule />} />
          <Route path="/e-services/permis-conduire" element={<PermisConduire />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/evenements/:id" element={<EventDetail />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/suivi-demande" element={<SuiviDemande />} /> {/* New route for status tracking */}

          <Route path="/appels-offres/:id" element={<TenderDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/accessibilite" element={<Accessibilite />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/tenders" element={<AdminTenders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/e-services" element={<EServicesAdmin />} />
          <Route path="/admin/demandes/permis-international" element={<AdminPermisInternational />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
