import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import heroTransport from "@/assets/hero-transport.jpg";
import heroAviation from "@/assets/hero-aviation.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/gallerie/3.webp",
      title: "Modernisation des Infrastructures de Transport",
      subtitle: "Au service du développement économique et social du Niger",
    },
    {
      image: "/gallerie/5.jpg",
      title: "Excellence en Aviation Civile",
      subtitle: "Conformité aux standards internationaux de sécurité aérienne",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container flex items-center">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium">Administration Publique du Niger</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
            {slides[currentSlide].title}
          </h1>

          <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="gradient-primary hover:shadow-glow transition-all group">
              <Link to="/e-services" className="flex items-center gap-2">
                Découvrir nos services publics
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="bg-card/50 backdrop-blur">
              <Link to="/actualites/appels-offres" className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Nos réalisations
              </Link>
            </Button>
          </div>


        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
              ? "bg-primary w-8"
              : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
