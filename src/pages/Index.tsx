import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MinisterMessage from "@/components/MinisterMessage";
import About from "@/components/About";
import NewsSection from "@/components/NewsSection";
import Gallery from "@/components/Gallery";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />

        <About />
        <MinisterMessage />
        <NewsSection />
        <Gallery />
        {/*     <Partners /> */}
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
