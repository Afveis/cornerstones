
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Group } from './types';
import { generateGroups } from './utils';
import { PathGenerators } from './PathGenerators';
import { GroupControls } from './GroupControls';

export const CircleDiagram: React.FC = () => {
  const [groupCount, setGroupCount] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>(generateGroups(3));
  const [centerImage, setCenterImage] = useState<string>("/lovable-uploads/ad390dfb-65ef-43f9-a728-84385f728052.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const updateGroupCount = (newGroupCount: number) => {
    setGroupCount(newGroupCount);
    setGroups(prevGroups => generateGroups(newGroupCount, prevGroups));
  };

  const updateGroupConfig = (groupIndex: number, color?: string, rankingColor?: string, sliceCount?: number) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const currentGroup = { ...newGroups[groupIndex] };
      
      if (color !== undefined) {
        currentGroup.color = color;
        currentGroup.slices = currentGroup.slices.map(slice => ({
          ...slice,
          color
        }));
      }

      if (rankingColor !== undefined) {
        currentGroup.rankingColor = rankingColor;
        currentGroup.slices = currentGroup.slices.map(slice => ({
          ...slice,
          rankingColor
        }));
      }
      
      if (sliceCount !== undefined) {
        currentGroup.sliceCount = sliceCount;
        currentGroup.slices = Array.from({ length: sliceCount }, (_, i) => ({
          color: currentGroup.color,
          rankingColor: currentGroup.rankingColor,
          label: `Slice ${i + 1}`,
          progress: 0
        }));
      }
      
      newGroups[groupIndex] = currentGroup;
      return newGroups;
    });
  };

  const updateSliceProgress = (groupIndex: number, sliceIndex: number, progress: number) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const currentGroup = { ...newGroups[groupIndex] };
      const currentSlice = { ...currentGroup.slices[sliceIndex] };
      currentSlice.progress = Math.max(0, Math.min(5, progress));
      currentGroup.slices[sliceIndex] = currentSlice;
      newGroups[groupIndex] = currentGroup;
      return newGroups;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCenterImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Number of Groups:</span>
          <Input
            type="number"
            min="1"
            max="10"
            value={groupCount}
            onChange={(e) => updateGroupCount(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xl">
        {groups.map((group, groupIndex) => (
          <GroupControls
            key={groupIndex}
            group={group}
            groupIndex={groupIndex}
            onUpdateConfig={updateGroupConfig}
            onUpdateProgress={updateSliceProgress}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-4">
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
          Choose Center Image
        </Button>
      </div>
      
      <TooltipProvider>
        <svg width={config.svgSize} height={config.svgSize} viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}>
          <defs>
            <filter id="centerShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feFlood floodColor="#535353" floodOpacity="0.5" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="centerCircleClip">
              <circle
                cx={config.outerRadius}
                cy={config.outerRadius}
                r={config.centerRadius}
              />
            </clipPath>
            {groups.map((group, groupIndex) =>
              group.slices.map((slice, sliceIndex) => (
                <clipPath 
                  key={`clip-${groupIndex}-${sliceIndex}`} 
                  id={`slice-clip-${groupIndex}-${sliceIndex}`}
                >
                  <path d={pathGenerators.createSlicePath(sliceIndex, groupIndex)} />
                </clipPath>
              ))
            )}
          </defs>

          {/* Outer circle slices */}
          {groups.map((group, groupIndex) => (
            group.slices.map((slice, sliceIndex) => (
              <Tooltip key={`slice-${groupIndex}-${sliceIndex}`}>
                <TooltipTrigger asChild>
                  <g>
                    <path
                      d={pathGenerators.createSlicePath(sliceIndex, groupIndex)}
                      fill={group.color}
                      stroke="white"
                      strokeWidth={config.strokeWidth}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    {/* Progress circles */}
                    {Array.from({ length: slice.progress }, (_, i) => (
                      <path
                        key={`progress-${groupIndex}-${sliceIndex}-${i}`}
                        d={pathGenerators.createProgressCirclePath(sliceIndex, groupIndex, i + 1)}
                        stroke={group.rankingColor}
                        strokeWidth={config.rankingStrokeWidth}
                        fill="none"
                        clipPath={`url(#slice-clip-${groupIndex}-${sliceIndex})`}
                      />
                    ))}
                  </g>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-4 w-[300px] space-y-3 bg-white shadow-lg rounded-lg border-none">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{group.label}</h3>
                    <h4 className="text-lg font-medium text-gray-800 mt-1">{slice.label}</h4>
                    <div className="text-base font-medium text-gray-700 mt-1">
                      Progress Level: {slice.progress}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.
                  </p>
                </TooltipContent>
              </Tooltip>
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
