
import React from "react";
import { DiagramSection } from "@/components/CircleDiagram/components/DiagramSection";
import { ConfigPanel } from "@/components/CircleDiagram/components/ConfigPanel";

const Cornerstones = () => {
  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-hidden">
        <DiagramSection />
      </div>
      <div className="w-[600px] bg-[#F3F3F3] overflow-y-auto">
        <ConfigPanel />
      </div>
    </div>
  );
};

export default Cornerstones;
