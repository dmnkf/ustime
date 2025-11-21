import { CategoryConfig, DurationCategory } from './types';

export const CATEGORIES: Record<DurationCategory, CategoryConfig> = {
  [DurationCategory.SHORT]: {
    id: DurationCategory.SHORT,
    label: "Quickie",
    durationLabel: "< 30 Mins",
    icon: "⚡️",
    bgClass: "bg-[#FFD23F]", // Sunny Pop Yellow
    textClass: "text-black",
    borderClass: "border-black",
    accentColor: "#000000",
  },
  [DurationCategory.MEDIUM]: {
    id: DurationCategory.MEDIUM,
    label: "The Usual",
    durationLabel: "1-2 Hours",
    icon: "🌱",
    bgClass: "bg-[#98F5E1]", // Mint Pop
    textClass: "text-black",
    borderClass: "border-black",
    accentColor: "#000000",
  },
  [DurationCategory.LONG]: {
    id: DurationCategory.LONG,
    label: "Big Event",
    durationLabel: "2 Hours +",
    icon: "🔮",
    bgClass: "bg-[#BDB2FF]", // Periwinkle Pop
    textClass: "text-black",
    borderClass: "border-black",
    accentColor: "#000000",
  },
};

export const INITIAL_ACTIVITIES = [
  { id: '1', title: 'Speedy Card Game', category: DurationCategory.SHORT, createdAt: Date.now() },
  { id: '2', title: 'Morning Coffee Run', category: DurationCategory.SHORT, createdAt: Date.now() },
  { id: '3', title: 'Cook Dinner Together', category: DurationCategory.MEDIUM, createdAt: Date.now() },
  { id: '4', title: 'Sunset Walk', category: DurationCategory.MEDIUM, createdAt: Date.now() },
  { id: '5', title: 'Cinema Marathon', category: DurationCategory.LONG, createdAt: Date.now() },
  { id: '6', title: 'Visit the Museum', category: DurationCategory.LONG, createdAt: Date.now() },
];