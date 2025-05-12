
import React, { useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeConfiguration } from '../ThemeConfiguration';
import { IndicatorControls } from '../IndicatorControls';
import { useIndicator } from '../context/IndicatorContext';

export const ConfigPanel = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    activeIndicator,
    activeIndicatorData,
    globalConfig,
    updateGlobalConfig,
    updateThemeConfig,
    updateSliceProgress,
    updateIndicatorName,
    updateSliceLabel,
  } = useIndicator();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput && file) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          const changeEvent = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(changeEvent);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-gray-900">Indicator {activeIndicator}</h1>
          <ThemeConfiguration
            globalConfig={globalConfig}
            onUpdateGlobalConfig={updateGlobalConfig}
            onUpdateThemeConfig={updateThemeConfig}
          />
          
          <div className="border-b border-gray-200 opacity-30" />
          
          <IndicatorControls
            activeIndicator={activeIndicator}
            indicator={activeIndicatorData}
            onUpdateProgress={updateSliceProgress}
            onImageUpload={handleImageUpload}
            fileInputRef={fileInputRef}
            onUpdateIndicatorName={updateIndicatorName}
            onUpdateSliceLabel={updateSliceLabel}
          />
        </div>
      </div>
    </ScrollArea>
  );
};
