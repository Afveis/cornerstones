
import React from "react";
import { Indicator } from "./types";
import { IndicatorCard } from "./IndicatorCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface IndicatorListProps {
  indicators: Indicator[];
  activeIndicator: number;
  onSelectIndicator: (id: number) => void;
  onAddIndicator: () => void;
}

export const IndicatorList: React.FC<IndicatorListProps> = ({
  indicators,
  activeIndicator,
  onSelectIndicator,
  onAddIndicator,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {indicators.map((indicator) => (
        <IndicatorCard
          key={indicator.id}
          indicator={indicator}
          isActive={indicator.id === activeIndicator}
          onClick={() => onSelectIndicator(indicator.id)}
        />
      ))}
      <Button 
        onClick={onAddIndicator} 
        variant="outline" 
        className="w-24 h-24 flex flex-col items-center justify-center"
      >
        <PlusCircle className="mb-1" />
        <span className="text-xs">Add new</span>
      </Button>
    </div>
  );
};
