
import { Indicator, GlobalConfig } from '../types';
import { generateGroups } from '../utils';

const initialGroups = generateGroups(3);

export const initialIndicators: Indicator[] = [
  {
    id: 1,
    name: "Indicator 1",
    centerImage: "/lovable-uploads/72ca0fbe-0ce5-4bbe-86ee-8cd55cbf0521.png",
    groups: generateGroups(3),
  },
  {
    id: 2,
    name: "Indicator 2",
    centerImage: "/lovable-uploads/3fbd1296-a4d4-4f64-a3c3-d480231aca1a.png",
    groups: generateGroups(3),
  },
  {
    id: 3,
    name: "Indicator 3",
    centerImage: "/lovable-uploads/8cec5b95-3fc0-4810-aeb5-ba181501df06.png",
    groups: generateGroups(3),
  },
  {
    id: 4,
    name: "Indicator 4",
    centerImage: "/lovable-uploads/1364c0b0-371e-468f-a8d7-baa93089c1a7.png",
    groups: generateGroups(3),
  },
  {
    id: 5,
    name: "Indicator 5",
    centerImage: "/lovable-uploads/3b4add13-7d48-4922-bacc-6f8fbd6523f4.png",
    groups: generateGroups(3),
  }
];

export const initialGlobalConfig: GlobalConfig = {
  themeCount: 3,
  sliceCount: 7,
  groups: initialGroups,
};
