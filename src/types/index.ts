export interface PricingPackage {
  name: "Basic" | "Standard" | "Premium";
  packageTitle: string;
  price: string;
  deliveryDays: number;
  revisions: number | "Unlimited";
  description: string;
  features: { label: string; included: boolean }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ThumbnailIdea {
  headline: string;
  subtext: string;
  colors: string[];
  composition: string;
  canvaPrompt: string;
}

export interface RequirementQuestion {
  type: "FREE_TEXT" | "MULTIPLE_CHOICE";
  question: string;
  options?: string[];
}

export interface VideoPrompt {
  gemini: string;
  sora: string;
  veo: string;
  scriptOutline: string;
  duration: string;
  style: string;
}

export interface GigData {
  id: string;
  serviceInput: string;
  createdAt: string;
  // Overview tab
  title: string;
  category: string;
  subCategory: string;
  tags: string[]; // max 5
  positiveKeywords: string[]; // additional keywords
  // Pricing tab
  pricing: PricingPackage[];
  // Description & FAQ tab
  description: string;
  faqs: FAQItem[];
  // Requirements tab
  buyerRequirements: RequirementQuestion[];
  // Gallery tab
  thumbnailIdeas: ThumbnailIdea[];
  videoPrompt: VideoPrompt;
}
