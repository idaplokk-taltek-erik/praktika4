import { fetchTrivia } from './fetch';
import type { TriviaContext } from './types';

export function createTriviaContext(): TriviaContext {
	const triviaContext: TriviaContext = $state({
		isLoading: false,
		questions: [],
		error: null,
		userAnswers: [],
		userAnswersTime: [],
		userQuestionsSeen: [],
		currentQuestionIndex: -1,
		difficulty: 'any',
		category: 'any'
	});

	return triviaContext;
}

export function getCurrentQuestion(ctx: TriviaContext) {
	return ctx.questions[ctx.currentQuestionIndex];
}

export function getCurrentAnswerIndex(ctx: TriviaContext) {
	return ctx.userAnswers[ctx.currentQuestionIndex];
}

export function getFirstUnansweredQuestionIndex(ctx: TriviaContext) {
	const firstUnansweredQuestionIndex = ctx.questions.findIndex(
		(_, i) => !isQuestionAnswered(ctx, i)
	);

	return firstUnansweredQuestionIndex;
}

export function setCurrentAnswer(ctx: TriviaContext, answerIndex: number, timeMs: number) {
	ctx.userAnswers[ctx.currentQuestionIndex] = answerIndex;
	ctx.userAnswersTime[ctx.currentQuestionIndex] = timeMs;
}

export function setNextQuestion(ctx: TriviaContext) {
	const firstUnansweredQuestionIndex = getFirstUnansweredQuestionIndex(ctx);

	if (firstUnansweredQuestionIndex !== -1) {
		ctx.currentQuestionIndex = firstUnansweredQuestionIndex;
	}
}

export function isCurrentQuestionCorrectlyAnswered(ctx: TriviaContext) {
	return isCorrectAnswer(ctx, ctx.currentQuestionIndex, ctx.userAnswers[ctx.currentQuestionIndex]);
}

export function isQuestionAnswered(ctx: TriviaContext, questionIndex: number) {
	return ctx.userAnswers[questionIndex] !== undefined;
}

export function isQuestionSeen(ctx: TriviaContext, questionIndex: number) {
	return ctx.userQuestionsSeen[questionIndex] === true;
}

export function isQuizComplete(ctx: TriviaContext) {
	return ctx.questions.every((_, i) => isQuestionAnswered(ctx, i));
}

export function isCurrentQuestionAnswered(ctx: TriviaContext) {
	return getCurrentAnswerIndex(ctx) !== undefined && getCurrentAnswerIndex(ctx) !== -2;
}

export function isCurrentQuestionTimedOut(ctx: TriviaContext) {
	return getCurrentAnswerIndex(ctx) === -1;
}

export function isCurrentQuestionAnsweredCorrectly(ctx: TriviaContext) {
	return isCorrectAnswer(ctx, ctx.currentQuestionIndex, ctx.userAnswers[ctx.currentQuestionIndex]);
}

export function isCorrectAnswer(ctx: TriviaContext, questionIndex: number, answerIndex: number) {
	const question = ctx.questions[questionIndex];
	const answer = question.all_answers[answerIndex];

	return answer === question.correct_answer;
}

export function isTimedoutAnswer(ctx: TriviaContext, questionIndex: number) {
	const answerIndex = ctx.userAnswers[questionIndex];

	return answerIndex === -1;
}

export async function initTrivia(trivia: TriviaContext) {
	trivia.questions = [];
	trivia.currentQuestionIndex = 0;
	trivia.userAnswers = [];
	trivia.userAnswersTime = [];
	trivia.userQuestionsSeen = [];
	trivia.isLoading = true;
	const fetchResult = await fetchTrivia(5, trivia.category, trivia.difficulty);
	trivia.questions = fetchResult[0] ?? [];
	trivia.error = fetchResult[1];
	trivia.isLoading = false;
}
