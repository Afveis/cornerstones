
import React, { useRef } from "react";
import { CircleDiagram } from "@/components/CircleDiagram/CircleDiagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupControls } from "@/components/CircleDiagram/GroupControls";
import { Group } from "@/components/CircleDiagram/types";
import { generateGroups } from "@/components/CircleDiagram/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index: React.FC = () => {
  const [groupCount, setGroupCount] = React.useState<number>(3);
  const [groups, setGroups] = React.useState<Group[]>(generateGroups(3));
  const [centerImage, setCenterImage] = React.useState<string>("/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateGroupCount = (newGroupCount: number) => {
    setGroupCount(newGroupCount);
    setGroups(prevGroups => generateGroups(newGroupCount, prevGroups));
  };

  const updateGroupConfig = (groupIndex: number, color?: string, rankingColor?: string, sliceCount?: number) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const currentGroup = { ...newGroups[groupIndex] };
      
      if (color !== undefined) {
        currentGroup.color = color;
        currentGroup.slices = currentGroup.slices.map(slice => ({
          ...slice,
          color
        }));
      }

      if (rankingColor !== undefined) {
        currentGroup.rankingColor = rankingColor;
        currentGroup.slices = currentGroup.slices.map(slice => ({
          ...slice,
          rankingColor
        }));
      }
      
      if (sliceCount !== undefined) {
        currentGroup.sliceCount = sliceCount;
        currentGroup.slices = Array.from({ length: sliceCount }, (_, i) => ({
          color: currentGroup.color,
          rankingColor: currentGroup.rankingColor,
          label: `Slice ${i + 1}`,
          progress: 0
        }));
      }
      
      newGroups[groupIndex] = currentGroup;
      return newGroups;
    });
  };

  const updateSliceProgress = (groupIndex: number, sliceIndex: number, progress: number) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const currentGroup = { ...newGroups[groupIndex] };
      const currentSlice = { ...currentGroup.slices[sliceIndex] };
      currentSlice.progress = Math.max(0, Math.min(5, progress));
      currentGroup.slices[sliceIndex] = currentSlice;
      newGroups[groupIndex] = currentGroup;
      return newGroups;
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
          groups={groups}
          groupCount={groupCount}
          onUpdateGroupCount={updateGroupCount}
          onUpdateGroupConfig={updateGroupConfig}
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
                  <span className="text-sm font-medium">Number of Groups:</span>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={groupCount}
                    onChange={(e) => updateGroupCount(Number(e.target.value))}
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
                  Choose Center Image
                </Button>
              </div>
              {groups.map((group, groupIndex) => (
                <GroupControls
                  key={groupIndex}
                  group={group}
                  groupIndex={groupIndex}
                  onUpdateConfig={updateGroupConfig}
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
