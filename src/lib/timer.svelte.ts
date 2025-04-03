// lib/timer.svelte.ts
import { onDestroy } from 'svelte';

/**
 * Creates a timer with the specified duration in milliseconds
 * @param milliseconds Initial timer duration in milliseconds
 * @returns Timer object with methods and reactive state
 */
export function createTimer(milliseconds: number) {
	// Use state() instead of $ prefix
	let valueMs = $state(milliseconds);
	let isRunning = $state(false);

	let intervalId: number | undefined;
	let onCompleteCallback: () => void = () => {};

	// Create a derived state for the percentage
	const percentRemaining = $derived(() => (valueMs / milliseconds) * 100);

	// Effect to handle timer completion
	$effect(() => {
		if (valueMs <= 0 && isRunning) {
			clearInterval(intervalId);
			isRunning = false;
			onCompleteCallback();
		}
	});

	// Start the timer
	function start(): void {
		if (!isRunning && valueMs > 0) {
			isRunning = true;
			const startTime = Date.now();
			const initialValue = valueMs;

			intervalId = setInterval(() => {
				const elapsed = Date.now() - startTime;
				valueMs = Math.max(0, initialValue - elapsed);
			}, 10); // Update every 10ms for smooth millisecond display
		}
	}

	// Stop/pause the timer
	function stop(): void {
		if (isRunning) {
			clearInterval(intervalId);
			isRunning = false;
		}
	}

	// Reset the timer
	function reset(): void {
		clearInterval(intervalId);
		isRunning = false;
		valueMs = milliseconds;
	}

	// Set callback for when timer reaches zero
	function onComplete(callback: () => void): void {
		onCompleteCallback = callback;
	}

	// Format time to display seconds and milliseconds (utility function)
	function formatTime(): string {
		const seconds = Math.floor(valueMs / 1000);
		const ms = valueMs % 1000;
		return `${seconds}.${ms.toString().padStart(3, '0')}`;
	}

	// Cleanup function to prevent memory leaks
	function destroy(): void {
		if (intervalId) {
			clearInterval(intervalId);
		}
	}

	// Set up automatic cleanup when component is destroyed
	onDestroy(destroy);

	// Return the timer API
	return {
		start,
		stop,
		reset,
		onComplete,
		formatTime,
		destroy,
		// Expose state getters/setters
		get valueMs() {
			return valueMs;
		},
		get elapsedMs() {
			return milliseconds - valueMs;
		},
		set valueMs(value: number) {
			valueMs = value;
		},
		get isRunning() {
			return isRunning;
		},
		get percentRemaining() {
			return percentRemaining();
		}
	};
}
