import { Alert, Box, Button, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { Country } from '../fetch/types';

interface CountryDetailViewProps {
	countryId: string;
	countries: Country[];
	onBackToList: () => void;
}

export function CountryDetailView({ countryId, countries, onBackToList }: CountryDetailViewProps) {
	const country = useMemo(() => {
		if (!countries || !countryId) return null;
		return countries.find((c) => c.cca3 === countryId || c.cca2 === countryId);
	}, [countries, countryId]);

	if (!country) {
		return (
			<Box marginTop="8">
				<Alert.Root status="warning">
					<VStack align="stretch" padding="4">
						<Text>The country with ID "{countryId}" could not be found.</Text>
						<Button width="fit-content" colorScheme="blue" onClick={onBackToList}>
							Back to List
						</Button>
					</VStack>
				</Alert.Root>
			</Box>
		);
	}

	return (
		<Box marginTop="8" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Box position="relative" padding="5">
				<Button
					position="absolute"
					top="4"
					right="4"
					colorScheme="blue"
					variant="outline"
					onClick={onBackToList}
				>
					Back to List
				</Button>

				<VStack padding="6" align="stretch">
					<Heading as="h2" size="xl" textAlign="center">
						{country.name.common}
					</Heading>

					<Box textAlign="center">
						<Image
							src={country.flags.png}
							alt={`Flag of ${country.name.common}`}
							height="150px"
							width="auto"
							marginX="auto"
						/>
					</Box>

					<Box>
						<VStack padding="4" align="stretch">
							<HStack justifyContent="space-between">
								<Text fontWeight="bold">Official Name:</Text>
								<Text>{country.name.official}</Text>
							</HStack>

							<HStack justifyContent="space-between">
								<Text fontWeight="bold">Country Code:</Text>
								<Text>{country.cca3}</Text>
							</HStack>

							<HStack justifyContent="space-between">
								<Text fontWeight="bold">Capital:</Text>
								<Text>{country.capital?.[0] || 'N/A'}</Text>
							</HStack>

							<HStack justifyContent="space-between">
								<Text fontWeight="bold">Region:</Text>
								<Text>
									{country.region} {country.subregion ? `(${country.subregion})` : ''}
								</Text>
							</HStack>

							<HStack justifyContent="space-between">
								<Text fontWeight="bold">Population:</Text>
								<Text>{country.population.toLocaleString()}</Text>
							</HStack>

							{country.languages && (
								<HStack justifyContent="space-between" alignItems="flex-start">
									<Text fontWeight="bold">Languages:</Text>
									<Text textAlign="right">{Object.values(country.languages || {}).join(', ')}</Text>
								</HStack>
							)}

							{country.currencies && (
								<HStack justifyContent="space-between" alignItems="flex-start">
									<Text fontWeight="bold">Currencies:</Text>
									<Text textAlign="right">
										{Object.values(country.currencies || {})
											.map((currency) => `${currency.name} (${currency.symbol})`)
											.join(', ')}
									</Text>
								</HStack>
							)}
						</VStack>
					</Box>
				</VStack>
			</Box>
		</Box>
	);
}
