
import React from 'react';
import { TooltipContent } from "@/components/ui/tooltip";
import { Group, Slice } from '../types';

interface SliceTooltipProps {
  group: Group;
  slice: Slice;
}

export const SliceTooltip: React.FC<SliceTooltipProps> = ({ group, slice }) => {
  return (
    <TooltipContent 
      side="right" 
      sideOffset={5}
      align="center"
      className="p-4 w-[300px] space-y-3 bg-white shadow-lg rounded-lg border-none"
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{group.label}</h3>
        <h4 className="text-lg font-medium text-gray-800 mt-1">{slice.label}</h4>
        <div className="text-base font-medium text-gray-700 mt-1">
          Progress Level: {slice.progress}
        </div>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed">
        {slice.description || "No description available."}
      </p>
    </TooltipContent>
  );
};
