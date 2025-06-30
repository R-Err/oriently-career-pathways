
import { getCityData as getSQLiteCityData, searchCities as searchSQLiteCities } from "./database";

export interface CityData {
  city: string;
  province: string;
  region: string;
  country: string;
}

export const getCityData = async (cityName: string): Promise<CityData | null> => {
  const result = await getSQLiteCityData(cityName);
  if (!result) return null;
  
  return result as CityData;
};

export const searchCities = async (query: string): Promise<CityData[]> => {
  const results = await searchSQLiteCities(query);
  return results as CityData[];
};
