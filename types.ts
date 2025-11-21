export enum DurationCategory {
  SHORT = 'SHORT',   // < 30 mins
  MEDIUM = 'MEDIUM', // 1 - 2 hours
  LONG = 'LONG'      // 2 hours +
}

export interface Activity {
  id: string;
  title: string;
  category: DurationCategory;
  createdAt: number;
}

export type ActivityFormData = {
  title: string;
  category: DurationCategory;
};

export interface CategoryConfig {
  id: DurationCategory;
  label: string;
  durationLabel: string;
  icon: string;
  // New styling system
  bgClass: string;
  textClass: string;
  borderClass: string;
  accentColor: string;
}