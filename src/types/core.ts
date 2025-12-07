export type Concept = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  concepts: Concept[];
};

export type Platform = {
  id: string;
  name: string;
  categories: Category[];
};

export type RoundConfig = {
  concepts: string[]; // Array of concept IDs
  weight: number;     // 0-10
};

export type InterviewRoundConfig = {
  l1: RoundConfig;
  l2: RoundConfig;
};

export type InterviewProfile = {
  id: string;
  platformId: string;
  name: string;
  // Configuration: categoryId -> { l1: {concepts, weight}, l2: {concepts, weight} }
  config: Record<string, InterviewRoundConfig>;
  customCategories: Category[];
};