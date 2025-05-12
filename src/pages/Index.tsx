
import React from 'react';
import { DiagramSection } from '@/components/CircleDiagram/components/DiagramSection';
import type { Indicator } from '@/components/CircleDiagram/types';
import { generateGroup } from '@/components/CircleDiagram/utils';

const indicators: Indicator[] = [
  {
    id: 1,
    name: "Indicator 1",
    centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png",
    groups: [
      { ...generateGroup(7, "#FF5733", "#FF8A65"), label: "Theme 1" },
      { ...generateGroup(7, "#33FF57", "#7FFF8E"), label: "Theme 2" },
      { ...generateGroup(7, "#5733FF", "#8A65FF"), label: "Theme 3" }
    ]
  },
  {
    id: 2,
    name: "Indicator 2",
    centerImage: "/lovable-uploads/3fbd1296-a4d4-4f64-a3c3-d480231aca1a.png",
    groups: [
      { ...generateGroup(7, "#FF5733", "#FF8A65"), label: "Theme 1" },
      { ...generateGroup(7, "#33FF57", "#7FFF8E"), label: "Theme 2" },
      { ...generateGroup(7, "#5733FF", "#8A65FF"), label: "Theme 3" }
    ]
  },
  {
    id: 3,
    name: "Indicator 3",
    centerImage: "/lovable-uploads/8cec5b95-3fc0-4810-aeb5-ba181501df06.png",
    groups: [
      { ...generateGroup(7, "#FF5733", "#FF8A65"), label: "Theme 1" },
      { ...generateGroup(7, "#33FF57", "#7FFF8E"), label: "Theme 2" },
      { ...generateGroup(7, "#5733FF", "#8A65FF"), label: "Theme 3" }
    ]
  },
  {
    id: 4,
    name: "Indicator 4",
    centerImage: "/lovable-uploads/ad390dfb-65ef-43f9-a728-84385f728052.png",
    groups: [
      { ...generateGroup(7, "#FF5733", "#FF8A65"), label: "Theme 1" },
      { ...generateGroup(7, "#33FF57", "#7FFF8E"), label: "Theme 2" },
      { ...generateGroup(7, "#5733FF", "#8A65FF"), label: "Theme 3" }
    ]
  },
  {
    id: 5,
    name: "Indicator 5",
    centerImage: "/lovable-uploads/dd6e8427-ee8e-4177-96da-27645ccd1d82.png",
    groups: [
      { ...generateGroup(7, "#FF5733", "#FF8A65"), label: "Theme 1" },
      { ...generateGroup(7, "#33FF57", "#7FFF8E"), label: "Theme 2" },
      { ...generateGroup(7, "#5733FF", "#8A65FF"), label: "Theme 3" }
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
