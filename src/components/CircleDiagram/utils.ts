
import { Group } from './types';

export const generateGroup = (sliceCount: number, color: string = '#E2E2E2', rankingColor: string = '#8B5CF6'): Group => ({
  label: `Theme`,
  slices: Array.from({ length: sliceCount }, (_, i) => ({
    color,
    rankingColor,
    label: `Slice ${i + 1}`,
    progress: 0,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque."
  })),
  color,
  rankingColor,
  sliceCount
});

export const generateGroups = (themeCount: number, existingThemes: Group[] = []): Group[] => {
  return Array.from({ length: themeCount }, (_, i) => {
    if (existingThemes[i]) {
      return existingThemes[i];
    }
    return {
      ...generateGroup(7),
      label: `Theme ${i + 1}`
    };
  });
};
