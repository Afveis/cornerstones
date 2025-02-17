
export interface Slice {
  color: string;
  rankingColor: string;
  label: string;
  progress: number;
  description?: string;
}

export interface Group {
  slices: Slice[];
  label: string;
  color: string;
  rankingColor: string;
  sliceCount: number;
}

export interface Indicator {
  id: number;
  name: string;
  centerImage: string;
  groups: Group[];
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

export interface GlobalConfig {
  themeCount: number;
  sliceCount: number;
  groups: Group[];
}
