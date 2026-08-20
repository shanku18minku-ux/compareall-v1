export type Category = 
  | 'food'
  | 'grocery'
  | 'shopping'
  | 'electronics'
  | 'fashion'
  | 'cab'
  | 'travel'
  | 'jobs'
  | 'education'
  | 'medicine'
  | 'services'
  | 'other';

export type ResultStatus = 'LIVE' | 'ESTIMATED' | 'CACHED' | 'UNAVAILABLE';

export interface LocationContext {
  label?: string;
  lat?: number;
  lng?: number;
  pincode?: string;
  city?: string;
  state?: string;
  addressLine?: string;
}

export interface SearchFilters {
  providers?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  category?: string;
  subCategory?: string;
}

export interface SearchQuery {
  term: string;
  category?: Category;
  location?: LocationContext;
  filters?: SearchFilters;
  connectedProviders?: string[];
}

export interface PriceBreakdown {
  basePrice: number;
  deliveryFee?: number;
  platformFee?: number;
  packagingFee?: number;
  taxes?: number;
  discount?: number;
  otherCredits?: number;
  finalPayablePrice: number;
  currency: string;
}

export interface JobMetadata {
  salaryRange?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceRequired?: string;
}

export interface EducationMetadata {
  duration?: string;
  certificateOffered?: boolean;
  level?: string;
}

export interface NormalizedResult {
  id: string; // Unique identifier across system
  providerId: string; // ID of the provider (e.g. 'food-provider-a')
  providerName: string; // Display name of provider
  
  title: string; // Name of the item / ride / service
  description?: string;
  imageUrl?: string;
  
  // Matching attributes
  brand?: string;
  model?: string;
  variant?: string;
  size?: string;
  quantity?: number;
  attributes?: Record<string, string>;
  
  // Matching confidence (calculated by engine)
  matchConfidence?: number;

  category: Category;
  status: ResultStatus;
  
  price: PriceBreakdown;
  
  isAvailable: boolean;
  estimatedTimeMins?: number; // ETA in minutes
  distanceKm?: number; // Distance from user in km
  
  // Explicit Original Price (mapped to basePrice for clarity, but standardizing format here)
  originalPrice?: number; 
  
  locationData?: LocationContext; // Origin/Destination for travel/cab
  
  rating?: number;
  reviewCount?: number;
  
  // Link to continue to official app/website
  deepLinkUrl: string;
  
  // Account-specific benefits if connected
  accountBenefits?: string[];
  
  // Provider-specific raw metadata (for debugging or specialized UI)
  rawMetadata?: any;
  
  // Specific metadata based on category
  jobMetadata?: JobMetadata;
  educationMetadata?: EducationMetadata;
  
  // Error state if provider failed
  error?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  supportedCategories: Category[];
  requiresAuth: boolean;
  // If true, the provider needs the user to connect their account
}

export interface ProviderAdapter {
  config: ProviderConfig;
  
  // Lifecycle methods
  connect?(credentials: any): Promise<boolean>;
  disconnect?(): Promise<void>;
  isConnected?(): Promise<boolean>;
  
  // Core search function
  search(query: SearchQuery): Promise<NormalizedResult[]>;
}

export interface CompareAllConfig {
  apiMode: 'mock' | 'live';
}
