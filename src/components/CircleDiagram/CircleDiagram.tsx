
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
}

const generateGroup = (sliceCount: number): Group => ({
  label: `Group`,
  slices: Array.from({ length: sliceCount }, (_, i) => ({
    color: '#E2E2E2',
    label: `Slice ${i + 1}`
  }))
});

const generateGroups = (groupCount: number, slicesPerGroup: number): Group[] => {
  return Array.from({ length: groupCount }, (_, i) => ({
    ...generateGroup(slicesPerGroup),
    label: `Group ${i + 1}`
  }));
};

export const CircleDiagram: React.FC = () => {
  const [groupCount, setGroupCount] = useState<number>(3);
  const [slicesPerGroup, setSlicesPerGroup] = useState<number>(7);
  const [groups, setGroups] = useState<Group[]>(generateGroups(3, 7));
  const [centerImage, setCenterImage] = useState<string>("/lovable-uploads/ad390dfb-65ef-43f9-a728-84385f728052.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const centerRadius = 150;
  const outerRadius = 300;
  const svgSize = outerRadius * 2 + 100;
  const gapAngle = (Math.PI / 180) * 1; // 1 degree gap

  const updateGroups = (newGroupCount: number, newSlicesPerGroup: number) => {
    setGroupCount(newGroupCount);
    setSlicesPerGroup(newSlicesPerGroup);
    setGroups(generateGroups(newGroupCount, newSlicesPerGroup));
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
    const startInnerX = outerRadius + Math.cos(startAngle) * centerRadius;
    const startInnerY = outerRadius + Math.sin(startAngle) * centerRadius;
    const endInnerX = outerRadius + Math.cos(endAngle) * centerRadius;
    const endInnerY = outerRadius + Math.sin(endAngle) * centerRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${startOuterX} ${startOuterY}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}
      L ${endInnerX} ${endInnerY}
      A ${centerRadius} ${centerRadius} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}
      Z
    `;
  };

  const totalSlices = groups.reduce((acc, group) => acc + group.slices.length, 0);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Groups:</span>
          <Input
            type="number"
            min="1"
            max="10"
            value={groupCount}
            onChange={(e) => updateGroups(Number(e.target.value), slicesPerGroup)}
            className="w-20"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Slices per group:</span>
          <Input
            type="number"
            min="1"
            max="20"
            value={slicesPerGroup}
            onChange={(e) => updateGroups(groupCount, Number(e.target.value))}
            className="w-20"
          />
        </div>
        <Button onClick={() => updateGroups(groupCount, slicesPerGroup)}>
          Update Groups
        </Button>
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
        
        {/* Outer circle slices */}
        {groups.map((group, groupIndex) => (
          group.slices.map((slice, sliceIndex) => (
            <path
              key={`${groupIndex}-${sliceIndex}`}
              d={createSlicePath(sliceIndex, groupIndex, totalSlices)}
              fill={slice.color}
            />
          ))
        ))}
      </svg>
    </div>
  );
};
