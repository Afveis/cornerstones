
import React, { createContext, useContext, useState } from 'react';
import { Indicator, GlobalConfig } from '../types';
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

const IndicatorContext = createContext<IndicatorContextType | undefined>(undefined);

export const IndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
