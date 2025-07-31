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

  return (
    <div className="w-full bg-background p-6 rounded-lg border">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-start">
          <span className="font-medium">0%</span>
          <span>disagree</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">50/50</span>
          <span>split</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-medium">100%</span>
          <span>agree</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-64 border-b border-border">
        <TooltipProvider>
          {Object.entries(positionGroups).map(([groupKey, points]) => {
            const position = parseInt(groupKey);
            return points.map((point, stackIndex) => (
              <Tooltip key={`${point.id}-${stackIndex}`}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute w-3 h-3 rounded-full cursor-pointer transition-all duration-200 hover:scale-125"
                    style={{
                      left: `${position}%`,
                      bottom: `${(stackIndex * 16) + 20}px`,
                      backgroundColor: point.color,
                      transform: 'translateX(-50%)',
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
            ));
          })}
        </TooltipProvider>

        {/* Scale markers */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-border" />
        <div className="absolute bottom-0 left-0 w-px h-2 bg-border" />
        <div className="absolute bottom-0 left-1/2 w-px h-2 bg-border transform -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-px h-2 bg-border" />
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