
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Group } from './types';
import { PathGenerators } from './PathGenerators';
import { CircleSlice } from './components/CircleSlice';
import { CircleDefinitions } from './components/CircleDefinitions';

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
  groupCount,
  centerImage,
}) => {
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

  const handleMiddleCircleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            // Since we can't directly update the centerImage prop, we trigger the file input click
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const changeEvent = new Event('change', { bubbles: true });
            Object.defineProperty(changeEvent, 'target', { value: { files: [file] } });
            fileInput?.dispatchEvent(changeEvent);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <svg width={config.svgSize} height={config.svgSize} viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}>
          <CircleDefinitions
            config={config}
            groups={groups}
            pathGenerators={pathGenerators}
          />

          {/* Outer circle slices */}
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

          {/* Middle circle divided by groups */}
          {groups.map((group, index) => (
            <path
              key={`middle-${index}`}
              d={pathGenerators.createMiddleCirclePath(index, group.slices.length)}
              fill={group.color}
              stroke="white"
              strokeWidth={config.strokeWidth}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleMiddleCircleClick}
            />
          ))}
          
          {/* White center circle with shadow */}
          <circle
            cx={config.outerRadius}
            cy={config.outerRadius}
            r={config.centerRadius}
            fill="white"
            stroke="#E5E7EB"
            filter="url(#centerShadow)"
          />
          
          <image
            x={config.outerRadius - config.centerRadius + 20}
            y={config.outerRadius - config.centerRadius + 20}
            width={config.centerRadius * 2 - 40}
            height={config.centerRadius * 2 - 40}
            href={centerImage}
            preserveAspectRatio="xMidYMid meet"
            clipPath="url(#centerCircleClip)"
          />
        </svg>
      </TooltipProvider>
    </div>
  );
};
