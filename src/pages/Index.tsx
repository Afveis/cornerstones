
import React, { useRef, useState } from "react";
import { CircleDiagram } from "@/components/CircleDiagram/CircleDiagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupControls } from "@/components/CircleDiagram/GroupControls";
import { Group, Indicator, GlobalConfig } from "@/components/CircleDiagram/types";
import { generateGroups } from "@/components/CircleDiagram/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const Index: React.FC = () => {
  const [activeIndicator, setActiveIndicator] = useState<number>(1);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    themeCount: 3,
    sliceCount: 7,
    groups: generateGroups(3),
  });
  
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: 1, centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png", groups: globalConfig.groups },
    { id: 2, centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png", groups: globalConfig.groups },
    { id: 3, centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png", groups: globalConfig.groups },
    { id: 4, centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png", groups: globalConfig.groups },
    { id: 5, centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png", groups: globalConfig.groups },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateGlobalConfig = (newThemeCount?: number, newSliceCount?: number) => {
    setGlobalConfig(prev => {
      const themeCount = newThemeCount ?? prev.themeCount;
      const sliceCount = newSliceCount ?? prev.sliceCount;
      const groups = generateGroups(themeCount);
      groups.forEach(group => {
        group.sliceCount = sliceCount;
        group.slices = Array.from({ length: sliceCount }, (_, i) => ({
          color: group.color,
          rankingColor: group.rankingColor,
          label: `Slice ${i + 1}`,
          progress: 0
        }));
      });
      
      // Update all indicators with new global groups
      setIndicators(prevIndicators => 
        prevIndicators.map(indicator => ({
          ...indicator,
          groups: [...groups]
        }))
      );

      return {
        themeCount,
        sliceCount,
        groups
      };
    });
  };

  const updateThemeConfig = (themeIndex: number, color?: string, rankingColor?: string) => {
    setGlobalConfig(prev => {
      const newGroups = [...prev.groups];
      const currentTheme = { ...newGroups[themeIndex] };
      
      if (color !== undefined) {
        currentTheme.color = color;
        currentTheme.slices = currentTheme.slices.map(slice => ({
          ...slice,
          color
        }));
      }

      if (rankingColor !== undefined) {
        currentTheme.rankingColor = rankingColor;
        currentTheme.slices = currentTheme.slices.map(slice => ({
          ...slice,
          rankingColor
        }));
      }
      
      newGroups[themeIndex] = currentTheme;

      // Update all indicators with new theme colors
      setIndicators(prevIndicators => 
        prevIndicators.map(indicator => ({
          ...indicator,
          groups: newGroups
        }))
      );

      return {
        ...prev,
        groups: newGroups
      };
    });
  };

  const updateSliceProgress = (themeIndex: number, sliceIndex: number, progress: number) => {
    setIndicators(prevIndicators => {
      return prevIndicators.map(indicator => {
        if (indicator.id === activeIndicator) {
          const newGroups = [...indicator.groups];
          const currentTheme = { ...newGroups[themeIndex] };
          const currentSlice = { ...currentTheme.slices[sliceIndex] };
          currentSlice.progress = Math.max(0, Math.min(5, progress));
          currentTheme.slices[sliceIndex] = currentSlice;
          newGroups[themeIndex] = currentTheme;
          return {
            ...indicator,
            groups: newGroups
          };
        }
        return indicator;
      });
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setIndicators(prevIndicators => 
            prevIndicators.map(indicator => 
              indicator.id === activeIndicator
                ? { ...indicator, centerImage: e.target.result as string }
                : indicator
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeIndicatorData = indicators.find(i => i.id === activeIndicator) || indicators[0];

  return (
    <main className="flex min-h-screen">
      <div className="flex-1 bg-white fixed left-0 right-[600px] top-0 bottom-0 flex flex-col items-center justify-center">
        <CircleDiagram 
          groups={activeIndicatorData.groups}
          groupCount={globalConfig.themeCount}
          onUpdateGroupCount={count => updateGlobalConfig(count)}
          onUpdateGroupConfig={updateThemeConfig}
          onUpdateProgress={updateSliceProgress}
          centerImage={activeIndicatorData.centerImage}
        />
        <div className="flex gap-4 mt-8">
          {indicators.map((indicator) => (
            <Card
              key={indicator.id}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                activeIndicator === indicator.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveIndicator(indicator.id)}
            >
              <div className="w-20 h-20 relative">
                <img 
                  src={indicator.centerImage} 
                  alt={`Indicator ${indicator.id}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center mt-2">Indicator {indicator.id}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="w-[600px] fixed right-0 top-0 bottom-0 bg-[#F3F3F3]">
        <ScrollArea className="h-full">
          <div className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white">
                <h2 className="text-lg font-semibold">Global Configuration</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Number of Themes:</span>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={globalConfig.themeCount}
                      onChange={(e) => updateGlobalConfig(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Slices per Theme:</span>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={globalConfig.sliceCount}
                      onChange={(e) => updateGlobalConfig(undefined, Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
                {globalConfig.groups.map((theme, themeIndex) => (
                  <div key={themeIndex} className="flex items-center gap-4">
                    <span className="text-sm font-medium min-w-[100px]">{theme.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Slice Color:</span>
                      <input
                        type="color"
                        value={theme.color}
                        onChange={(e) => updateThemeConfig(themeIndex, e.target.value)}
                        className="w-8 h-8 !p-0 rounded-md overflow-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Ranking Color:</span>
                      <input
                        type="color"
                        value={theme.rankingColor}
                        onChange={(e) => updateThemeConfig(themeIndex, undefined, e.target.value)}
                        className="w-8 h-8 !p-0 rounded-md overflow-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Local Configuration - Indicator {activeIndicator}</h2>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Replace illustration
                  </Button>
                </div>
                {activeIndicatorData.groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="grid grid-cols-2 gap-4">
                    {group.slices.map((slice, sliceIndex) => (
                      <div key={`${groupIndex}-${sliceIndex}`} className="flex items-center gap-2">
                        <span className="text-sm">{group.label} - Slice {sliceIndex + 1} Progress:</span>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          value={slice.progress}
                          onChange={(e) => updateSliceProgress(groupIndex, sliceIndex, Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default Index;
