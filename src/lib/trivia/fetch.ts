import { decodeHTML } from '$lib/utils';
import type { ResultOrError } from '../types';
import type { EnhancedTriviaQuestion, TriviaResponse } from './types';

export async function fetchTrivia(
	amount: number,
	category: string,
	difficulty: string,
	useLocalData = false
): Promise<ResultOrError<EnhancedTriviaQuestion[], string>> {
	try {
		const url = new URL(`https://opentdb.com/api.php?amount=${amount}`);

		if (category !== 'any') {
			url.searchParams.append('category', category);
		}
		if (difficulty !== 'any') {
			url.searchParams.append('difficulty', difficulty);
		}
		const data: TriviaResponse = await (async () => {
			if (useLocalData) {
				return localData;
			}
			const response = await fetch(url);
			return await response.json();
		})();

		if (data.response_code === 0) {
			const result: EnhancedTriviaQuestion[] = data.results.map((question) => ({
				...question,
				type: decodeHTML(question.type),
				category: decodeHTML(question.category),
				question: decodeHTML(question.question),
				all_answers: shuffleArray([...question.incorrect_answers, question.correct_answer]).map(
					decodeHTML
				)
			}));

			return [result, null];
		} else {
			return [null, 'Failed to load questions'];
		}
	} catch (err) {
		return [
			null,
			`Error loading questions: ${err instanceof Error ? err.message : 'Unknown error'}`
		];
	}
}

function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

const localData: TriviaResponse = {
	response_code: 0,
	results: [
		{
			type: 'multiple',
			difficulty: 'medium',
			category: 'Entertainment: Japanese Anime &amp; Manga',
			question:
				'In &quot;Toriko&quot;, which of the following Heavenly Kings has an enhanced sense of Hearing?',
			correct_answer: 'Zebra',
			incorrect_answers: ['Coco', 'Sunny', 'Toriko']
		},
		{
			type: 'multiple',
			difficulty: 'medium',
			category: 'History',
			question: 'Which Roman Emperor led the Roman Empire to reach its maximum territorial extent?',
			correct_answer: 'Trajan',
			incorrect_answers: ['Julius Caesar', 'Claudius', 'Constantine the Great']
		},
		{
			type: 'multiple',
			difficulty: 'easy',
			category: 'Sports',
			question: 'Who won the 2015 Formula 1 World Championship?',
			correct_answer: 'Lewis Hamilton',
			incorrect_answers: ['Nico Rosberg', 'Sebastian Vettel', 'Jenson Button']
		},
		{
			type: 'multiple',
			difficulty: 'hard',
			category: 'Science &amp; Nature',
			question: 'Which of the following liquids is least viscous? Assume temperature is 25&deg;C.',
			correct_answer: 'Acetone',
			incorrect_answers: ['Water', 'Mercury', 'Benzene']
		},
		{
			type: 'multiple',
			difficulty: 'medium',
			category: 'History',
			question: 'The Korean War started in what year?',
			correct_answer: '1950',
			incorrect_answers: ['1945', '1960', '1912']
		}
	]
};
