interface PageBannerProps {
  title: string;
  description: string;
}

const PageBanner = ({ title, description }: PageBannerProps) => {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
      <div className="container">
        <div className="max-w-3xl animate-slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageBanner;
