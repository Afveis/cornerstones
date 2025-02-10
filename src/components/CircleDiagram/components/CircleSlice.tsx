
import React, { useState } from 'react';
import {
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Group, Slice } from '../types';
import { PathGenerators } from '../PathGenerators';
import { SliceTooltip } from './SliceTooltip';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface CircleSliceProps {
  group: Group;
  slice: Slice;
  sliceIndex: number;
  groupIndex: number;
  pathGenerators: PathGenerators;
  config: {
    strokeWidth: number;
    rankingStrokeWidth: number;
  };
}

export const CircleSlice: React.FC<CircleSliceProps> = ({
  group,
  slice,
  sliceIndex,
  groupIndex,
  pathGenerators,
  config,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleProgressChange = (increment: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const changeEvent = new CustomEvent('progress-change', { 
      bubbles: true,
      detail: {
        groupIndex,
        sliceIndex,
        progress: increment ? slice.progress + 1 : slice.progress - 1
      }
    });
    fileInput?.dispatchEvent(changeEvent);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g 
          className="cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <path
            d={pathGenerators.createSlicePath(sliceIndex, groupIndex)}
            fill={group.color}
            stroke="white"
            strokeWidth={config.strokeWidth}
            className="hover:opacity-90 transition-opacity"
          />
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
          {isHovered && (
            <>
              <foreignObject
                x={pathGenerators.getSliceCenter(sliceIndex, groupIndex).x - 60}
                y={pathGenerators.getSliceCenter(sliceIndex, groupIndex).y - 20}
                width={120}
                height={40}
                style={{ pointerEvents: 'none' }}
              >
                <div className="flex justify-center items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                    onClick={(e) => handleProgressChange(false, e)}
                    disabled={slice.progress <= 0}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                    onClick={(e) => handleProgressChange(true, e)}
                    disabled={slice.progress >= 5}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </foreignObject>
            </>
          )}
        </g>
      </TooltipTrigger>
      <SliceTooltip group={group} slice={slice} />
    </Tooltip>
  );
};
