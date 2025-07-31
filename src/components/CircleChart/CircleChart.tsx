import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DataPoint {
  category: string;
  quote: string;
  position?: number; // 0-100 position on the agreement scale
}

interface CircleChartProps {
  data: DataPoint[];
}

export const CircleChart: React.FC<CircleChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // Get unique categories and assign colors
  const categories = [...new Set(data.map(d => d.category))];
  const colors = [
    'hsl(var(--destructive))', // Red for disagreement
    'hsl(var(--muted-foreground))', // Gray for neutral
    'hsl(var(--primary))', // Green for agreement
  ];

  // Group data by category and calculate positions
  const processedData = data.map((point, index) => {
    const categoryIndex = categories.indexOf(point.category);
    // Create a spread across the chart based on category
    const basePosition = (categoryIndex / (categories.length - 1)) * 100;
    // Add some random offset for visual appeal
    const randomOffset = (Math.random() - 0.5) * 20;
    const position = Math.max(0, Math.min(100, basePosition + randomOffset));
    
    return {
      ...point,
      position,
      color: colors[categoryIndex % colors.length],
      id: index
    };
  });

  // Group by position ranges for stacking
  const positionGroups: { [key: number]: typeof processedData } = {};
  processedData.forEach(point => {
    const groupKey = Math.floor(point.position / 5) * 5; // Group by 5% ranges
    if (!positionGroups[groupKey]) {
      positionGroups[groupKey] = [];
    }
    positionGroups[groupKey].push(point);
  });

  // Group data by category
  const categorizedData: { [key: string]: typeof processedData } = {};
  processedData.forEach(point => {
    if (!categorizedData[point.category]) {
      categorizedData[point.category] = [];
    }
    categorizedData[point.category].push(point);
  });

  return (
    <div className="w-full bg-background p-6 rounded-lg border">
      {/* Category Headers */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
        {categories.map((category) => (
          <div key={category} className="text-center">
            <h3 className="font-medium text-sm uppercase tracking-wide text-foreground">
              {category}
            </h3>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="relative h-64">
        <div className="grid gap-4 h-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
          {categories.map((category, categoryIndex) => (
            <div key={category} className="relative border-l border-border pl-4">
              <TooltipProvider>
                {categorizedData[category]?.map((point, pointIndex) => (
                  <Tooltip key={`${point.id}-${pointIndex}`}>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute w-3 h-3 rounded-full cursor-pointer transition-all duration-200 hover:scale-125"
                        style={{
                          left: `${(pointIndex % 3) * 20 + 10}px`,
                          top: `${Math.floor(pointIndex / 3) * 20 + 20}px`,
                          backgroundColor: point.color,
                        }}
                        onMouseEnter={() => setHoveredPoint(point)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="max-w-xs p-3 bg-popover border shadow-lg"
                    >
                      <div className="space-y-2">
                        <div className="font-medium text-sm">{point.category}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {point.quote}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          {categories.map((category, index) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs">
          ALL IDEAS, SORTED BY AGREEMENT RATE
        </div>
      </div>
    </div>
  );
};