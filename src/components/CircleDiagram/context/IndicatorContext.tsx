import React, { createContext, useContext, useState } from 'react';
import { Indicator, GlobalConfig, Group } from '../types';
import { generateGroups } from '../utils';

interface IndicatorContextType {
  indicators: Indicator[];
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>;
  activeIndicator: number;
  setActiveIndicator: React.Dispatch<React.SetStateAction<number>>;
  globalConfig: GlobalConfig;
  setGlobalConfig: React.Dispatch<React.SetStateAction<GlobalConfig>>;
  activeIndicatorData: Indicator;
  updateSliceProgress: (groupIndex: number, sliceIndex: number, progress: number) => void;
  updateThemeConfig: (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number, label?: string) => void;
  updateGlobalConfig: (newThemeCount?: number, newSliceCount?: number) => void;
  updateIndicatorName: (id: number, name: string) => void;
}

const initialGroups = generateGroups(3);

const IndicatorContext = createContext<IndicatorContextType | undefined>(undefined);

export const IndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [indicators, setIndicators] = useState<Indicator[]>([
    {
      id: 1,
      name: "Indicator 1",
      centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png",
      groups: generateGroups(3),
    },
    {
      id: 2,
      name: "Indicator 2",
      centerImage: "/lovable-uploads/3fbd1296-a4d4-4f64-a3c3-d480231aca1a.png",
      groups: generateGroups(3),
    },
    {
      id: 3,
      name: "Indicator 3",
      centerImage: "/lovable-uploads/8cec5b95-3fc0-4810-aeb5-ba181501df06.png",
      groups: generateGroups(3),
    },
    {
      id: 4,
      name: "Indicator 4",
      centerImage: "/lovable-uploads/1364c0b0-371e-468f-a8d7-baa93089c1a7.png",
      groups: generateGroups(3),
    },
    {
      id: 5,
      name: "Indicator 5",
      centerImage: "/lovable-uploads/3b4add13-7d48-4922-bacc-6f8fbd6523f4.png",
      groups: generateGroups(3),
    }
  ]);

  const [activeIndicator, setActiveIndicator] = useState<number>(1);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    themeCount: 3,
    sliceCount: 7,
    groups: initialGroups,
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
            label: label !== undefined ? label : group.label,
          };
        }
        return group;
      });
      return { ...prevConfig, groups: updatedGroups };
    });

    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => ({
        ...indicator,
        groups: indicator.groups.map((group, i) => {
          if (i === themeIndex) {
            const updatedGroup = {
              ...group,
              color: color !== undefined ? color : group.color,
              rankingColor: rankingColor !== undefined ? rankingColor : group.rankingColor,
              sliceCount: sliceCount !== undefined ? sliceCount : group.sliceCount,
              label: label !== undefined ? label : group.label,
            };
            
            if (sliceCount !== undefined) {
              const newSlices = Array.from({ length: sliceCount }, (_, index) => {
                if (index < group.slices.length) {
                  return {
                    ...group.slices[index],
                    color: updatedGroup.color,
                    rankingColor: updatedGroup.rankingColor,
                  };
                }
                return {
                  color: updatedGroup.color,
                  rankingColor: updatedGroup.rankingColor,
                  label: `Slice ${index + 1}`,
                  progress: 0,
                  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque."
                };
              });
              updatedGroup.slices = newSlices;
            }
            
            return updatedGroup;
          }
          return group;
        })
      }));
    });
  };

  const updateGlobalConfig = (newThemeCount?: number, newSliceCount?: number) => {
    setGlobalConfig((prevConfig) => {
      const updatedThemeCount = newThemeCount !== undefined ? newThemeCount : prevConfig.themeCount;
      const updatedSliceCount = newSliceCount !== undefined ? newSliceCount : prevConfig.sliceCount;
  
      const updatedGroups = Array.from({ length: updatedThemeCount }, (_, index) => {
        if (index < prevConfig.groups.length) {
          return prevConfig.groups[index];
        }
        const newGroup = generateGroups(1)[0];
        return {
          ...newGroup,
          sliceCount: updatedSliceCount,
          slices: Array.from({ length: updatedSliceCount }, (_, i) => ({
            color: newGroup.color,
            rankingColor: newGroup.rankingColor,
            label: `Slice ${i + 1}`,
            progress: 0,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque."
          }))
        };
      });
  
      return {
        themeCount: updatedThemeCount,
        sliceCount: updatedSliceCount,
        groups: updatedGroups,
      };
    });
  
    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => ({
        ...indicator,
        groups: globalConfig.groups.map(group => ({
          ...group,
          slices: Array.from({ length: group.sliceCount }, (_, i) => {
            if (i < group.slices.length) {
              return group.slices[i];
            }
            return {
              color: group.color,
              rankingColor: group.rankingColor,
              label: `Slice ${i + 1}`,
              progress: 0,
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque."
            };
          })
        }))
      }));
    });
  };

  const updateIndicatorName = (id: number, name: string) => {
    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => {
        if (indicator.id === id) {
          return { ...indicator, name };
        }
        return indicator;
      });
    });
  };

  return (
    <IndicatorContext.Provider
      value={{
        indicators,
        setIndicators,
        activeIndicator,
        setActiveIndicator,
        globalConfig,
        setGlobalConfig,
        activeIndicatorData,
        updateSliceProgress,
        updateThemeConfig,
        updateGlobalConfig,
        updateIndicatorName,
      }}
    >
      {children}
    </IndicatorContext.Provider>
  );
};

export const useIndicator = () => {
  const context = useContext(IndicatorContext);
  if (context === undefined) {
    throw new Error('useIndicator must be used within an IndicatorProvider');
  }
  return context;
};
