
export interface Slice {
  color: string;
  rankingColor: string;
  label: string;
  progress: number;
}

export interface Group {
  slices: Slice[];
  label: string;
  color: string;
  rankingColor: string;
  sliceCount: number;
}

export interface CircleConfig {
  centerRadius: number;
  middleRadius: number;
  outerRadius: number;
  progressStep: number;
  svgSize: number;
  strokeWidth: number;
  rankingStrokeWidth: number;
}
