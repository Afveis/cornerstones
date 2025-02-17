
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Check, X } from "lucide-react";

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
  const { toast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleEdit = (index: number, currentValue: number) => {
    setEditingIndex(index);
    setEditValue(currentValue.toString());
  };

  const handleSave = (index: number) => {
    const newValue = parseFloat(editValue);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically update the value in your state management system
    toast({
      title: "Value updated",
      description: `Updated value to ${newValue}`,
    });
    setEditingIndex(null);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">{name}</h3>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <div className="flex min-w-max pb-8">
            {entries.map((entry, index) => (
              <div key={index} className="relative px-8 first:pl-0">
                {/* Connector Line */}
                {index < entries.length - 1 && (
                  <div className="absolute top-2 left-[50px] right-0 h-[2px] bg-gray-200" />
                )}
                
                {/* Timeline Point and Content */}
                <div className="relative">
                  {/* Timeline Point */}
                  <div className="w-4 h-4 bg-primary rounded-full mb-2 z-10 relative" />
                  
                  {/* Content */}
                  <div className="min-w-[150px]">
                    <span className="text-sm text-muted-foreground block">
                      {format(entry.date, 'MMM d, yyyy')}
                    </span>
                    
                    {editingIndex === index ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSave(index)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingIndex(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">
                          Value: {entry.value}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(index, entry.value)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
