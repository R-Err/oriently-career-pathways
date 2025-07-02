
export interface CityMapping {
  city: string;
  province: string;
  region: string;
}

export const ITALIAN_CITIES: CityMapping[] = [
  { city: "Milano", province: "Milano", region: "Lombardia" },
  { city: "Roma", province: "Roma", region: "Lazio" },
  { city: "Torino", province: "Torino", region: "Piemonte" },
  { city: "Napoli", province: "Napoli", region: "Campania" },
  { city: "Palermo", province: "Palermo", region: "Sicilia" },
  { city: "Genova", province: "Genova", region: "Liguria" },
  { city: "Bologna", province: "Bologna", region: "Emilia-Romagna" },
  { city: "Firenze", province: "Firenze", region: "Toscana" },
  { city: "Bari", province: "Bari", region: "Puglia" },
  { city: "Catania", province: "Catania", region: "Sicilia" },
  { city: "Venezia", province: "Venezia", region: "Veneto" },
  { city: "Verona", province: "Verona", region: "Veneto" },
  { city: "Messina", province: "Messina", region: "Sicilia" },
  { city: "Padova", province: "Padova", region: "Veneto" },
  { city: "Trieste", province: "Trieste", region: "Friuli-Venezia Giulia" },
  { city: "Brescia", province: "Brescia", region: "Lombardia" },
  { city: "Parma", province: "Parma", region: "Emilia-Romagna" },
  { city: "Prato", province: "Prato", region: "Toscana" },
  { city: "Modena", province: "Modena", region: "Emilia-Romagna" },
  { city: "Reggio Calabria", province: "Reggio Calabria", region: "Calabria" }
];

export const findCityInfo = (cityName: string): CityMapping | null => {
  return ITALIAN_CITIES.find(
    city => city.city.toLowerCase() === cityName.toLowerCase()
  ) || null;
};
