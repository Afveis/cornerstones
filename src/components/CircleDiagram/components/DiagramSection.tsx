
import React from 'react';
import { CircleDiagram } from '../CircleDiagram';
import { IndicatorCard } from '../IndicatorCard';
import { useIndicator } from '../context/IndicatorContext';

export const DiagramSection = () => {
  const {
    indicators,
    activeIndicator,
    setActiveIndicator,
    globalConfig,
    activeIndicatorData,
    updateGlobalConfig,
    updateThemeConfig,
    updateSliceProgress,
  } = useIndicator();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 border border-[#CBCBCB] rounded-lg flex items-center justify-center p-8 bg-white">
        <CircleDiagram 
          groups={activeIndicatorData.groups}
          groupCount={globalConfig.themeCount}
          onUpdateGroupCount={count => updateGlobalConfig(count)}
          onUpdateGroupConfig={updateThemeConfig}
          onUpdateProgress={updateSliceProgress}
          centerImage={activeIndicatorData.centerImage}
        />
      </div>
      <div className="mt-2">
        <div className="flex gap-2 w-full">
          {indicators.map((indicator) => (
            <IndicatorCard
              key={indicator.id}
              indicator={indicator}
              isActive={activeIndicator === indicator.id}
              onClick={() => setActiveIndicator(indicator.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
