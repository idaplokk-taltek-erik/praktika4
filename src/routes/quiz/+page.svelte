<script lang="ts">
	import QuizStatistics from '$lib/components/statistics.svelte';
	import { createTimer } from '$lib/timer.svelte';
	import {
		createTriviaContext,
		getCurrentAnswerIndex,
		getCurrentQuestion,
		getFirstUnansweredQuestionIndex,
		initTrivia,
		isCorrectAnswer,
		isCurrentQuestionAnswered,
		isCurrentQuestionAnsweredCorrectly,
		isCurrentQuestionTimedOut,
		isQuestionAnswered,
		isQuestionSeen,
		isQuizComplete,
		setCurrentAnswer,
		setNextQuestion
	} from '$lib/trivia/state.svelte';
	import {
		Button,
		Column,
		Content,
		Grid,
		InlineNotification,
		Loading,
		ProgressIndicator,
		ProgressStep,
		RadioButton,
		RadioButtonGroup,
		Row,
		Select,
		SelectItem,
		Tile
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/white.css';
	import { fade } from 'svelte/transition';

	const trivia = createTriviaContext();
	const timer = createTimer(15_000);

	let started = false;

	timer.onComplete(() => {
		setCurrentAnswer(trivia, -1, timer.elapsedMs);
	});

	function handleAnswerSelection(event: CustomEvent<string | number>): void {
		if (isCurrentQuestionAnswered(trivia)) return;

		if (event.detail !== null) {
			timer.stop();
			setCurrentAnswer(trivia, Number(event.detail), timer.elapsedMs);
		}
	}

	function nextQuestion(): void {
		const questionIndex = setNextQuestion(trivia);

		if (!isQuestionSeen(trivia, trivia.currentQuestionIndex)) {
			trivia.userQuestionsSeen[trivia.currentQuestionIndex] = true;
			timer.reset();
			timer.start();
		}
	}

	function pickQuestion(i: number): void {
		if (isQuestionAnswered(trivia, i)) {
			trivia.currentQuestionIndex = i;
		} else if (getFirstUnansweredQuestionIndex(trivia) === i) {
			trivia.currentQuestionIndex = i;
			trivia.userQuestionsSeen[i] = true;
			timer.reset();
			timer.start();
		}
	}

	async function resetQuiz(): Promise<void> {
		timer.reset();
		started = false;
	}

	async function startQuiz() {
		started = true;
		await Promise.allSettled([initTrivia(trivia), new Promise((r) => setTimeout(r, 1000))]);
		timer.reset();
		timer.start();
	}
</script>

<Content>
	<Grid>
		<Row>
			<Column>
				<h1 class="quiz-title">Trivia Quiz {(timer.valueMs / 1000).toPrecision(2)}</h1>

				{#if !started}
					<Tile light>
						<Select
							name="trivia_category"
							labelText="Category"
							selected={trivia.category}
							on:change={(e) => {
								if (e.target?.value !== undefined) {
									trivia.category = e.target.value;
								}
							}}
						>
							<SelectItem value="any" text="Any Category" />
							<SelectItem value="9" text="General Knowledge" />
							<SelectItem value="10" text="Entertainment: Books" />
							<SelectItem value="11" text="Entertainment: Film" />
							<SelectItem value="12" text="Entertainment: Music" />
							<SelectItem value="13" text="Entertainment: Musicals &amp; Theatres" />
							<SelectItem value="14" text="Entertainment: Television" />
							<SelectItem value="15" text="Entertainment: Video Games" />
							<SelectItem value="16" text="Entertainment: Board Games" />
							<SelectItem value="17" text="Science &amp; Nature" />
							<SelectItem value="18" text="Science: Computers" />
							<SelectItem value="19" text="Science: Mathematics" />
							<SelectItem value="20" text="Mythology" />
							<SelectItem value="21" text="Sports" />
							<SelectItem value="22" text="Geography" />
							<SelectItem value="23" text="History" />
							<SelectItem value="24" text="Politics" />
							<SelectItem value="25" text="Art" />
							<SelectItem value="26" text="Celebrities" />
							<SelectItem value="27" text="Animals" />
							<SelectItem value="28" text="Vehicles" />
							<SelectItem value="29" text="Entertainment: Comics" />
							<SelectItem value="30" text="Science: Gadgets" />
							<SelectItem value="31" text="Entertainment: Japanese Anime &amp; Manga" />
							<SelectItem value="32" text="Entertainment: Cartoon &amp; Animations" />
						</Select>
						<Select
							name="trivia_difficulty"
							labelText="Difficulty"
							selected={trivia.difficulty}
							on:change={(e) => {
								if (e.target?.value !== undefined) {
									trivia.difficulty = e.target.value;
								}
							}}
						>
							<SelectItem value="any" text="Any Difficulty" />
							<SelectItem value="easy" text="Easy" />
							<SelectItem value="medium" text="Medium" />
							<SelectItem value="hard" text="Hard" />
						</Select>
						<div class="cta-button-container">
							<Button on:click={startQuiz}>Start quiz</Button>
						</div>
					</Tile>
				{:else if trivia.isLoading}
					<div class="loading-container">
						<Loading withOverlay={false} description="Loading questions..." />
					</div>
				{:else if trivia.error !== null}
					<Tile light>
						<InlineNotification
							kind="error"
							title="Error"
							subtitle={trivia.error}
							hideCloseButton
						/>
						<Button kind="danger" on:click={resetQuiz}>Try Again</Button>
					</Tile>
				{:else if !trivia.questions.length}
					<Tile light>
						<InlineNotification
							kind="warning"
							title="No Questions"
							subtitle="No questions available"
							hideCloseButton
						/>
						<Button on:click={resetQuiz}>Try Again</Button>
					</Tile>
				{:else}
					<div in:fade={{ duration: 300 }}>
						<Tile light={true}>
							<ProgressIndicator spaceEqually currentIndex={trivia.currentQuestionIndex}>
								{#each trivia.questions as _, i}
									<ProgressStep
										label={`Question ${i + 1}`}
										description={i === trivia.currentQuestionIndex ? 'Current' : ''}
										complete={isQuestionAnswered(trivia, i)}
										invalid={isQuestionAnswered(trivia, i) &&
											!isCorrectAnswer(trivia, i, trivia.userAnswers[i])}
										on:click={() => pickQuestion(i)}
									/>
								{/each}
							</ProgressIndicator>

							<div class="quiz-metadata">
								<span class="category">{getCurrentQuestion(trivia).category}</span>
								<span class="difficulty">Difficulty: {getCurrentQuestion(trivia).difficulty}</span>
							</div>

							<h2 class="question-text">{getCurrentQuestion(trivia).question}</h2>

							{#key trivia.currentQuestionIndex}
								<RadioButtonGroup
									orientation="vertical"
									legendText="Select your answer"
									on:change={handleAnswerSelection}
									selected={getCurrentAnswerIndex(trivia)}
									disabled={isCurrentQuestionAnswered(trivia)}
								>
									{#each getCurrentQuestion(trivia).all_answers as answer, i}
										<RadioButton value={i} labelText={answer} />
									{/each}
								</RadioButtonGroup>
							{/key}

							<div class="footer">
								{#if isQuizComplete(trivia)}
									<Button kind="secondary" on:click={resetQuiz}>Start New Quiz</Button>
								{:else}
									<Button
										disabled={!isCurrentQuestionAnswered(trivia)}
										kind="primary"
										on:click={nextQuestion}>Next Question</Button
									>
								{/if}
								{#if isCurrentQuestionAnswered(trivia)}
									<div in:fade>
										{#if isCurrentQuestionAnsweredCorrectly(trivia)}
											<InlineNotification
												style="margin: 0!important;"
												class="no-margin"
												kind="success"
												title="Correct!"
												subtitle="Well done!"
												hideCloseButton
											/>
										{:else}
											<InlineNotification
												style="margin: 0!important;"
												kind={isCurrentQuestionTimedOut(trivia) ? 'warning' : 'error'}
												title={isCurrentQuestionTimedOut(trivia) ? 'Timed out!' : 'Incorrect!'}
												subtitle={`The correct answer is: ${getCurrentQuestion(trivia).correct_answer}`}
												hideCloseButton
											/>
										{/if}
									</div>
								{/if}
							</div>

							{#if isQuizComplete(trivia)}
								<QuizStatistics triviaContext={trivia} />
							{/if}
						</Tile>
					</div>
				{/if}
			</Column>
		</Row>
	</Grid>
</Content>

<style>
	:global(body) {
		background-color: #f4f4f4;
	}

	.quiz-title {
		font-size: 2rem;
		margin: 2rem 0;
		text-align: center;
	}

	.loading-container {
		display: flex;
		justify-content: center;
		padding: 4rem 0;
	}

	.quiz-metadata {
		display: flex;
		justify-content: space-between;
		margin: 1.5rem 0;
		font-size: 0.875rem;
	}

	.category {
		font-weight: 600;
	}

	.difficulty {
		text-transform: capitalize;
	}

	.question-text {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		line-height: 1.4;
	}

	.quiz-completed p {
		text-align: center;
		margin-top: 24px;
		margin-bottom: 16px;
		font-weight: 600;
	}

	.footer {
		display: flex;
		flex-wrap: nowrap;
		gap: 16px;
		margin-top: 32px;
	}

	.cta-button-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
</style>
