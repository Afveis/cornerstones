// Move the content from Index.tsx to here
import React, { useRef, useState } from "react";
import { CircleDiagram } from "@/components/CircleDiagram/CircleDiagram";
import { IndicatorCard } from "@/components/CircleDiagram/IndicatorCard";
import { Indicator, GlobalConfig, Group } from "@/components/CircleDiagram/types";
import { generateGroups } from "@/components/CircleDiagram/utils";
import { ThemeConfiguration } from "@/components/CircleDiagram/ThemeConfiguration";
import { IndicatorControls } from "@/components/CircleDiagram/IndicatorControls";
import { ScrollArea } from "@/components/ui/scroll-area";

const Cornerstones = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([
    {
      id: 1,
      centerImage: "/images/bulb.png",
      groups: generateGroups(3),
    },
    {
      id: 2,
      centerImage: "/images/target.png",
      groups: generateGroups(4),
    },
    {
      id: 3,
      centerImage: "/images/eye.png",
      groups: generateGroups(2),
    },
  ]);
  const [activeIndicator, setActiveIndicator] = useState<number>(1);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    themeCount: 3,
    sliceCount: 7,
    groups: generateGroups(3),
  });

  const activeIndicatorData = indicators.find((indicator) => indicator.id === activeIndicator) || indicators[0];

  const updateSliceProgress = (groupIndex: number, sliceIndex: number, progress: number) => {
    setIndicators((prevIndicators) => {
      const updatedIndicators = prevIndicators.map((indicator) => {
        if (indicator.id === activeIndicator) {
          const updatedGroups = indicator.groups.map((group, i) => {
            if (i === groupIndex) {
              const updatedSlices = group.slices.map((slice, j) => {
                if (j === sliceIndex) {
                  return { ...slice, progress };
                }
                return slice;
              });
              return { ...group, slices: updatedSlices };
            }
            return group;
          });
          return { ...indicator, groups: updatedGroups };
        }
        return indicator;
      });
      return updatedIndicators;
    });
  };

  const updateThemeConfig = (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number, label?: string) => {
    setGlobalConfig((prevConfig) => {
      const updatedGroups = prevConfig.groups.map((group, i) => {
        if (i === themeIndex) {
          return {
            ...group,
            color: color !== undefined ? color : group.color,
            rankingColor: rankingColor !== undefined ? rankingColor : group.rankingColor,
            sliceCount: sliceCount !== undefined ? sliceCount : group.sliceCount,
            slices: sliceCount !== undefined ? Array.from({ length: sliceCount }, (_, i) => ({
              color: group.color,
              rankingColor: group.rankingColor,
              label: `Slice ${i + 1}`,
              progress: 0,
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque."
            })) : group.slices,
            label: label !== undefined ? label : group.label,
          };
        }
        return group;
      });
      return { ...prevConfig, groups: updatedGroups };
    });

    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => {
        if (indicator.id === activeIndicator) {
          const updatedGroups = indicator.groups.map((group, i) => {
            if (i === themeIndex) {
              return {
                ...group,
                color: color !== undefined ? color : group.color,
                rankingColor: rankingColor !== undefined ? rankingColor : group.rankingColor,
                sliceCount: sliceCount !== undefined ? sliceCount : group.sliceCount,
                slices: sliceCount !== undefined ? Array.from({ length: sliceCount }, (_, i) => ({
                  color: group.color,
                  rankingColor: group.rankingColor,
                  label: `Slice ${i + 1}`,
                  progress: 0,
                  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque."
                })) : group.slices,
                label: label !== undefined ? label : group.label,
              };
            }
            return group;
          });
          return { ...indicator, groups: updatedGroups };
        }
        return indicator;
      });
    });
  };

  const updateGlobalConfig = (newThemeCount?: number, newSliceCount?: number) => {
    setGlobalConfig((prevConfig) => {
      const updatedThemeCount = newThemeCount !== undefined ? newThemeCount : prevConfig.themeCount;
      const updatedSliceCount = newSliceCount !== undefined ? newSliceCount : prevConfig.sliceCount;
  
      const updatedGroups = generateGroups(updatedThemeCount, prevConfig.groups);
  
      return {
        themeCount: updatedThemeCount,
        sliceCount: updatedSliceCount,
        groups: updatedGroups,
      };
    });
  
    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => {
        if (indicator.id === activeIndicator) {
          const updatedGroups = generateGroups(newThemeCount || globalConfig.themeCount, indicator.groups);
          return { ...indicator, groups: updatedGroups };
        }
        return indicator;
      });
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIndicators((prevIndicators) => {
          return prevIndicators.map((indicator) => {
            if (indicator.id === activeIndicator) {
              return { ...indicator, centerImage: reader.result as string };
            }
            return indicator;
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateIndicatorName = (id: number, name: string) => {
    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => {
        if (indicator.id === id) {
          return { ...indicator, name: name };
        }
        return indicator;
      });
    });
  };

  return (
    <main className="flex min-h-screen bg-[#F3F3F3]">
      <div className="flex-1 fixed left-0 right-[600px] top-[46px] bottom-0 p-2">
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
      </div>
      <div className="w-[600px] fixed right-0 top-[46px] bottom-0 bg-[#F3F3F3]">
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
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default Cornerstones;
