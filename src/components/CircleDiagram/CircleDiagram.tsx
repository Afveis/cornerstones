
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Slice {
  color: string;
  label: string;
}

interface Group {
  slices: Slice[];
  label: string;
  color: string;
  sliceCount: number;
}

const generateGroup = (sliceCount: number, color: string = '#E2E2E2'): Group => ({
  label: `Group`,
  slices: Array.from({ length: sliceCount }, (_, i) => ({
    color,
    label: `Slice ${i + 1}`
  })),
  color,
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
  const middleRadius = 170;
  const outerRadius = 300;
  const svgSize = outerRadius * 2 + 100;
  const gapAngle = (Math.PI / 180) * 1; // 1 degree gap

  const updateGroupCount = (newGroupCount: number) => {
    setGroupCount(newGroupCount);
    setGroups(prevGroups => generateGroups(newGroupCount, prevGroups));
  };

  const updateGroupConfig = (groupIndex: number, color?: string, sliceCount?: number) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const currentGroup = { ...newGroups[groupIndex] };
      
      if (color !== undefined) {
        currentGroup.color = color;
      }
      
      if (sliceCount !== undefined) {
        currentGroup.sliceCount = sliceCount;
        currentGroup.slices = Array.from({ length: sliceCount }, (_, i) => ({
          color: currentGroup.color,
          label: `Slice ${i + 1}`
        }));
      }
      
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

  const createMiddleCirclePath = (groupIndex: number, totalGroups: number) => {
    const totalGapAngle = gapAngle * totalSlices;
    const availableAngle = 2 * Math.PI - totalGapAngle;
    
    // Calculate the start and end angles based on the slices in previous groups
    const slicesBeforeGroup = groups.slice(0, groupIndex).reduce((acc, group) => acc + group.slices.length, 0);
    const groupSlices = groups[groupIndex].slices.length;
    
    const startAngle = (slicesBeforeGroup * (availableAngle / totalSlices)) + (slicesBeforeGroup * gapAngle);
    const endAngle = startAngle + (groupSlices * (availableAngle / totalSlices)) + ((groupSlices - 1) * gapAngle);

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
    const totalGapAngle = gapAngle * totalSlices;
    const availableAngle = 2 * Math.PI - totalGapAngle;
    const sliceAngle = availableAngle / totalSlices;
    const absoluteSliceIndex = groups.slice(0, groupIndex).reduce((acc, group) => acc + group.slices.length, 0) + sliceIndex;
    const startAngle = absoluteSliceIndex * (sliceAngle + gapAngle);
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

  const totalSlices = groups.reduce((acc, group) => acc + group.slices.length, 0);

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
        {groups.map((group, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
            <span className="text-sm font-medium min-w-[100px]">{group.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">Color:</span>
              <input
                type="color"
                value={group.color}
                onChange={(e) => updateGroupConfig(index, e.target.value)}
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
                onChange={(e) => updateGroupConfig(index, undefined, Number(e.target.value))}
                className="w-20"
              />
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
        </defs>
        
        {/* White center circle with shadow */}
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={centerRadius}
          fill="white"
          stroke="#E5E7EB"
          filter="url(#centerShadow)"
        />
        
        {/* Center image */}
        <image
          x={outerRadius - centerRadius + 20}
          y={outerRadius - centerRadius + 20}
          width={centerRadius * 2 - 40}
          height={centerRadius * 2 - 40}
          href={centerImage}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Middle circle divided by groups */}
        {groups.map((group, index) => (
          <path
            key={`middle-${index}`}
            d={createMiddleCirclePath(index, groups.length)}
            fill={group.color}
          />
        ))}
        
        {/* Outer circle slices */}
        {groups.map((group, groupIndex) => (
          group.slices.map((slice, sliceIndex) => (
            <path
              key={`${groupIndex}-${sliceIndex}`}
              d={createSlicePath(sliceIndex, groupIndex, totalSlices)}
              fill={group.color}
            />
          ))
        ))}
      </svg>
    </div>
  );
};
