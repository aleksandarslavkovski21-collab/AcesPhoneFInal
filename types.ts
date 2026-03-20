
export interface PhoneModel {
  id: string;
  model: string;
  price: number | string;
  ram: string;
  storage: string;
  screen?: string;
  condition: string;
  image: string;
  images?: string[];
  thumbnail?: string; // New: Optimized listing image
  size_kb?: number;    // New: Storage usage stat
  description: string;
  location?: string;
  brand: string;
  unlocked?: boolean; // New: SIM Free status
  lockedTo?: string;  // New: Specific networks if locked
  // Dynamic Features
  extraFeatures?: string[];
  specOrder?: string[]; 
  activeSpecs?: string[]; // New: Which specs should be visible
  customNote?: string;    // New: Black card for defects/special notes
  // Important Info Box (Customizable per ad)
  infoText?: string;
  infoEmoji?: string;
  infoBgColor?: string;
  // iPhone Specific
  fmi?: 'On' | 'Off';
  batteryHealth?: string | number;
  trueTone?: boolean;
  faceId?: boolean;
  touchId?: boolean;
  icloud?: 'On' | 'Off'; // New: iCloud Status
  // Huawei Specific
  googleServices?: boolean;
}

export interface AppConfig {
  brands: string[];
  ramOptions: string[];
  storageOptions: string[];
  locations: string[];
  featureOptions: string[];
  globalNote: string;
  showGlobalNote: boolean;
  specTypes: { id: string; label: string }[];
}

export interface BrandGroup {
  brand: string;
  models: Omit<PhoneModel, 'brand'>[];
}

export interface Filters {
  brand: string;
  ram: string;
  storage: string;
  condition: string;
  priceMax: number;
  searchQuery: string;
  sortOrder: 'asc' | 'desc';
  location?: string;
  feature?: string;
}
