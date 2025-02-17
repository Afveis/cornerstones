
import React from 'react';
import { DiagramSection } from '@/components/CircleDiagram/components/DiagramSection';
import type { Indicator } from '@/components/CircleDiagram/types';

const indicators: Indicator[] = [
  {
    id: 1,
    name: "Indicator 1",
    centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png",
    groups: [
      { id: 1, progress: 0.75, color: "#FF5733" },
      { id: 2, progress: 0.45, color: "#33FF57" },
      { id: 3, progress: 0.90, color: "#5733FF" }
    ]
  },
  {
    id: 2,
    name: "Indicator 2",
    centerImage: "/lovable-uploads/3fbd1296-a4d4-4f64-a3c3-d480231aca1a.png",
    groups: [
      { id: 1, progress: 0.60, color: "#FF5733" },
      { id: 2, progress: 0.80, color: "#33FF57" },
      { id: 3, progress: 0.35, color: "#5733FF" }
    ]
  },
  {
    id: 3,
    name: "Indicator 3",
    centerImage: "/lovable-uploads/8cec5b95-3fc0-4810-aeb5-ba181501df06.png",
    groups: [
      { id: 1, progress: 0.85, color: "#FF5733" },
      { id: 2, progress: 0.55, color: "#33FF57" },
      { id: 3, progress: 0.70, color: "#5733FF" }
    ]
  },
  {
    id: 4,
    name: "Indicator 4",
    centerImage: "/lovable-uploads/ad390dfb-65ef-43f9-a728-84385f728052.png",
    groups: [
      { id: 1, progress: 0.40, color: "#FF5733" },
      { id: 2, progress: 0.95, color: "#33FF57" },
      { id: 3, progress: 0.65, color: "#5733FF" }
    ]
  },
  {
    id: 5,
    name: "Indicator 5",
    centerImage: "/lovable-uploads/dd6e8427-ee8e-4177-96da-27645ccd1d82.png",
    groups: [
      { id: 1, progress: 0.70, color: "#FF5733" },
      { id: 2, progress: 0.30, color: "#33FF57" },
      { id: 3, progress: 0.85, color: "#5733FF" }
    ]
  }
];

const Index = () => {
  return (
    <div className="container mx-auto">
      <DiagramSection />
    </div>
  );
};

export default Index;
