
import React, { useRef, useState, useEffect } from "react";
import { CircleDiagram } from "@/components/CircleDiagram/CircleDiagram";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Group, Indicator, GlobalConfig } from "@/components/CircleDiagram/types";
import { generateGroups } from "@/components/CircleDiagram/utils";
import { ThemeConfiguration } from "@/components/CircleDiagram/ThemeConfiguration";
import { IndicatorCard } from "@/components/CircleDiagram/IndicatorCard";
import { IndicatorControls } from "@/components/CircleDiagram/IndicatorControls";
import { useToast } from "@/components/ui/use-toast";

const Index: React.FC = () => {
  const { toast } = useToast();
  const [activeIndicator, setActiveIndicator] = useState<number>(1);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(() => {
    const savedConfig = localStorage.getItem('globalConfig');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error('Error parsing saved config:', e);
      }
    }
    return {
      themeCount: 3,
      sliceCount: 7,
      groups: generateGroups(3),
    };
  });
  
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: 1, centerImage: "/lovable-uploads/3fbd1296-a4d4-4f64-a3c3-d480231aca1a.png", groups: JSON.parse(JSON.stringify(globalConfig.groups)) },
    { id: 2, centerImage: "/lovable-uploads/1364c0b0-371e-468f-a8d7-baa93089c1a7.png", groups: JSON.parse(JSON.stringify(globalConfig.groups)) },
    { id: 3, centerImage: "/lovable-uploads/8cec5b95-3fc0-4810-aeb5-ba181501df06.png", groups: JSON.parse(JSON.stringify(globalConfig.groups)) },
    { id: 4, centerImage: "/lovable-uploads/3b4add13-7d48-4922-bacc-6f8fbd6523f4.png", groups: JSON.parse(JSON.stringify(globalConfig.groups)) },
    { id: 5, centerImage: "/lovable-uploads/dd6e8427-ee8e-4177-96da-27645ccd1d82.png", groups: JSON.parse(JSON.stringify(globalConfig.groups)) },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('globalConfig', JSON.stringify(globalConfig));
    toast({
      title: "Settings saved",
      description: "Your theme configuration has been saved.",
    });
  }, [globalConfig, toast]);

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
      
      setIndicators(prevIndicators => 
        prevIndicators.map(indicator => {
          const newGroups = groups.map((group, groupIndex) => ({
            ...group,
            slices: group.slices.map((slice, sliceIndex) => ({
              ...slice,
              progress: indicator.groups[groupIndex]?.slices[sliceIndex]?.progress || 0
            }))
          }));
          return {
            ...indicator,
            groups: newGroups
          };
        })
      );

      return {
        themeCount,
        sliceCount,
        groups
      };
    });
  };

  const updateThemeConfig = (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number) => {
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

      if (sliceCount !== undefined) {
        currentTheme.sliceCount = sliceCount;
        const newSlices = Array.from({ length: sliceCount }, (_, i) => ({
          color: currentTheme.color,
          rankingColor: currentTheme.rankingColor,
          label: `Slice ${i + 1}`,
          progress: 0
        }));
        currentTheme.slices = newSlices;
      }
      
      newGroups[themeIndex] = currentTheme;

      setIndicators(prevIndicators => 
        prevIndicators.map(indicator => ({
          ...indicator,
          groups: newGroups.map((group, groupIndex) => ({
            ...group,
            slices: group.slices.map((slice, sliceIndex) => ({
              ...slice,
              progress: indicator.groups[groupIndex]?.slices[sliceIndex]?.progress || 0
            }))
          }))
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
          const newGroups = indicator.groups.map((group, gIndex) => {
            if (gIndex === themeIndex) {
              return {
                ...group,
                slices: group.slices.map((slice, sIndex) => {
                  if (sIndex === sliceIndex) {
                    return {
                      ...slice,
                      progress: Math.max(0, Math.min(5, progress))
                    };
                  }
                  return slice;
                })
              };
            }
            return group;
          });
          
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
            <IndicatorCard
              key={indicator.id}
              indicator={indicator}
              isActive={activeIndicator === indicator.id}
              onClick={() => setActiveIndicator(indicator.id)}
            />
          ))}
        </div>
      </div>
      <div className="w-[600px] fixed right-0 top-0 bottom-0 bg-[#F3F3F3]">
        <ScrollArea className="h-full">
          <div className="p-8">
            <div className="flex flex-col gap-6">
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
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default Index;
