
import { CircleConfig } from './types';

export class PathGenerators {
  private config: CircleConfig;
  private totalSlices: number;
  private slicesBeforeGroup: number[];

  constructor(config: CircleConfig, totalSlices: number, slicesBeforeGroup: number[]) {
    this.config = config;
    this.totalSlices = totalSlices;
    this.slicesBeforeGroup = slicesBeforeGroup;
  }

  createMiddleCirclePath(groupIndex: number, groupSlices: number): string {
    const availableAngle = 2 * Math.PI;
    const startAngle = (this.slicesBeforeGroup[groupIndex] * (availableAngle / this.totalSlices));
    const endAngle = startAngle + (groupSlices * (availableAngle / this.totalSlices));

    const startX = this.config.outerRadius + Math.cos(startAngle) * this.config.middleRadius;
    const startY = this.config.outerRadius + Math.sin(startAngle) * this.config.middleRadius;
    const endX = this.config.outerRadius + Math.cos(endAngle) * this.config.middleRadius;
    const endY = this.config.outerRadius + Math.sin(endAngle) * this.config.middleRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${this.config.outerRadius} ${this.config.outerRadius}
      L ${startX} ${startY}
      A ${this.config.middleRadius} ${this.config.middleRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
  }

  createSlicePath(sliceIndex: number, groupIndex: number): string {
    const availableAngle = 2 * Math.PI;
    const sliceAngle = availableAngle / this.totalSlices;
    const absoluteSliceIndex = this.slicesBeforeGroup[groupIndex] + sliceIndex;
    const startAngle = absoluteSliceIndex * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const startOuterX = this.config.outerRadius + Math.cos(startAngle) * this.config.outerRadius;
    const startOuterY = this.config.outerRadius + Math.sin(startAngle) * this.config.outerRadius;
    const endOuterX = this.config.outerRadius + Math.cos(endAngle) * this.config.outerRadius;
    const endOuterY = this.config.outerRadius + Math.sin(endAngle) * this.config.outerRadius;
    const startInnerX = this.config.outerRadius + Math.cos(startAngle) * this.config.middleRadius;
    const startInnerY = this.config.outerRadius + Math.sin(startAngle) * this.config.middleRadius;
    const endInnerX = this.config.outerRadius + Math.cos(endAngle) * this.config.middleRadius;
    const endInnerY = this.config.outerRadius + Math.sin(endAngle) * this.config.middleRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${startOuterX} ${startOuterY}
      A ${this.config.outerRadius} ${this.config.outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}
      L ${endInnerX} ${endInnerY}
      A ${this.config.middleRadius} ${this.config.middleRadius} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}
      Z
    `;
  }

  createProgressCirclePath(sliceIndex: number, groupIndex: number, progressLevel: number): string {
    const progressRadius = 192 + ((progressLevel - 1) * this.config.progressStep);
    const availableAngle = 2 * Math.PI;
    const sliceAngle = availableAngle / this.totalSlices;
    const absoluteSliceIndex = this.slicesBeforeGroup[groupIndex] + sliceIndex;
    const startAngle = absoluteSliceIndex * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const startX = this.config.outerRadius + Math.cos(startAngle) * progressRadius;
    const startY = this.config.outerRadius + Math.sin(startAngle) * progressRadius;
    const endX = this.config.outerRadius + Math.cos(endAngle) * progressRadius;
    const endY = this.config.outerRadius + Math.sin(endAngle) * progressRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${startX} ${startY}
      A ${progressRadius} ${progressRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
    `;
  }
}
