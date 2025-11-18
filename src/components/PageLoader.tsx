import React from 'react';
import logoNiger from "@/assets/logo-niger.jpg"; // Assuming logoNiger is available via alias

export const PageLoader = () => (
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

export default PageLoader;
