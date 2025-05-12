
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Group, GlobalConfig } from "./types";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ThemeConfigurationProps {
  globalConfig: GlobalConfig;
  onUpdateGlobalConfig: (newThemeCount?: number, newSliceCount?: number) => void;
  onUpdateThemeConfig: (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number, label?: string) => void;
}

export const ThemeConfiguration: React.FC<ThemeConfigurationProps> = ({
  globalConfig,
  onUpdateGlobalConfig,
  onUpdateThemeConfig,
}) => {
  const [editingTheme, setEditingTheme] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const handleDoubleClick = (index: number, currentLabel: string) => {
    setEditingTheme(index);
    setEditingLabel(currentLabel);
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      onUpdateThemeConfig(index, undefined, undefined, undefined, editingLabel);
      setEditingTheme(null);
    } else if (e.key === 'Escape') {
      setEditingTheme(null);
    }
  };

  const handleLabelBlur = (index: number) => {
    if (editingTheme !== null) {
      onUpdateThemeConfig(index, undefined, undefined, undefined, editingLabel);
      setEditingTheme(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold">Theme Configuration</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Number of Themes:</span>
          <Input
            type="number"
            min="1"
            max="10"
            value={globalConfig.themeCount}
            onChange={(e) => onUpdateGlobalConfig(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
      {globalConfig.groups.map((theme, themeIndex) => (
        <div key={themeIndex} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {editingTheme === themeIndex ? (
              <Input
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onKeyDown={(e) => handleLabelKeyDown(e, themeIndex)}
                onBlur={() => handleLabelBlur(themeIndex)}
                autoFocus
                className="w-[100px]"
              />
            ) : (
              <span 
                className="text-sm font-medium min-w-[100px] cursor-pointer"
                onDoubleClick={() => handleDoubleClick(themeIndex, theme.label || `Theme ${themeIndex + 1}`)}
              >
                {theme.label || `Theme ${themeIndex + 1}`}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm">Slice Color:</span>
              <input
                type="color"
                value={theme.color}
                onChange={(e) => onUpdateThemeConfig(themeIndex, e.target.value)}
                className="w-8 h-8 !p-0 rounded-md overflow-hidden"
              />
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Middle Circle Color:</span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">This color is used for the middle circle and progress indicators.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <input
                type="color"
                value={theme.rankingColor}
                onChange={(e) => onUpdateThemeConfig(themeIndex, undefined, e.target.value)}
                className="w-8 h-8 !p-0 rounded-md overflow-hidden"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Slices:</span>
              <Input
                type="number"
                min="1"
                max="20"
                value={theme.sliceCount}
                onChange={(e) => onUpdateThemeConfig(themeIndex, undefined, undefined, Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
          <div className="border-b border-gray-200 opacity-30" />
        </div>
      ))}
    </div>
  );
};
