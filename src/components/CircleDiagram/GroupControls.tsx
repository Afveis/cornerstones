
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
  onUpdateConfig,
  onUpdateProgress,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium min-w-[100px]">{group.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm">Slice Color:</span>
          <input
            type="color"
            value={group.color}
            onChange={(e) => onUpdateConfig(groupIndex, e.target.value, undefined)}
            className="w-14 h-14 p-1 rounded-full overflow-hidden cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Ranking Color:</span>
          <input
            type="color"
            value={group.rankingColor}
            onChange={(e) => onUpdateConfig(groupIndex, undefined, e.target.value)}
            className="w-14 h-14 p-1 rounded-full overflow-hidden cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Slices:</span>
          <Input
            type="number"
            min="1"
            max="20"
            value={group.sliceCount}
            onChange={(e) => onUpdateConfig(groupIndex, undefined, undefined, Number(e.target.value))}
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
              onChange={(e) => onUpdateProgress(groupIndex, sliceIndex, Number(e.target.value))}
              className="w-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
