import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DataPoint {
  category: string;
  quote: string;
}

interface ProcessedDataPoint extends DataPoint {
  id: number;
  color: string;
}

interface CircleChartProps {
  data: DataPoint[];
}

export const CircleChart: React.FC<CircleChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ProcessedDataPoint | null>(null);

  // Get unique categories and assign colors
  const categories = [...new Set(data.map(d => d.category))];
  const colors = [
    'hsl(320, 30%, 65%)',  // Pink/purple
    'hsl(200, 25%, 60%)',  // Blue/grey
    'hsl(320, 35%, 55%)',  // Darker pink/purple
    'hsl(40, 70%, 70%)',   // Yellow/orange
    'hsl(90, 35%, 65%)',   // Green
  ];

  // Process data with colors and IDs
  const processedData: ProcessedDataPoint[] = data.map((point, index) => ({
    ...point,
    id: index,
    color: colors[categories.indexOf(point.category) % colors.length]
  }));

  // Group data by category for column display
  const categorizedData: { [key: string]: ProcessedDataPoint[] } = {};
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
      <div className="relative min-h-96">
        <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
          {categories.map((category) => (
            <div key={category} className="flex flex-col items-center justify-end space-y-4 min-h-96">
              <TooltipProvider>
                <div className="flex flex-wrap gap-2 justify-center max-w-48">
                  {categorizedData[category]?.map((point, pointIndex) => (
                    <Tooltip key={point.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 hover:shadow-lg border border-border/20"
                          style={{
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
                            "{point.quote}"
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
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
          ALL QUOTES, GROUPED BY THEME
        </div>
      </div>
    </div>
  );
};