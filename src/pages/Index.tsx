
import React, { useRef } from "react";
import { CircleDiagram } from "@/components/CircleDiagram/CircleDiagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupControls } from "@/components/CircleDiagram/GroupControls";
import { Group } from "@/components/CircleDiagram/types";
import { generateGroups } from "@/components/CircleDiagram/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index: React.FC = () => {
  const [themeCount, setThemeCount] = React.useState<number>(3);
  const [themes, setThemes] = React.useState<Group[]>(generateGroups(3));
  const [centerImage, setCenterImage] = React.useState<string>("/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateThemeCount = (newThemeCount: number) => {
    setThemeCount(newThemeCount);
    setThemes(prevThemes => generateGroups(newThemeCount, prevThemes));
  };

  const updateThemeConfig = (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number) => {
    setThemes(prevThemes => {
      const newThemes = [...prevThemes];
      const currentTheme = { ...newThemes[themeIndex] };
      
      if (color !== undefined) {
        currentTheme.color = color;
        currentTheme.slices = currentTheme.slices.map(slice => ({
          ...slice,
          color
        }));
      }

      if (rankingColor !== undefined) {
        currentTheme.rankingColor = rankingColor;
        currentTheme.slices = currentTheme.slices.map(slice => ({
          ...slice,
          rankingColor
        }));
      }
      
      if (sliceCount !== undefined) {
        currentTheme.sliceCount = sliceCount;
        currentTheme.slices = Array.from({ length: sliceCount }, (_, i) => ({
          color: currentTheme.color,
          rankingColor: currentTheme.rankingColor,
          label: `Slice ${i + 1}`,
          progress: 0
        }));
      }
      
      newThemes[themeIndex] = currentTheme;
      return newThemes;
    });
  };

  const updateSliceProgress = (themeIndex: number, sliceIndex: number, progress: number) => {
    setThemes(prevThemes => {
      const newThemes = [...prevThemes];
      const currentTheme = { ...newThemes[themeIndex] };
      const currentSlice = { ...currentTheme.slices[sliceIndex] };
      currentSlice.progress = Math.max(0, Math.min(5, progress));
      currentTheme.slices[sliceIndex] = currentSlice;
      newThemes[themeIndex] = currentTheme;
      return newThemes;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCenterImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="flex-1 bg-white fixed left-0 right-[600px] top-0 bottom-0 flex items-center justify-center">
        <CircleDiagram 
          groups={themes}
          groupCount={themeCount}
          onUpdateGroupCount={updateThemeCount}
          onUpdateGroupConfig={updateThemeConfig}
          onUpdateProgress={updateSliceProgress}
          centerImage={centerImage}
        />
      </div>
      <div className="w-[600px] fixed right-0 top-0 bottom-0 bg-[#F3F3F3]">
        <ScrollArea className="h-full">
          <div className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Number of Themes:</span>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={themeCount}
                    onChange={(e) => updateThemeCount(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
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
              {themes.map((theme, themeIndex) => (
                <GroupControls
                  key={themeIndex}
                  group={theme}
                  groupIndex={themeIndex}
                  onUpdateConfig={updateThemeConfig}
                  onUpdateProgress={updateSliceProgress}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default Index;
