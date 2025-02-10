import React from "react";
import { RotatedLetter } from "./RotatedLetter";

export const WelcomeHero: React.FC = () => {
  return (
    <section className="relative min-h-[679px] w-full max-w-[680px] flex flex-col items-center justify-center px-20 py-[168px] max-md:max-w-full max-md:px-5 max-md:py-[100px]">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/706578930dd6e57c28dfc8744d333d7962ed8d149c465588d0586805a9e064a6?placeholderIfAbsent=true"
        className="absolute h-full w-full object-cover inset-0"
        alt="Welcome background"
      />
      <div className="relative flex mb-[-37px] w-[302px] max-w-full flex-col items-center max-md:mb-2.5">
        <RotatedLetter letter="M" rotation={-0.012217304921810914} />
        <RotatedLetter letter="R" rotation={-0.012915436474547615} />
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ceb285c9398bf3050bf7d15733e21bb9a66014815e2e8840663394823e256df3?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-full self-stretch mt-[21px]"
          alt="Welcome logo"
        />
      </div>
    </section>
  );
};
