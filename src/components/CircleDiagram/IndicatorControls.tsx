
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Indicator } from "./types";

interface IndicatorControlsProps {
  activeIndicator: number;
  indicator: Indicator;
  onUpdateProgress: (themeIndex: number, sliceIndex: number, progress: number) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onUpdateIndicatorName?: (id: number, name: string) => void;
}

export const IndicatorControls: React.FC<IndicatorControlsProps> = ({
  activeIndicator,
  indicator,
  onUpdateProgress,
  onImageUpload,
  fileInputRef,
  onUpdateIndicatorName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(`Indicator ${activeIndicator}`);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditingName(`Indicator ${activeIndicator}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUpdateIndicatorName?.(activeIndicator, editingName);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      onUpdateIndicatorName?.(activeIndicator, editingName);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
            className="w-[200px]"
          />
        ) : (
          <h2 
            className="text-lg font-semibold cursor-pointer"
            onDoubleClick={handleDoubleClick}
          >
            Indicator {activeIndicator}
          </h2>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageUpload}
          accept="image/*"
          className="hidden"
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          Replace illustration
        </Button>
      </div>
      {indicator.groups.map((group, groupIndex) => (
        <div key={groupIndex} className="grid grid-cols-2 gap-4">
          {group.slices.map((slice, sliceIndex) => (
            <div key={`${groupIndex}-${sliceIndex}`} className="flex items-center gap-2">
              <span className="text-sm">{group.label} - Slice {sliceIndex + 1}:</span>
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
      ))}
    </div>
  );
};
