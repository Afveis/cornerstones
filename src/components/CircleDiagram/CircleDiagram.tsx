
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Slice {
  color: string;
  label: string;
}

const generateSlices = (count: number): Slice[] => {
  const colors = [
    '#F1F0FB', '#E5DEFF', '#FFDEE2', '#FEC6A1', '#FEF7CD',
    '#F2FCE2', '#D3E4FD', '#FDE1D3', '#8E9196'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    color: colors[i % colors.length],
    label: `Slice ${i + 1}`
  }));
};

export const CircleDiagram: React.FC = () => {
  const [sliceCount, setSliceCount] = useState<number>(22);
  const [slices, setSlices] = useState<Slice[]>(generateSlices(22));
  const [centerImage, setCenterImage] = useState<string>("/lovable-uploads/ad390dfb-65ef-43f9-a728-84385f728052.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const centerRadius = 150;
  const outerRadius = 300;
  const svgSize = outerRadius * 2 + 100;

  const updateSlices = (count: number) => {
    setSliceCount(count);
    setSlices(generateSlices(count));
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

  const createSlicePath = (index: number, total: number) => {
    const anglePerSlice = (2 * Math.PI) / total;
    const startAngle = index * anglePerSlice;
    const endAngle = (index + 1) * anglePerSlice;

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

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex items-center gap-4">
        <Input
          type="number"
          min="1"
          max="50"
          value={sliceCount}
          onChange={(e) => updateSlices(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={() => updateSlices(sliceCount)}>Update Slices</Button>
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
        {slices.map((slice, index) => (
          <path
            key={index}
            d={createSlicePath(index, slices.length)}
            fill={slice.color}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};
