
import React from "react";
import { DiagramSection } from "@/components/CircleDiagram/components/DiagramSection";
import { ConfigPanel } from "@/components/CircleDiagram/components/ConfigPanel";

const Cornerstones = () => {
  return (
    <main className="flex min-h-screen bg-[#F3F3F3]">
      <div className="flex-1 fixed left-0 right-[600px] top-[46px] bottom-0 p-2">
        <DiagramSection />
      </div>
      <div className="w-[600px] fixed right-0 top-[46px] bottom-0 bg-[#F3F3F3]">
        <ConfigPanel />
      </div>
    </main>
  );
};

export default Cornerstones;
