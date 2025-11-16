import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import logoNiger from "./assets/logo-niger.jpg";

// --- Lazy Loaded Pages ---
const Index = lazy(() => import("./pages/Index"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Tenders = lazy(() => import("./pages/Tenders"));
const TenderDetail = lazy(() => import("./pages/TenderDetail"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminNews = lazy(() => import("./pages/AdminNews"));
const AdminTenders = lazy(() => import("./pages/admin/AdminTenders"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminProfile = lazy(() => import("./pages/AdminProfile"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EServices = lazy(() => import("./pages/EServices"));
const PermisInternational = lazy(() => import("./pages/PermisInternational"));
const HomologationVehicule = lazy(() => import("./pages/HomologationVehicule"));
const PermisConduire = lazy(() => import("./pages/PermisConduire"));
const CarteGriseInternationale = lazy(() => import("./pages/CarteGriseInternationale"));
const DemandeHomologationSimple = lazy(() => import("./pages/DemandeHomologationSimple"));
const DemandeTransformationVehicule = lazy(() => import("./pages/DemandeTransformationVehicule"));
const AutorisationTransportMarchandises = lazy(() => import("./pages/AutorisationTransportMarchandises"));
const MiseEnGageVehicule = lazy(() => import("./pages/MiseEnGageVehicule"));
const DemandePermisInternational = lazy(() => import("./pages/DemandePermisInternational"));
const SuiviDemande = lazy(() => import("./pages/SuiviDemande"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const EServicesAdmin = lazy(() => import("./pages/admin/EServicesAdmin"));
const AdminPermisInternational = lazy(() => import("./pages/admin/AdminPermisInternational"));
const Publications = lazy(() => import("./pages/Publications"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const Accessibilite = lazy(() => import("./pages/Accessibilite"));

const queryClient = new QueryClient();

// Improved loader component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-background">
    <div className="text-center">
      <div className="relative flex justify-center items-center w-40 h-40">
        <div className="absolute animate-spin rounded-full h-40 w-40 border-t-4 border-b-4 border-primary"></div>
        <img src={logoNiger} alt="Logo" className="rounded-full h-28 w-28" />
      </div>
      <p className="mt-4 text-lg font-semibold text-primary animate-pulse">
        Chargement en cours...
      </p>
    </div>
  </div>
);

// Layout for public pages
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/projets" element={<MainLayout><Projects /></MainLayout>} />
            <Route path="/projets/:id" element={<MainLayout><ProjectDetail /></MainLayout>} />
            <Route path="/actualites" element={<MainLayout><News /></MainLayout>} />
            <Route path="/actualites/communications" element={<MainLayout><News /></MainLayout>} />
            <Route path="/actualites/appels-offres" element={<MainLayout><Tenders /></MainLayout>} />
            <Route path="/actualites/:id" element={<MainLayout><NewsDetail /></MainLayout>} />
            <Route path="/appels-offres" element={<MainLayout><Tenders /></MainLayout>} />
            <Route path="/e-services" element={<MainLayout><EServices /></MainLayout>} />
            <Route path="/e-services/permis-international" element={<MainLayout><PermisInternational /></MainLayout>} />
            <Route path="/e-services/demande-permis-international" element={<MainLayout><DemandePermisInternational /></MainLayout>} />
            <Route path="/e-services/carte-grise-internationale" element={<MainLayout><CarteGriseInternationale /></MainLayout>} />
            <Route path="/e-services/demande-homologation-simple" element={<MainLayout><DemandeHomologationSimple /></MainLayout>} />
            <Route path="/e-services/demande-transformation-vehicule" element={<MainLayout><DemandeTransformationVehicule /></MainLayout>} />
            <Route path="/e-services/homologation-vehicule" element={<MainLayout><HomologationVehicule /></MainLayout>} />
            <Route path="/e-services/permis-exploitation-ligne-transport" element={<MainLayout><PermisInternational /></MainLayout>} />
            <Route path="/e-services/autorisation-transport-marchandises" element={<MainLayout><AutorisationTransportMarchandises /></MainLayout>} />
            <Route path="/e-services/autorisation-transport-personnes" element={<MainLayout><AutorisationTransportMarchandises /></MainLayout>} />
            <Route path="/e-services/agrement-transport-produits-strategiques" element={<MainLayout><PermisInternational /></MainLayout>} />
            <Route path="/e-services/mise-en-gage-vehicule" element={<MainLayout><MiseEnGageVehicule /></MainLayout>} />
            <Route path="/e-services/permis-conduire" element={<MainLayout><PermisConduire /></MainLayout>} />
            <Route path="/evenements" element={<MainLayout><Events /></MainLayout>} />
            <Route path="/evenements/:id" element={<MainLayout><EventDetail /></MainLayout>} />
            <Route path="/publications" element={<MainLayout><Publications /></MainLayout>} />
            <Route path="/suivi-demande" element={<MainLayout><SuiviDemande /></MainLayout>} />
            <Route path="/appels-offres/:id" element={<MainLayout><TenderDetail /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/mentions-legales" element={<MainLayout><MentionsLegales /></MainLayout>} />
            <Route path="/politique-confidentialite" element={<MainLayout><PolitiqueConfidentialite /></MainLayout>} />
            <Route path="/accessibilite" element={<MainLayout><Accessibilite /></MainLayout>} />
            
            {/* Routes without main layout (e.g., Login, Admin) */}
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

            {/* Catch-all Route */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
