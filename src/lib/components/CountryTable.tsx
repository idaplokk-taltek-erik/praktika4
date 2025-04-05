import { Box, ButtonGroup, IconButton, Image, Pagination, Table } from '@chakra-ui/react';
import { useMemo } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import type { Country } from '../fetch/types';

interface CountryTableProps {
	countries: Country[];
	pageSize?: number;
	handleRowClick: (country: Country) => void;
	selectedCountryId: string;
	page: number;
	setPage: (page: number) => void;
}

export function CountryTable({
	countries,
	pageSize = 5,
	handleRowClick,
	selectedCountryId,
	page,
	setPage
}: CountryTableProps) {
	const visible = useMemo(() => {
		const offset = page * pageSize;

		return countries.slice(offset - pageSize, offset);
	}, [countries, page]);

	return (
		<Box marginTop="5" overflowX="auto">
			<Table.Root variant="outline" size="md">
				<Table.ColumnGroup>
					<Table.Column htmlWidth="10%" />
					<Table.Column htmlWidth="25%" />
					<Table.Column htmlWidth="25%" />
					<Table.Column htmlWidth="10%" />
					<Table.Column htmlWidth="20%" />
				</Table.ColumnGroup>

				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Flag</Table.ColumnHeader>
						<Table.ColumnHeader>Country</Table.ColumnHeader>
						<Table.ColumnHeader>Capital</Table.ColumnHeader>
						<Table.ColumnHeader>Region</Table.ColumnHeader>
						<Table.ColumnHeader>Population</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{visible.map((country) => (
						<Table.Row
							key={country.name.common}
							height={65}
							onClick={() => handleRowClick(country)}
							cursor="pointer"
							_hover={{ backgroundColor: 'gray.50' }}
							backgroundColor={selectedCountryId === country.cca2 ? 'blue.50' : undefined}
							transition="background-color 0.2s"
						>
							<Table.Cell>
								<Image
									src={country.flags.png}
									alt={country.name.common}
									width="120px"
									height="30px"
								/>
							</Table.Cell>
							<Table.Cell fontWeight="bold">{country.name.common}</Table.Cell>
							<Table.Cell>{country.capital?.[0] || 'N/A'}</Table.Cell>
							<Table.Cell>{country.region}</Table.Cell>
							<Table.Cell align="right">{country.population.toLocaleString()}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>

			<Pagination.Root count={countries.length} pageSize={pageSize} page={page}>
				<ButtonGroup variant="ghost" size="sm" wrap="wrap">
					<Pagination.PrevTrigger asChild onClick={() => setPage(page - 1)}>
						<IconButton>
							<LuChevronLeft />
						</IconButton>
					</Pagination.PrevTrigger>

					<Pagination.Items
						render={(page) => (
							<IconButton
								variant={{ base: 'ghost', _selected: 'outline' }}
								onClick={() => setPage(page.value)}
							>
								{page.value}
							</IconButton>
						)}
					/>

					<Pagination.NextTrigger asChild onClick={() => setPage(page + 1)}>
						<IconButton>
							<LuChevronRight />
						</IconButton>
					</Pagination.NextTrigger>
				</ButtonGroup>
			</Pagination.Root>
		</Box>
	);
}
