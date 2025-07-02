
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ITALIAN_CITIES, CityMapping } from "@/data/cities";

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string, cityInfo: CityMapping | null) => void;
  error?: string;
}

const CityAutocomplete = ({ value, onChange, error }: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<CityMapping[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = ITALIAN_CITIES.filter(city =>
        city.city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue, null);
  };

  const handleCitySelect = (cityInfo: CityMapping) => {
    onChange(cityInfo.city, cityInfo);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Label htmlFor="city">In quale città vivi? *</Label>
      <Input
        ref={inputRef}
        id="city"
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Inizia a digitare il nome della città..."
        className={`mt-1 ${error ? 'border-red-500' : ''}`}
        autoComplete="off"
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      
      {isOpen && filteredCities.length > 0 && (
        <div 
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredCities.map((cityInfo, index) => (
            <div
              key={`${cityInfo.city}-${cityInfo.province}`}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              onClick={() => handleCitySelect(cityInfo)}
            >
              <div className="font-medium">{cityInfo.city}</div>
              <div className="text-sm text-gray-600">
                {cityInfo.province}, {cityInfo.region}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
