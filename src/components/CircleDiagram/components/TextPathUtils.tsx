
import { Group } from "../types";

export const createTextPath = (
  groupIndex: number,
  group: Group,
  outerRadius: number,
  slicesBeforeGroup: number[],
  totalSlices: number
) => {
  const availableAngle = 2 * Math.PI;
  const startAngle = (slicesBeforeGroup[groupIndex] * (availableAngle / totalSlices));
  const endAngle = startAngle + (group.slices.length * (availableAngle / totalSlices));
  const middleAngle = (startAngle + endAngle) / 2;
  const radius = 160;
  
  const textLength = (group.label || `Theme ${groupIndex + 1}`).length;
  const arcSpan = Math.max(0.2, Math.min(0.8, textLength * 0.04));
  
  const startX = outerRadius + Math.cos(middleAngle - arcSpan) * radius;
  const startY = outerRadius + Math.sin(middleAngle - arcSpan) * radius;
  const endX = outerRadius + Math.cos(middleAngle + arcSpan) * radius;
  const endY = outerRadius + Math.sin(middleAngle + arcSpan) * radius;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
};

export const createSliceTextPath = (
  sliceIndex: number,
  groupIndex: number,
  outerRadius: number,
  slicesBeforeGroup: number[],
  totalSlices: number
) => {
  const availableAngle = 2 * Math.PI;
  const sliceAngle = availableAngle / totalSlices;
  const absoluteSliceIndex = slicesBeforeGroup[groupIndex] + sliceIndex;
  const startAngle = absoluteSliceIndex * sliceAngle;
  const endAngle = startAngle + sliceAngle;
  const middleAngle = (startAngle + endAngle) / 2;
  const radius = 280;
  
  const arcSpan = 0.2;
  
  const startX = outerRadius + Math.cos(middleAngle - arcSpan) * radius;
  const startY = outerRadius + Math.sin(middleAngle - arcSpan) * radius;
  const endX = outerRadius + Math.cos(middleAngle + arcSpan) * radius;
  const endY = outerRadius + Math.sin(middleAngle + arcSpan) * radius;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
};
