
import { getCityData as getSQLiteCityData, searchCities as searchSQLiteCities } from "./database";

export interface CityData {
  city: string;
  province: string;
  region: string;
  country: string;
}

export const getCityData = async (cityName: string): Promise<CityData | null> => {
  return getSQLiteCityData(cityName);
};

export const searchCities = async (query: string): Promise<CityData[]> => {
  return searchSQLiteCities(query);
};
