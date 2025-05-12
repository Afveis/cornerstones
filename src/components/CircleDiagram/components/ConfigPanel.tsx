
import React, { useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeConfiguration } from '../ThemeConfiguration';
import { IndicatorControls } from '../IndicatorControls';
import { useIndicator } from '../context/IndicatorContext';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { AuthButton } from '@/components/Auth/AuthButton';
import { Save } from 'lucide-react';

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
    saveProgress,
  } = useIndicator();

  const { user } = useAuth();

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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Indicator {activeIndicator}</h1>
            <div className="flex items-center gap-2">
              {user && (
                <Button 
                  onClick={saveProgress}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Progress
                </Button>
              )}
              <AuthButton />
            </div>
          </div>
          
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
