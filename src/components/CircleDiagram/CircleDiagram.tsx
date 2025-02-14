
import React, { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Group } from './types';
import { PathGenerators } from './PathGenerators';
import { CircleSlice } from './components/CircleSlice';
import { CircleDefinitions } from './components/CircleDefinitions';
import { Button } from "@/components/ui/button";

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
  onUpdateProgress,
  centerImage,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const handleCenterCircleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
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
    input.click();
  };

  const getThemeLabelPosition = (groupIndex: number, group: Group) => {
    const availableAngle = 2 * Math.PI;
    const startAngle = (slicesBeforeGroup[groupIndex] * (availableAngle / totalSlices));
    const endAngle = startAngle + (group.slices.length * (availableAngle / totalSlices));
    const middleAngle = (startAngle + endAngle) / 2;
    
    const radius = 166;
    const x = config.outerRadius + Math.cos(middleAngle) * radius;
    const y = config.outerRadius + Math.sin(middleAngle) * radius;
    
    let rotationAngle = (middleAngle * 180) / Math.PI + 90;
    
    if (rotationAngle > 180 && rotationAngle < 360) {
      rotationAngle += 180;
    }

    return {
      x,
      y,
      rotation: rotationAngle
    };
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

          {groups.map((group, index) => (
            <path
              key={`middle-${index}`}
              d={pathGenerators.createMiddleCirclePath(index, group.slices.length)}
              fill={group.color}
              stroke="white"
              strokeWidth={config.strokeWidth}
              className="transition-opacity"
            />
          ))}
          
          <g 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={config.outerRadius}
              cy={config.outerRadius}
              r={config.centerRadius}
              fill="white"
              stroke="#E5E7EB"
              filter="url(#centerShadow)"
              className="transition-opacity"
              style={{ opacity: isHovered ? 0.9 : 1 }}
            />
            
            <image
              x={config.outerRadius - config.centerRadius + 20}
              y={config.outerRadius - config.centerRadius + 20}
              width={config.centerRadius * 2 - 40}
              height={config.centerRadius * 2 - 40}
              href={centerImage}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#centerCircleClip)"
              className="transition-opacity"
              style={{ opacity: isHovered ? 0.7 : 1 }}
            />

            {isHovered && (
              <foreignObject
                x={config.outerRadius - 60}
                y={config.outerRadius - 20}
                width={120}
                height={40}
              >
                <Button 
                  className="w-full bg-white/80 hover:bg-white text-black border border-gray-200"
                  onClick={handleCenterCircleClick}
                >
                  Replace Image
                </Button>
              </foreignObject>
            )}
          </g>

          {/* Theme labels rendered last to appear on top */}
          {groups.map((group, index) => {
            const position = getThemeLabelPosition(index, group);
            return (
              <text
                key={`theme-label-${index}`}
                x={position.x}
                y={position.y}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${position.rotation}, ${position.x}, ${position.y})`}
                className="text-sm font-medium"
                fill="#000000"
                style={{ zIndex: 50 }}
              >
                {group.label || `Theme ${index + 1}`}
              </text>
            );
          })}
        </svg>
      </TooltipProvider>
    </div>
  );
};
