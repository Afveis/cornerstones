
import { useCallback } from 'react';
import { Group } from '../../types';
import { generateGroups } from '../../utils';

export const useIndicatorActions = (
  setIndicators: React.Dispatch<React.SetStateAction<any[]>>,
  setGlobalConfig: React.Dispatch<React.SetStateAction<any>>,
  activeIndicator: number,
  globalConfig: any
) => {
  const updateSliceProgress = useCallback((groupIndex: number, sliceIndex: number, progress: number) => {
    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => {
        if (indicator.id === activeIndicator) {
          const updatedGroups = indicator.groups.map((group: Group, i: number) => {
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
    });
  }, [activeIndicator, setIndicators]);

  const updateThemeConfig = useCallback((themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number, label?: string) => {
    setGlobalConfig((prevConfig) => {
      const updatedGroups = prevConfig.groups.map((group: Group, i: number) => {
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
        groups: indicator.groups.map((group: Group, i: number) => {
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
  }, [setGlobalConfig, setIndicators]);

  const updateGlobalConfig = useCallback((newThemeCount?: number, newSliceCount?: number) => {
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
        groups: globalConfig.groups.map((group: Group) => ({
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
  }, [setGlobalConfig, setIndicators, globalConfig.groups]);

  const updateIndicatorName = useCallback((id: number, name: string) => {
    setIndicators((prevIndicators) => {
      return prevIndicators.map((indicator) => {
        if (indicator.id === id) {
          return { ...indicator, name };
        }
        return indicator;
      });
    });
  }, [setIndicators]);

  return {
    updateSliceProgress,
    updateThemeConfig,
    updateGlobalConfig,
    updateIndicatorName,
  };
};
