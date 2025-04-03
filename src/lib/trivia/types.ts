
// Define TypeScript interfaces

import type { ResultOrError } from "$lib/types";

export interface TriviaQuestion {
	category: string;
	type: string;
	difficulty: string;
	question: string;
	correct_answer: string;
	incorrect_answers: string[];
	all_answers?: string[]; // Added in our code
}

export interface TriviaResponse {
	response_code: number;
	results: TriviaQuestion[];
}

export interface EnhancedTriviaQuestion extends TriviaQuestion {
	all_answers: string[]; // This is required in our enhanced version
}

export type TriviaContext = {
  isLoading: boolean;
  questions: EnhancedTriviaQuestion[];
  error: string | null;
  userAnswers: number[];
  userAnswersTime: number[];
  userQuestionsSeen: boolean[];
  currentQuestionIndex: number;
	difficulty: string;
	category: string;
}