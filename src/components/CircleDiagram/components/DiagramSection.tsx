
import React from "react";
import { useIndicator } from "../context/IndicatorContext";
import { CircleDiagram } from "../CircleDiagram";
import { IndicatorList } from "../IndicatorList";

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
    updateCenterImage,
  } = useIndicator();

  const handleCenterImageChange = (newImage: string) => {
    updateCenterImage(activeIndicator, newImage);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-6xl">
        <CircleDiagram
          groups={activeIndicatorData.groups}
          groupCount={globalConfig.themeCount}
          onUpdateGroupCount={updateGlobalConfig}
          onUpdateGroupConfig={updateThemeConfig}
          onUpdateProgress={updateSliceProgress}
          centerImage={activeIndicatorData.centerImage}
          onCenterImageChange={handleCenterImageChange}
        />

        <div className="mt-10">
          <IndicatorList
            indicators={indicators}
            activeIndicator={activeIndicator}
            onSelectIndicator={setActiveIndicator}
            onAddIndicator={addNewIndicator}
          />
        </div>
      </div>
    </div>
  );
};
