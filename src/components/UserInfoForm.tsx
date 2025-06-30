
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findCityData } from "@/data/italianCities";
import { UserProfile } from "@/types/course";

interface UserInfoFormProps {
  onSubmit: (userInfo: UserProfile) => void;
  onBack: () => void;
}

const UserInfoForm = ({ onSubmit, onBack }: UserInfoFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("Inserisci il tuo nome");
      return;
    }

    if (!city.trim()) {
      setError("Inserisci la tua città");
      return;
    }

    const cityData = findCityData(city);
    if (!cityData) {
      setError("Città non trovata. Inserisci una città italiana valida.");
      return;
    }

    onSubmit({
      first_name: firstName.trim(),
      city: cityData.city,
      province: cityData.province,
      region: cityData.region,
      country: cityData.country,
    });
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Prima di vedere i risultati...
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">Come possiamo chiamarti? *</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Il tuo nome"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="city">In quale città vivi? *</Label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Es: Milano, Roma, Napoli..."
              className="mt-1"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Indietro
            </Button>
            
            <Button
              type="submit"
              className="bg-[#1E6AE2] hover:bg-[#1557C7]"
            >
              Continua
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserInfoForm;
