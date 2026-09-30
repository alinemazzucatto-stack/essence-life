export type Sleep = {
  id: string;
  date: string;
  bed: string;
  asleep: string;
  wake: string;
  out: string;
  quality: number;
  feeling: number;
  awakenings: number;
  notes: string;
};

export type Meal = {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type LocalSession = {
  name: string;
  email: string;
  avatar?: string;
};

export type LocalAccount = LocalSession & {
  passwordHash: string;
};

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};