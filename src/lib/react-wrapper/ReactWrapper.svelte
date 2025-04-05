<script lang="ts">
	import { ChakraProvider } from '@chakra-ui/react';
	import React from 'react';
	import ReactDOM from 'react-dom/client';
	import { onMount } from 'svelte';
	import { system } from './chankra';
	import { ColorModeProvider } from './color-mode';

	export let reactComponent;
	export let props = {};

	let container: HTMLDivElement;
	onMount(() => {
		const root = ReactDOM.createRoot(container);
		root.render(
			React.createElement(ChakraProvider, {
				value: system,
				children: React.createElement(ColorModeProvider, null, React.createElement(reactComponent, props))
			})
		);
	});
</script>

<div bind:this={container}></div>
