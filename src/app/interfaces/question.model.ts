export interface Question {
  question: string;
  answer: string;
  techniqueData?: {
    code: string;
    technique_name: string;
    category: string;
    deduction_points: string[];
  };
}

export interface TechniqueQuestionData {
  questions: Question[];
  code: string;
  technique_name: string;
  category: string;
  deduction_points: string[];
  deduction_content?: string[];
  deduction_points_value?: number;
}

export interface MistakeItem {
  question: string;
  answer: string;
  technique_code: string;
  technique_name: string;
  category: string;
  deduction_points: string[];
  count: number;
  original_technique_code: string;
}