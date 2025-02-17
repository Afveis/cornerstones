
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export interface TimelineEntryProps {
  date: Date;
  value: number;
  notes?: string;
}

export interface IndicatorTimelineProps {
  name: string;
  entries: TimelineEntryProps[];
}

export const TimelineEntry: React.FC<IndicatorTimelineProps> = ({ name, entries }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">{name}</h3>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8">
          {entries.map((entry, index) => (
            <div key={index} className="mb-4 relative">
              <div className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full -ml-1"></div>
              <div className="absolute left-1 top-3 w-[1px] h-full bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {format(entry.date, 'MMM d, yyyy')}
                </span>
                <span className="text-lg font-medium">Value: {entry.value}</span>
                {entry.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
