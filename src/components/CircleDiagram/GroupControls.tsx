
import React from 'react';
import { Input } from "@/components/ui/input";
import { Group } from './types';

interface GroupControlsProps {
  group: Group;
  groupIndex: number;
  onUpdateConfig: (groupIndex: number, color?: string, rankingColor?: string, sliceCount?: number) => void;
  onUpdateProgress: (groupIndex: number, sliceIndex: number, progress: number) => void;
}

export const GroupControls: React.FC<GroupControlsProps> = ({
  group,
  groupIndex,
  onUpdateProgress,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        {group.slices.map((slice, sliceIndex) => (
          <div key={sliceIndex} className="flex items-center gap-2">
            <span className="text-sm">{group.label} - Slice {sliceIndex + 1} Progress:</span>
            <Input
              type="number"
              min="0"
              max="5"
              value={slice.progress}
              onChange={(e) => onUpdateProgress(groupIndex, sliceIndex, Number(e.target.value))}
              className="w-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
