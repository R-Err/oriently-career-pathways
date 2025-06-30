
export interface CityData {
  city: string;
  province: string;
  region: string;
  country: string;
}

// Sample Italian cities data - in production this would be loaded from a complete dataset
export const ITALIAN_CITIES: CityData[] = [
  { city: "Roma", province: "Roma", region: "Lazio", country: "Italia" },
  { city: "Milano", province: "Milano", region: "Lombardia", country: "Italia" },
  { city: "Napoli", province: "Napoli", region: "Campania", country: "Italia" },
  { city: "Torino", province: "Torino", region: "Piemonte", country: "Italia" },
  { city: "Palermo", province: "Palermo", region: "Sicilia", country: "Italia" },
  { city: "Genova", province: "Genova", region: "Liguria", country: "Italia" },
  { city: "Bologna", province: "Bologna", region: "Emilia-Romagna", country: "Italia" },
  { city: "Firenze", province: "Firenze", region: "Toscana", country: "Italia" },
  { city: "Bari", province: "Bari", region: "Puglia", country: "Italia" },
  { city: "Catania", province: "Catania", region: "Sicilia", country: "Italia" },
  { city: "Venezia", province: "Venezia", region: "Veneto", country: "Italia" },
  { city: "Verona", province: "Verona", region: "Veneto", country: "Italia" },
  { city: "Messina", province: "Messina", region: "Sicilia", country: "Italia" },
  { city: "Padova", province: "Padova", region: "Veneto", country: "Italia" },
  { city: "Trieste", province: "Trieste", region: "Friuli-Venezia Giulia", country: "Italia" }
];

export const findCityData = (cityName: string): CityData | null => {
  const normalizedInput = cityName.toLowerCase().trim();
  return ITALIAN_CITIES.find(city => 
    city.city.toLowerCase() === normalizedInput
  ) || null;
};
