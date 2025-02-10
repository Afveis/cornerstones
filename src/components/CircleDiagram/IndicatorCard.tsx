
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
      className={`p-4 cursor-pointer transition-all hover:scale-105 ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className="w-20 h-20 relative">
        <img 
          src={indicator.centerImage} 
          alt={`Indicator ${indicator.id}`}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-center mt-2">Indicator {indicator.id}</p>
    </Card>
  );
};
