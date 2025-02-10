
import React from "react";
import { CircleDiagram } from "@/components/CircleDiagram/CircleDiagram";

const Index: React.FC = () => {
  return (
    <main className="flex min-h-screen">
      <div className="flex-1 bg-white p-8 flex items-center justify-center">
        <CircleDiagram />
      </div>
      <div className="w-[600px] bg-[#F3F3F3] p-8 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Number of Groups:</span>
              <Input
                type="number"
                min="1"
                max="10"
                value={groupCount}
                onChange={(e) => updateGroupCount(Number(e.target.value))}
                className="w-20"
              />
            </div>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose Center Image
            </Button>
          </div>
          {groups.map((group, groupIndex) => (
            <GroupControls
              key={groupIndex}
              group={group}
              groupIndex={groupIndex}
              onUpdateConfig={updateGroupConfig}
              onUpdateProgress={updateSliceProgress}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Index;
