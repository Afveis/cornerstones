
import React from "react";
import { CircleDiagram } from "@/components/CircleDiagram/CircleDiagram";

const Index: React.FC = () => {
  return (
    <main className="flex min-h-screen">
      <div className="flex-1 bg-white p-8 flex items-center justify-center">
        <CircleDiagram />
      </div>
      <div className="w-[400px] bg-[#F3F3F3] p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Number of Groups:</span>
            <span className="text-sm font-medium">Choose Center Image</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
