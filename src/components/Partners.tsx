import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const partners = [
  {
    name: "Banque Mondiale",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop",
    category: "Partenaire Financier",
  },
  {
    name: "Union Africaine",
    logo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=100&fit=crop",
    category: "Organisation Internationale",
  },
  {
    name: "CEDEAO",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=100&fit=crop",
    category: "Organisation Régionale",
  },
  {
    name: "OACI",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=100&fit=crop",
    category: "Aviation Civile",
  },
  {
    name: "AFD",
    logo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=100&fit=crop",
    category: "Coopération",
  },
  {
    name: "BAD",
    logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&h=100&fit=crop",
    category: "Développement",
  },
  {
    name: "PNUD",
    logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=100&fit=crop",
    category: "Développement",
  },
  {
    name: "UE",
    logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=100&fit=crop",
    category: "Coopération",
  },
];

const Partners = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Partenaires Institutionnels
          </h2>
          <p className="text-gray-600 text-lg">
            Nos partenaires pour le développement des transports au Niger.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {partners.map((partner, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/6"
              >
                <Card className="group cursor-pointer border-2 hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-36">
                    <div className="w-full h-16 flex items-center justify-center mb-3">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      {partner.category}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Partners;