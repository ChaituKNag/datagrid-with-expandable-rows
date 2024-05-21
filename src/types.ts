export interface CityConfig {
    id: number,
    name: string
}
export interface CountryConfig {
    id: number,
    name: string,
    cities: CityConfig[]
}

export interface DataItem {
    countryId: CountryConfig['id'],
    cityId: CityConfig['id'],
    val1: number,
    val2: number,
    val3: number
}