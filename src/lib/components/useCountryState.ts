import { getAllCountries } from '$lib/fetch/all-countries';
import { searchCountryByName } from '$lib/fetch/country-by-name';
import { useEffect, useState, useTransition } from 'react';
import type { Country } from '../fetch/types';

type NavigateFunction = (url: string) => void;

interface CountryStateOptions {
	navigate?: NavigateFunction;
}

export function useCountryState(options: CountryStateOptions = {}) {
	const { navigate } = options;

	const getInitialValues = () => {
		const params = new URLSearchParams(window.location.search);
		return {
			query: params.get('q') || '',
			countryId: params.get('country') || ''
		};
	};

	const initialValues = getInitialValues();

	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Country[] | null>(null);
	const [allCountries, setAllCountries] = useState<Country[] | null>(null);
	const [selectedCountryId, setSelectedCountryId] = useState<string>(initialValues.countryId);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState('');

	useEffect(() => {
		startTransition(async () => {
			const [all, error] = await getAllCountries();
			if (all) {
				setAllCountries(all);
			}
			if (error) setError(error);
		});
	}, []);

	useEffect(() => {
		const handleUrlChange = () => {
			const params = new URLSearchParams(window.location.search);
			const urlQuery = params.get('q');
			const urlCountryId = params.get('country');

			if (urlQuery && urlQuery !== query && urlCountryId !== selectedCountryId) {
				performSearch(urlQuery);
				setQuery(urlQuery);
			} else if (!urlQuery) {
				setSearchResults(null);
				setQuery('');
			}

			if (urlCountryId !== selectedCountryId) {
				setSelectedCountryId(urlCountryId || '');
			}
		};

		handleUrlChange();
	}, []);

	const updateUrlParams = (newQuery: string, newCountryId?: string | null) => {
		const url = new URL(window.location.href);

		if (newQuery) {
			url.searchParams.set('q', newQuery);
		} else {
			url.searchParams.delete('q');
		}

		if (newCountryId) {
			url.searchParams.set('country', newCountryId);
		} else if (newCountryId === null) {
			url.searchParams.delete('country');
		}

		const newUrl = url.toString();

		if (navigate) {
			navigate(newUrl);
		} else {
			console.warn('No navigation function provided. URL changes may not work as expected.');

			try {
				window.history.replaceState({}, '', newUrl);
			} catch (e) {
				console.error('Failed to update URL:', e);
			}
		}
	};

	const performSearch = async (searchTerm: string) => {
		startTransition(async () => {
			const [data, searchError] = await searchCountryByName(searchTerm);
			setSearchResults(data);
			setError(searchError ?? '');
		});
	};

	const handleSearch = () => {
		if (query.trim()) {
			updateUrlParams(query);
			performSearch(query);
		} else {
			setSearchResults(null);
			updateUrlParams('');
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		if (!e.target.value.trim()) {
			setSearchResults(null);
			updateUrlParams('');
		}
	};

	const handleCountrySelect = (countryId: string) => {
		setSelectedCountryId(countryId);
		updateUrlParams(query, countryId);
	};

	const handleCountryDeselect = () => {
		setSelectedCountryId('');
		updateUrlParams(query, null);
	};

	const clearError = () => {
		setError('');
	};

	return {
		query,
		searchResults,
		allCountries,
		selectedCountryId,
		isPending,
		error,
		handleInputChange,
		handleSearch,
		handleCountrySelect,
		handleCountryDeselect,
		clearError
	};
}
