
import { supabase } from "@/integrations/supabase/client";

export interface CityData {
  city: string;
  province: string;
  region: string;
  country: string;
}

export const getCityData = async (cityName: string): Promise<CityData | null> => {
  try {
    const { data, error } = await supabase
      .from('italian_cities')
      .select('city, province, region, country')
      .ilike('city', `%${cityName}%`)
      .limit(1)
      .single();

    if (error) {
      console.log('City not found in database:', cityName);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
};

export const searchCities = async (query: string): Promise<CityData[]> => {
  try {
    const { data, error } = await supabase
      .from('italian_cities')
      .select('city, province, region, country')
      .ilike('city', `%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching cities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};
