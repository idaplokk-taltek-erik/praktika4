import { Box, Heading, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CountryDetailView } from './CounrtyDetailsView';
import { CountryTable } from './CountryTable';
import { FeedbackDialog } from './FeedbackDialog';
import { useCountryState } from './useCountryState';

interface CountrySearchPageProps {
	message?: string;
	navigate?: (url: string) => void;
}

export default function CountrySearchPage({ navigate }: CountrySearchPageProps) {
	const {
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
	} = useCountryState({ navigate });

	const displayCountries = searchResults || allCountries;
	const [page, setPage] = useState(1);

	useEffect(() => {
		setPage(1);
	}, [displayCountries]);

	return (
		<Box maxWidth="720px" marginInline="auto" marginTop="10" padding="5">
			<Heading marginBottom="5">
				Search for a Country (reload page if styles are weird... svelte vs react issues)
			</Heading>
			<Input
				variant="subtle"
				placeholder="Enter country name"
				value={query}
				onChange={handleInputChange}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleCountryDeselect();
						handleSearch();
					}
				}}
			/>

			<FeedbackDialog isPending={isPending} error={error} onClose={clearError} />

			{selectedCountryId && allCountries ? (
				<CountryDetailView
					countryId={selectedCountryId}
					countries={allCountries}
					onBackToList={handleCountryDeselect}
				/>
			) : (
				!error &&
				!isPending && (
					<CountryTable
						page={page}
						setPage={setPage}
						countries={displayCountries ?? []}
						selectedCountryId={selectedCountryId}
						handleRowClick={(country) => handleCountrySelect(country.cca2)}
					/>
				)
			)}
		</Box>
	);
}
