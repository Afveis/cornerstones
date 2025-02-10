import React from "react";
import { WelcomeHero } from "@/components/welcome/WelcomeHero";

const Index: React.FC = () => {
  return (
    <main className="bg-white flex max-w-[976px] flex-col overflow-hidden items-center text-[8px] text-white font-medium whitespace-nowrap justify-center px-20 py-[117px] max-md:px-5 max-md:py-[100px]">
      <WelcomeHero />
    </main>
  );
};

export default Index;
