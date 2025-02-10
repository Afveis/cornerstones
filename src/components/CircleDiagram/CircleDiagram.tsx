import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Slice {
  color: string;
  rankingColor: string; // New property for ranking circles color
  label: string;
  progress: number;
}

interface Group {
  slices: Slice[];
  label: string;
  color: string;
  rankingColor: string; // New property for ranking circles color
  sliceCount: number;
}

const generateGroup = (sliceCount: number, color: string = '#E2E2E2', rankingColor: string = '#8B5CF6'): Group => ({
  label: `Group`,
  slices: Array.from({ length: sliceCount }, (_, i) => ({
    color,
    rankingColor,
    label: `Slice ${i + 1}`,
    progress: 0
  })),
  color,
  rankingColor,
  sliceCount
});

const generateGroups = (groupCount: number, existingGroups: Group[] = []): Group[] => {
  return Array.from({ length: groupCount }, (_, i) => {
    if (existingGroups[i]) {
      return existingGroups[i];
    }
    return {
      ...generateGroup(7),
      label: `Group ${i + 1}`
    };
  });
};

export const CircleDiagram: React.FC = () => {
  const [groupCount, setGroupCount] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>(generateGroups(3));
  const [centerImage, setCenterImage] = useState<string>("/lovable-uploads/ad390dfb-65ef-43f9-a728-84385f728052.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const centerRadius = 150;
  const middleRadius = 180;
  const outerRadius = 300;
  const progressStep = 24;
  const svgSize = outerRadius * 2 + 100;
  const strokeWidth = 4;
  const rankingStrokeWidth = 24;

  const createMiddleCirclePath = (groupIndex: number, totalGroups: number) => {
    const availableAngle = 2 * Math.PI;
    
    const slicesBeforeGroup = groups.slice(0, groupIndex).reduce((acc, group) => acc + group.slices.length, 0);
    const groupSlices = groups[groupIndex].slices.length;
    
    const startAngle = (slicesBeforeGroup * (availableAngle / totalSlices));
    const endAngle = startAngle + (groupSlices * (availableAngle / totalSlices));

    const startX = outerRadius + Math.cos(startAngle) * middleRadius;
    const startY = outerRadius + Math.sin(startAngle) * middleRadius;
    const endX = outerRadius + Math.cos(endAngle) * middleRadius;
    const endY = outerRadius + Math.sin(endAngle) * middleRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${outerRadius} ${outerRadius}
      L ${startX} ${startY}
      A ${middleRadius} ${middleRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
  };

  const createSlicePath = (sliceIndex: number, groupIndex: number, totalSlices: number) => {
    const availableAngle = 2 * Math.PI;
    const sliceAngle = availableAngle / totalSlices;
    const absoluteSliceIndex = groups.slice(0, groupIndex).reduce((acc, group) => acc + group.slices.length, 0) + sliceIndex;
    const startAngle = absoluteSliceIndex * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const startOuterX = outerRadius + Math.cos(startAngle) * outerRadius;
    const startOuterY = outerRadius + Math.sin(startAngle) * outerRadius;
    const endOuterX = outerRadius + Math.cos(endAngle) * outerRadius;
    const endOuterY = outerRadius + Math.sin(endAngle) * outerRadius;
    const startInnerX = outerRadius + Math.cos(startAngle) * middleRadius;
    const startInnerY = outerRadius + Math.sin(startAngle) * middleRadius;
    const endInnerX = outerRadius + Math.cos(endAngle) * middleRadius;
    const endInnerY = outerRadius + Math.sin(endAngle) * middleRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${startOuterX} ${startOuterY}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}
      L ${endInnerX} ${endInnerY}
      A ${middleRadius} ${middleRadius} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}
      Z
    `;
  };

  const createProgressCirclePath = (sliceIndex: number, groupIndex: number, totalSlices: number, progressLevel: number) => {
    const progressRadius = middleRadius + ((progressLevel - 1) * progressStep);
    const availableAngle = 2 * Math.PI;
    const sliceAngle = availableAngle / totalSlices;
    const absoluteSliceIndex = groups.slice(0, groupIndex).reduce((acc, group) => acc + group.slices.length, 0) + sliceIndex;
    const startAngle = absoluteSliceIndex * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const startX = outerRadius + Math.cos(startAngle) * progressRadius;
    const startY = outerRadius + Math.sin(startAngle) * progressRadius;
    const endX = outerRadius + Math.cos(endAngle) * progressRadius;
    const endY = outerRadius + Math.sin(endAngle) * progressRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${startX} ${startY}
      A ${progressRadius} ${progressRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
    `;
  };

  const totalSlices = groups.reduce((acc, group) => acc + group.slices.length, 0);

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
          <div key={groupIndex} className="flex flex-col gap-4 p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium min-w-[100px]">{group.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">Slice Color:</span>
                <input
                  type="color"
                  value={group.color}
                  onChange={(e) => updateGroupConfig(groupIndex, e.target.value, undefined)}
                  className="w-14 h-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Ranking Color:</span>
                <input
                  type="color"
                  value={group.rankingColor}
                  onChange={(e) => updateGroupConfig(groupIndex, undefined, e.target.value)}
                  className="w-14 h-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Slices:</span>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={group.sliceCount}
                  onChange={(e) => updateGroupConfig(groupIndex, undefined, undefined, Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {group.slices.map((slice, sliceIndex) => (
                <div key={sliceIndex} className="flex items-center gap-2">
                  <span className="text-sm">Slice {sliceIndex + 1} Progress:</span>
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
          </div>
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
      
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
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
              cx={outerRadius}
              cy={outerRadius}
              r={centerRadius}
            />
          </clipPath>
          {groups.map((group, groupIndex) =>
            group.slices.map((slice, sliceIndex) => (
              <clipPath 
                key={`clip-${groupIndex}-${sliceIndex}`} 
                id={`slice-clip-${groupIndex}-${sliceIndex}`}
              >
                <path d={createSlicePath(sliceIndex, groupIndex, totalSlices)} />
              </clipPath>
            ))
          )}
        </defs>

        {/* Outer circle slices */}
        {groups.map((group, groupIndex) => (
          group.slices.map((slice, sliceIndex) => (
            <React.Fragment key={`slice-${groupIndex}-${sliceIndex}`}>
              <path
                d={createSlicePath(sliceIndex, groupIndex, totalSlices)}
                fill={group.color}
                stroke="white"
                strokeWidth={strokeWidth}
              />
              {/* Progress circles */}
              {Array.from({ length: slice.progress }, (_, i) => (
                <path
                  key={`progress-${groupIndex}-${sliceIndex}-${i}`}
                  d={createProgressCirclePath(sliceIndex, groupIndex, totalSlices, i + 1)}
                  stroke={group.rankingColor}
                  strokeWidth={rankingStrokeWidth}
                  fill="none"
                  clipPath={`url(#slice-clip-${groupIndex}-${sliceIndex})`}
                />
              ))}
            </React.Fragment>
          ))
        ))}

        {/* Middle circle divided by groups */}
        {groups.map((group, index) => (
          <path
            key={`middle-${index}`}
            d={createMiddleCirclePath(index, groups.length)}
            fill={group.color}
            stroke="white"
            strokeWidth={strokeWidth}
          />
        ))}
        
        {/* White center circle with shadow */}
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={centerRadius}
          fill="white"
          stroke="#E5E7EB"
          filter="url(#centerShadow)"
        />
        
        <image
          x={outerRadius - centerRadius + 20}
          y={outerRadius - centerRadius + 20}
          width={centerRadius * 2 - 40}
          height={centerRadius * 2 - 40}
          href={centerImage}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#centerCircleClip)"
        />
      </svg>
    </div>
  );
};
