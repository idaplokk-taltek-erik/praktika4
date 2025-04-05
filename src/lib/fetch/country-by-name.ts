import type { ResultOrError } from '$lib/types';
import { allCountries } from './all-countries';
import type { Country } from './types';

export async function searchCountryByName(
	name: string,
	useLocalData = true
): Promise<ResultOrError<Country[], string>> {
	try {
		if (useLocalData) {
			return [
				allCountries.filter((c) =>
					[c.name.common, c.name.official, c.cca2, c.cca3]
						.filter((s) => !!s)
						.map((s) => s.toLowerCase())
						.some((s) => s.includes(name.toLowerCase()))
				),
				null
			];
		}
		const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
		if (!res.ok) throw new Error('Country not found');
		const data = await res.json();
		return [data, null];
	} catch (err) {
		// @ts-expect-error err is unknown, but we coalesce
		return [null, err?.message || 'An error occurred'];
	}
}
