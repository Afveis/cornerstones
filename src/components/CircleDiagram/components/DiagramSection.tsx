
import React from "react";
import { useIndicator } from "../context/IndicatorContext";
import { CircleDiagram } from "../CircleDiagram";
import { IndicatorList } from "../IndicatorList";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DiagramSection = () => {
  const {
    indicators,
    activeIndicator,
    activeIndicatorData,
    globalConfig,
    updateGlobalConfig,
    updateThemeConfig,
    updateSliceProgress,
    setActiveIndicator,
    addNewIndicator,
    updateCenterImage
  } = useIndicator();

  const handleCenterImageChange = (newImage: string) => {
    updateCenterImage(activeIndicator, newImage);
  };

  return <ScrollArea className="h-full w-full">
      <div className="flex flex-col items-center justify-start min-h-full p-4 pb-20 py-[24px]">
        <div className="w-full max-w-6xl">
          <CircleDiagram 
            groups={activeIndicatorData.groups} 
            groupCount={globalConfig.themeCount} 
            onUpdateGroupCount={updateGlobalConfig} 
            onUpdateGroupConfig={updateThemeConfig} 
            onUpdateProgress={updateSliceProgress} 
            centerImage={activeIndicatorData.centerImage} 
            onCenterImageChange={handleCenterImageChange}
            indicatorName={activeIndicatorData.name} // Pass the indicator name
          />

          <div className="mt-10 mb-10">
            <IndicatorList indicators={indicators} activeIndicator={activeIndicator} onSelectIndicator={setActiveIndicator} onAddIndicator={addNewIndicator} />
          </div>
        </div>
      </div>
    </ScrollArea>;
};
