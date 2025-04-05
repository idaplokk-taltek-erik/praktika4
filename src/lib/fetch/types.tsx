export interface Country {
	// country-code ISO
	cca2: string;
	cca3: string;
	name: {
		common: string;
		official: string;
	};
	region: string;
	subregion: string;
	languages: string[];
	currencies: { name: string; symbol: string }[];
	population: number;
	capital: string[];
	flags: {
		png: string;
	};
}
