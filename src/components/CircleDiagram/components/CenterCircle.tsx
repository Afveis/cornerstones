
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface CenterCircleProps {
  centerImage: string;
  config: {
    centerRadius: number;
    outerRadius: number;
  };
  onImageChange?: (newImage: string) => void;
}

export const CenterCircle: React.FC<CenterCircleProps> = ({ 
  centerImage, 
  config,
  onImageChange 
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
          const imageDataUrl = e.target?.result as string;
          if (imageDataUrl && onImageChange) {
            onImageChange(imageDataUrl);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
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
  );
};
