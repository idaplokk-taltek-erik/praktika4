<script lang="ts">
	import ReactWrapper from '$lib/react-wrapper/ReactWrapper.svelte';
	import CountrySearchPage from '$lib/components/CountrySearchPage';

</script>

<ReactWrapper reactComponent={CountrySearchPage} props={{ message: 'hello' }} />
