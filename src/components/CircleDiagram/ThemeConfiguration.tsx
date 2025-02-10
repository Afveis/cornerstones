
import React from "react";
import { Input } from "@/components/ui/input";
import { Group, GlobalConfig } from "./types";

interface ThemeConfigurationProps {
  globalConfig: GlobalConfig;
  onUpdateGlobalConfig: (newThemeCount?: number, newSliceCount?: number) => void;
  onUpdateThemeConfig: (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number) => void;
}

export const ThemeConfiguration: React.FC<ThemeConfigurationProps> = ({
  globalConfig,
  onUpdateGlobalConfig,
  onUpdateThemeConfig,
}) => {
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
            <span className="text-sm font-medium min-w-[100px]">{theme.label}</span>
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
              <span className="text-sm">Ranking Color:</span>
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
