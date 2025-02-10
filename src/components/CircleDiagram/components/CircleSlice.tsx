
import React from 'react';
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Group, Slice } from '../types';
import { PathGenerators } from '../PathGenerators';
import { SliceTooltip } from './SliceTooltip';

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
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g>
          <path
            d={pathGenerators.createSlicePath(sliceIndex, groupIndex)}
            fill={group.color}
            stroke="white"
            strokeWidth={config.strokeWidth}
            className="cursor-pointer hover:opacity-90 transition-opacity"
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
        </g>
      </TooltipTrigger>
      <SliceTooltip group={group} slice={slice} />
    </Tooltip>
  );
};
