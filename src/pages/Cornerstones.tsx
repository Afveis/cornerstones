
import React from "react";
import { DiagramSection } from "@/components/CircleDiagram/components/DiagramSection";
import { ConfigPanel } from "@/components/CircleDiagram/components/ConfigPanel";

const Cornerstones = () => {
  return (
    <div className="flex-1 flex">
      <div className="flex-1">
        <DiagramSection />
      </div>
      <div className="w-[600px] bg-[#F3F3F3]">
        <ConfigPanel />
      </div>
    </div>
  );
};

export default Cornerstones;
