import Hero from "@/components/Hero";
import MinisterMessage from "@/components/MinisterMessage";
import About from "@/components/About";
import NewsSection from "@/components/NewsSection";
import Gallery from "@/components/Gallery";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";

const Index = () => {
  return (
    <>
      <Hero />
      <About />
      <MinisterMessage />
      <NewsSection />
      <Gallery />
      {/* <Partners /> */}
      <FAQ />
    </>
  );
};

export default Index;
