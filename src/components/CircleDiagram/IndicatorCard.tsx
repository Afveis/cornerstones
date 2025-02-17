
import React from "react";
import { Card } from "@/components/ui/card";
import { Indicator } from "./types";

interface IndicatorCardProps {
  indicator: Indicator;
  isActive: boolean;
  onClick: () => void;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  indicator,
  isActive,
  onClick,
}) => {
  return (
    <Card
      className={`flex-1 p-4 cursor-pointer transition-all hover:scale-105 ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 relative aspect-square">
          <img 
            src={indicator.centerImage} 
            alt={`Indicator ${indicator.id}`}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="mt-2 text-center truncate">Indicator {indicator.id}</p>
      </div>
    </Card>
  );
};
