import { onDestroy } from 'svelte';


export function createTimer(milliseconds: number) {
	let valueMs = $state(milliseconds);
	let isRunning = $state(false);

	let intervalId: number | undefined;
	let onCompleteCallback: () => void = () => {};

	const percentRemaining = $derived(() => (valueMs / milliseconds) * 100);

	$effect(() => {
		if (valueMs <= 0 && isRunning) {
			clearInterval(intervalId);
			isRunning = false;
			onCompleteCallback();
		}
	});

	function start(): void {
		if (!isRunning && valueMs > 0) {
			isRunning = true;
			const startTime = Date.now();
			const initialValue = valueMs;

			intervalId = setInterval(() => {
				const elapsed = Date.now() - startTime;
				valueMs = Math.max(0, initialValue - elapsed);
			}, 10);
		}
	}

	function stop(): void {
		if (isRunning) {
			clearInterval(intervalId);
			isRunning = false;
		}
	}

	function reset(): void {
		clearInterval(intervalId);
		isRunning = false;
		valueMs = milliseconds;
	}

	function onComplete(callback: () => void): void {
		onCompleteCallback = callback;
	}

	function formatTime(): string {
		const seconds = Math.floor(valueMs / 1000);
		const ms = valueMs % 1000;
		return `${seconds}.${ms.toString().padStart(3, '0')}`;
	}

	function destroy(): void {
		if (intervalId) {
			clearInterval(intervalId);
		}
	}

	onDestroy(destroy);

	return {
		start,
		stop,
		reset,
		onComplete,
		formatTime,
		destroy,
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
