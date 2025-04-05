export interface TriviaQuestion {
	category: string;
	type: string;
	difficulty: string;
	question: string;
	correct_answer: string;
	incorrect_answers: string[];
	all_answers?: string[]; /
}

export interface TriviaResponse {
	response_code: number;
	results: TriviaQuestion[];
}

export interface EnhancedTriviaQuestion extends TriviaQuestion {
	all_answers: string[]; 
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
};
