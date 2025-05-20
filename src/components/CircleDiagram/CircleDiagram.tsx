
import React, { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Group } from './types';
import { PathGenerators } from './PathGenerators';
import { CircleSlice } from './components/CircleSlice';
import { CircleDefinitions } from './components/CircleDefinitions';
import { CenterCircle } from './components/CenterCircle';
import { TextPathDefinitions } from './components/TextPathDefinitions';
import { GroupLabels } from './components/GroupLabels';
import { SliceLabels } from './components/SliceLabels';
import { MiddleCirclePaths } from './components/MiddleCirclePaths';

interface CircleDiagramProps {
  groups: Group[];
  groupCount: number;
  onUpdateGroupCount: (count: number) => void;
  onUpdateGroupConfig: (groupIndex: number, color?: string, rankingColor?: string, sliceCount?: number) => void;
  onUpdateProgress: (groupIndex: number, sliceIndex: number, progress: number) => void;
  centerImage: string;
}

export const CircleDiagram: React.FC<CircleDiagramProps> = ({
  groups,
  onUpdateProgress,
  centerImage,
}) => {
  useEffect(() => {
    const handleProgressChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { groupIndex, sliceIndex, progress } = customEvent.detail;
      onUpdateProgress(groupIndex, sliceIndex, progress);
    };

    document.addEventListener('progress-change', handleProgressChange);
    return () => {
      document.removeEventListener('progress-change', handleProgressChange);
    };
  }, [onUpdateProgress]);

  // Re-render when groups changes to ensure UI is always up to date
  useEffect(() => {
    // This empty dependency array ensures the component re-renders when groups change
  }, [groups]);

  const config = {
    centerRadius: 150,
    middleRadius: 180,
    outerRadius: 300,
    progressStep: 24,
    svgSize: 700,
    strokeWidth: 4,
    rankingStrokeWidth: 24,
  };

  const totalSlices = groups.reduce((acc, group) => acc + group.slices.length, 0);
  const slicesBeforeGroup = groups.reduce((acc, group, index) => {
    acc[index] = index === 0 ? 0 : acc[index - 1] + groups[index - 1].slices.length;
    return acc;
  }, Array(groups.length).fill(0));

  const pathGenerators = new PathGenerators(config, totalSlices, slicesBeforeGroup);

  return (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <svg width={config.svgSize} height={config.svgSize} viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}>
          <CircleDefinitions
            config={config}
            groups={groups}
            pathGenerators={pathGenerators}
          />

          <defs>
            <TextPathDefinitions 
              groups={groups}
              slicesBeforeGroup={slicesBeforeGroup}
              totalSlices={totalSlices}
              outerRadius={config.outerRadius}
            />
          </defs>

          {groups.map((group, groupIndex) => (
            group.slices.map((slice, sliceIndex) => (
              <CircleSlice
                key={`slice-${groupIndex}-${sliceIndex}`}
                group={group}
                slice={slice}
                sliceIndex={sliceIndex}
                groupIndex={groupIndex}
                pathGenerators={pathGenerators}
                config={config}
              />
            ))
          ))}

          <MiddleCirclePaths 
            groups={groups}
            pathGenerators={pathGenerators}
            config={config}
          />
          
          <CenterCircle 
            centerImage={centerImage}
            config={config}
          />

          <GroupLabels 
            groups={groups} 
            paths={groups.map((_, i) => `#curve${i}`)} 
          />

          <SliceLabels groups={groups} />
        </svg>
      </TooltipProvider>
    </div>
  );
};
