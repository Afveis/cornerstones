
import React from "react";
import { TimelineEntry, type IndicatorTimelineProps } from "@/components/TimelineEntry";

const mockData: IndicatorTimelineProps[] = [
  {
    name: "Indicator 1",
    entries: [
      {
        date: new Date('2024-01-15'),
        value: 75,
        notes: "Significant improvement in Q1"
      },
      {
        date: new Date('2024-02-20'),
        value: 82,
        notes: "Implemented new strategies"
      },
      {
        date: new Date('2024-03-10'),
        value: 88,
        notes: "Exceeded quarterly targets"
      }
    ]
  },
  {
    name: "Indicator 2",
    entries: [
      {
        date: new Date('2024-01-10'),
        value: 60,
        notes: "Initial assessment"
      },
      {
        date: new Date('2024-02-15'),
        value: 65,
        notes: "Modest improvement"
      },
      {
        date: new Date('2024-03-15'),
        value: 70,
        notes: "Steady progress"
      }
    ]
  },
  {
    name: "Indicator 3",
    entries: [
      {
        date: new Date('2024-01-05'),
        value: 85,
        notes: "Strong start to the year"
      },
      {
        date: new Date('2024-02-10'),
        value: 83,
        notes: "Minor setback"
      },
      {
        date: new Date('2024-03-20'),
        value: 89,
        notes: "Recovery and improvement"
      }
    ]
  },
  {
    name: "Indicator 4",
    entries: [
      {
        date: new Date('2024-01-20'),
        value: 40,
        notes: "Areas for improvement identified"
      },
      {
        date: new Date('2024-02-25'),
        value: 55,
        notes: "Implementation of new processes"
      },
      {
        date: new Date('2024-03-25'),
        value: 68,
        notes: "Significant progress made"
      }
    ]
  },
  {
    name: "Indicator 5",
    entries: [
      {
        date: new Date('2024-01-25'),
        value: 70,
        notes: "Good initial performance"
      },
      {
        date: new Date('2024-02-28'),
        value: 75,
        notes: "Continuous improvement"
      },
      {
        date: new Date('2024-03-30'),
        value: 80,
        notes: "Reached target milestone"
      }
    ]
  }
];

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Indicator Timelines</h1>
      <div className="grid gap-6">
        {mockData.map((indicator, index) => (
          <TimelineEntry
            key={index}
            name={indicator.name}
            entries={indicator.entries}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
