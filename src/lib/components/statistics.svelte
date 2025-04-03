<script lang="ts">
	import {
		ProgressBar,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListRow,
		Tag,
		Tile
	} from 'carbon-components-svelte';

	import { isCorrectAnswer, isTimedoutAnswer } from '$lib/trivia/state.svelte';
	import type { TriviaContext } from '$lib/trivia/types';

	export let triviaContext: TriviaContext;

	const totalQuestions = triviaContext.questions.length;
	const correctAnswers = triviaContext.userAnswers.filter((answerIndex, questionIndex) =>
		isCorrectAnswer(triviaContext, questionIndex, answerIndex)
	).length;
	const percentCorrect = (correctAnswers / totalQuestions) * 100;

	const averageTime =
		triviaContext.userAnswersTime.length > 0
			? triviaContext.userAnswersTime.reduce((sum, time) => sum + time, 0) /
				triviaContext.userAnswersTime.length
			: 0;

	const formatTime = (timeMs: number) => {
		return (timeMs / 1000).toFixed(2) + 's';
	};

	const timingData = triviaContext.questions.map((question, index) => ({
		question: `Q${index + 1}`,
		timeMs: triviaContext.userAnswersTime[index] || 0,
		isCorrect: isCorrectAnswer(triviaContext, index, triviaContext.userAnswers[index])
	}));

	const sortedTimingData = [...timingData].sort((a, b) => a.timeMs - b.timeMs);

	const fastestQuestion = sortedTimingData[0];
	const slowestQuestion = sortedTimingData[sortedTimingData.length - 1];
</script>

<div class="statistics-container">
	<h2 class="statistics-title">Quiz Results</h2>

	<div class="statistics-grid">
		<Tile light>
			<h3>Overall Performance</h3>
			<div class="score-container">
				<div class="score">{correctAnswers}/{totalQuestions}</div>
				<div class="percentage">{percentCorrect.toFixed(0)}%</div>
			</div>
			<ProgressBar value={percentCorrect} max={100} labelText="Correct answers" />
		</Tile>

		<Tile light>
			<h3>Timing Statistics</h3>
			<StructuredList>
				<StructuredListBody>
					<StructuredListRow>
						<StructuredListCell>Average Time</StructuredListCell>
						<StructuredListCell>{formatTime(averageTime)}</StructuredListCell>
					</StructuredListRow>
					<StructuredListRow>
						<StructuredListCell>Fastest Answer</StructuredListCell>
						<StructuredListCell>
							{fastestQuestion ? formatTime(fastestQuestion.timeMs) : 'N/A'}
							<span class={fastestQuestion?.isCorrect ? 'correct' : 'incorrect'}>
								({fastestQuestion?.isCorrect ? 'Correct' : 'Incorrect'})
							</span>
						</StructuredListCell>
					</StructuredListRow>
					<StructuredListRow>
						<StructuredListCell>Slowest Answer</StructuredListCell>
						<StructuredListCell>
							{slowestQuestion ? formatTime(slowestQuestion.timeMs) : 'N/A'}
							<span class={slowestQuestion?.isCorrect ? 'correct' : 'incorrect'}>
								({slowestQuestion?.isCorrect ? 'Correct' : 'Incorrect'})
							</span>
						</StructuredListCell>
					</StructuredListRow>
				</StructuredListBody>
			</StructuredList>
		</Tile>
	</div>

	<h3 class="breakdown-title">Question Breakdown</h3>
	<div class="cards-container">
		{#each triviaContext.questions as question, index}
			{@const isCorrect = isCorrectAnswer(triviaContext, index, triviaContext.userAnswers[index])}
			{@const isTimedout = isTimedoutAnswer(triviaContext, index)}
			{@const answerTime = triviaContext.userAnswersTime[index] || 0}
			{@const userAnswerIndex = triviaContext.userAnswers[index]}
			{@const userAnswer =
				userAnswerIndex !== undefined ? question.all_answers[userAnswerIndex] : 'No answer'}

			<Tile light={false} class="question-card">
				<div class="card-header">
					<div class="card-title">Question {index + 1}</div>
					<div class="card-meta">
						<Tag type={isTimedout ? 'warm-gray' : isCorrect ? 'green' : 'red'}>
							{isTimedout ? 'Timed Out' : isCorrect ? 'Correct' : 'Incorrect'}
						</Tag>
						<span class="time">{formatTime(answerTime)}</span>
						<span class="category">{question.category} ({question.difficulty})</span>
					</div>
				</div>

				<div class="question-text">
					<strong>Q:</strong>
					{question.question}
				</div>

				<div class="answer-container">
					<div class="correct-answer">
						<strong>Correct Answer:</strong>
						{question.correct_answer}
					</div>

					{#if !isCorrect && !isTimedout}
						<div class="incorrect-answer">
							<strong>Your Answer:</strong>
							{userAnswer}
						</div>
					{/if}
				</div>
			</Tile>
		{/each}
	</div>
</div>

<style>
	.statistics-container {
		margin-top: 2rem;
	}

	.statistics-title {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.statistics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (max-width: 768px) {
		.statistics-grid {
			grid-template-columns: 1fr;
		}
	}

	.score-container {
		display: flex;
		align-items: baseline;
		margin: 1rem 0;
	}

	.score {
		font-size: 2rem;
		font-weight: bold;
		margin-right: 1rem;
	}

	.percentage {
		font-size: 1.5rem;
		color: #525252;
	}

	.correct {
		color: #24a148;
		font-weight: 600;
	}

	.incorrect {
		color: #da1e28;
		font-weight: 600;
	}

	h3 {
		margin-bottom: 1rem;
		font-size: 1.2rem;
	}

	:global(.bx--structured-list) {
		margin-bottom: 0;
	}

	.breakdown-title {
		margin: 2rem 0 1rem;
		font-size: 1.2rem;
	}

	.cards-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.question-card {
		border-left: 4px solid #0f62fe;
		margin-bottom: 1rem;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.card-title {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.card-meta {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		align-items: center;
		font-size: 0.875rem;
	}

	.question-text {
		background-color: #e6e6e6;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 4px;
		line-height: 1.5;
	}

	.answer-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.answer-container {
			grid-template-columns: 1fr;
		}
	}

	.correct-answer {
		background-color: rgba(36, 161, 72, 0.1);
		padding: 1rem;
		border-radius: 4px;
		border-left: 3px solid #24a148;
	}

	.incorrect-answer {
		background-color: rgba(218, 30, 40, 0.1);
		padding: 1rem;
		border-radius: 4px;
		border-left: 3px solid #da1e28;
	}

	.time {
		color: #525252;
	}

	.category {
		color: #0f62fe;
	}
</style>
