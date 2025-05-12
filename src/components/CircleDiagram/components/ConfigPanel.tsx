
import React, { useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeConfiguration } from '../ThemeConfiguration';
import { IndicatorControls } from '../IndicatorControls';
import { useIndicator } from '../context/IndicatorContext';
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/Auth/LoginButton";
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";

export const ConfigPanel = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const {
    activeIndicator,
    activeIndicatorData,
    globalConfig,
    indicators,
    updateGlobalConfig,
    updateThemeConfig,
    updateSliceProgress,
    updateIndicatorName,
    updateSliceLabel,
  } = useIndicator();

  const { user, saveUserData } = useAuth();

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

  const handleSaveProgress = async () => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in to save your progress.",
      });
      return;
    }

    try {
      await saveUserData(indicators);
      toast({
        title: "Progress saved",
        description: "Your progress has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving progress",
        description: "There was an error saving your progress.",
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Indicator {activeIndicator}</h1>
            <div className="flex gap-2">
              <LoginButton />
              {user && (
                <Button onClick={handleSaveProgress} variant="default">
                  Save Progress
                </Button>
              )}
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
