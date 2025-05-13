
import React, { useState, useEffect, useRef } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Group } from './types';
import { PathGenerators } from './PathGenerators';
import { CircleSlice } from './components/CircleSlice';
import { CircleDefinitions } from './components/CircleDefinitions';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

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
  const svgRef = useRef<SVGSVGElement>(null);

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

  const copyAsPNG = async () => {
    if (!svgRef.current) return;
    
    try {
      // Clone the SVG for modification without affecting displayed version
      const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      // Add inline CSS with font styles to ensure proper text rendering
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        text {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          paint-order: stroke;
          stroke: rgba(0,0,0,0.4);
          stroke-width: 1px;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `;
      svgElement.prepend(styleElement);
      
      // Embed external resources (like fonts)
      const serializer = new XMLSerializer();
      let svgData = serializer.serializeToString(svgElement);
      
      // Set proper XML namespace for SVG
      svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
      
      // Create a higher-resolution canvas (2x scale for better quality)
      const scale = 2; // Increase for higher resolution
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        toast.error("Failed to create canvas context");
        return;
      }
      
      // Set canvas dimensions with higher resolution
      canvas.width = config.svgSize * scale;
      canvas.height = config.svgSize * scale;
      
      // Create a Blob from the SVG data
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create an image from the SVG blob
      const img = new Image();
      img.onload = () => {
        // Clear canvas with transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Scale the context for higher resolution
        ctx.scale(scale, scale);
        
        // Draw the image onto the canvas with transparent background
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to blob and copy to clipboard
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const clipboardItem = new ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([clipboardItem]);
              toast.success("Copied to clipboard as PNG!");
            } catch (err) {
              console.error("Clipboard API error:", err);
              toast.error("Failed to copy to clipboard. Check console for details.");
            }
          }
        }, 'image/png');
        
        // Clean up
        URL.revokeObjectURL(url);
      };
      
      // Set the image source to the SVG URL
      img.src = url;
      
    } catch (error) {
      console.error("Error copying as PNG:", error);
      toast.error("Failed to copy as PNG. Check console for details.");
    }
  };

  const createTextPath = (groupIndex: number, group: Group) => {
    const availableAngle = 2 * Math.PI;
    const startAngle = (slicesBeforeGroup[groupIndex] * (availableAngle / totalSlices));
    const endAngle = startAngle + (group.slices.length * (availableAngle / totalSlices));
    const middleAngle = (startAngle + endAngle) / 2;
    const radius = 160;
    
    const textLength = (group.label || `Theme ${groupIndex + 1}`).length;
    const arcSpan = Math.max(0.2, Math.min(0.8, textLength * 0.04));
    
    const startX = config.outerRadius + Math.cos(middleAngle - arcSpan) * radius;
    const startY = config.outerRadius + Math.sin(middleAngle - arcSpan) * radius;
    const endX = config.outerRadius + Math.cos(middleAngle + arcSpan) * radius;
    const endY = config.outerRadius + Math.sin(middleAngle + arcSpan) * radius;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  const createSliceTextPath = (sliceIndex: number, groupIndex: number) => {
    const availableAngle = 2 * Math.PI;
    const sliceAngle = availableAngle / totalSlices;
    const absoluteSliceIndex = slicesBeforeGroup[groupIndex] + sliceIndex;
    const startAngle = absoluteSliceIndex * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    const middleAngle = (startAngle + endAngle) / 2;
    const radius = 280;
    
    const arcSpan = 0.2;
    
    const startX = config.outerRadius + Math.cos(middleAngle - arcSpan) * radius;
    const startY = config.outerRadius + Math.sin(middleAngle - arcSpan) * radius;
    const endX = config.outerRadius + Math.cos(middleAngle + arcSpan) * radius;
    const endY = config.outerRadius + Math.sin(middleAngle + arcSpan) * radius;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  return (
    <div className="flex flex-col items-center relative">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          onClick={copyAsPNG}
          variant="outline"
          className="bg-white/80 hover:bg-white text-black flex gap-2 items-center"
        >
          <Copy className="h-4 w-4" /> 
          Copy as PNG
        </Button>
      </div>
      <TooltipProvider>
        <svg 
          ref={svgRef}
          width={config.svgSize} 
          height={config.svgSize} 
          viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
        >
          <CircleDefinitions
            config={config}
            groups={groups}
            pathGenerators={pathGenerators}
          />

          <defs>
            {groups.map((group, index) => (
              <path
                key={`text-path-${index}`}
                id={`curve${index}`}
                d={createTextPath(index, group)}
                fill="none"
              />
            ))}
            {groups.map((group, groupIndex) => (
              group.slices.map((_, sliceIndex) => (
                <path
                  key={`slice-text-path-${groupIndex}-${sliceIndex}`}
                  id={`slice-curve-${groupIndex}-${sliceIndex}`}
                  d={createSliceTextPath(sliceIndex, groupIndex)}
                  fill="none"
                />
              ))
            ))}
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

          {groups.map((group, index) => (
            <path
              key={`middle-${index}`}
              d={pathGenerators.createMiddleCirclePath(index, group.slices.length)}
              fill={group.rankingColor}
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

          {groups.map((group, index) => (
            <text
              key={`theme-label-${index}`}
              className="text-xs font-medium uppercase"
              fill="white"
              style={{ zIndex: 50 }}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <textPath
                href={`#curve${index}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {group.label || `Theme ${index + 1}`}
              </textPath>
            </text>
          ))}

          {groups.map((group, groupIndex) => (
            group.slices.map((slice, sliceIndex) => (
              <text
                key={`slice-label-${groupIndex}-${sliceIndex}`}
                className="text-[0.5rem] font-medium uppercase"
                fill="white"
                style={{ zIndex: 50 }}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <textPath
                  href={`#slice-curve-${groupIndex}-${sliceIndex}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {slice.label || `Slice ${sliceIndex + 1}`}
                </textPath>
              </text>
            ))
          ))}
        </svg>
      </TooltipProvider>
    </div>
  );
};
