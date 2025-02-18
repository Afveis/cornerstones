
import React from "react";
import { DiagramSection } from "@/components/CircleDiagram/components/DiagramSection";
import { ConfigPanel } from "@/components/CircleDiagram/components/ConfigPanel";
import { Navigation } from "@/components/Navigation";

const Cornerstones = () => {
  return (
    <div className="flex h-screen bg-[#F3F3F3] p-2">
      <div className="flex-1 flex flex-col gap-2">
        <Navigation />
        <div className="flex-1 flex">
          <div className="flex-1">
            <DiagramSection />
          </div>
          <div className="w-[600px] bg-[#F3F3F3]">
            <ConfigPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cornerstones;
