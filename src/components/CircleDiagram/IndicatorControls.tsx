
import React, { useState, useEffect } from "react";
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
  onUpdateSliceLabel?: (groupIndex: number, sliceIndex: number, label: string) => void;
}

export const IndicatorControls: React.FC<IndicatorControlsProps> = ({
  activeIndicator,
  indicator,
  onUpdateProgress,
  onImageUpload,
  fileInputRef,
  onUpdateIndicatorName,
  onUpdateSliceLabel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(`Indicator ${activeIndicator}`);
  const [editingSlice, setEditingSlice] = useState<{groupIndex: number, sliceIndex: number, value: string} | null>(null);

  // Update the editing name when activeIndicator changes
  useEffect(() => {
    setEditingName(indicator.name || `Indicator ${activeIndicator}`);
  }, [indicator, activeIndicator]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditingName(indicator.name || `Indicator ${activeIndicator}`);
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

  const handleSliceLabelChange = (groupIndex: number, sliceIndex: number, label: string) => {
    onUpdateSliceLabel?.(groupIndex, sliceIndex, label);
  };

  const handleSliceLabelEdit = (groupIndex: number, sliceIndex: number, currentLabel: string) => {
    setEditingSlice({groupIndex, sliceIndex, value: currentLabel});
  };

  const handleSliceLabelSave = () => {
    if (editingSlice) {
      handleSliceLabelChange(editingSlice.groupIndex, editingSlice.sliceIndex, editingSlice.value);
      setEditingSlice(null);
    }
  };

  const handleSliceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSliceLabelSave();
    } else if (e.key === 'Escape') {
      setEditingSlice(null);
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
            {indicator.name || `Indicator ${activeIndicator}`}
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
            <div key={`${groupIndex}-${sliceIndex}`} className="flex flex-col gap-2 border p-2 rounded">
              <div className="flex items-center gap-2 justify-between">
                {editingSlice && editingSlice.groupIndex === groupIndex && editingSlice.sliceIndex === sliceIndex ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editingSlice.value}
                      onChange={(e) => setEditingSlice({...editingSlice, value: e.target.value})}
                      onKeyDown={handleSliceKeyDown}
                      onBlur={handleSliceLabelSave}
                      autoFocus
                      className="h-8"
                    />
                    <Button
                      size="sm"
                      onClick={handleSliceLabelSave}
                      className="h-8"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex-1 cursor-pointer hover:text-blue-600 truncate" 
                    onClick={() => handleSliceLabelEdit(groupIndex, sliceIndex, slice.label)}
                    title="Click to edit"
                  >
                    {slice.label || `${group.label} - Slice ${sliceIndex + 1}`}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Progress:</span>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={slice.progress}
                  onChange={(e) => onUpdateProgress(groupIndex, sliceIndex, Number(e.target.value))}
                  className="w-20 h-8"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
