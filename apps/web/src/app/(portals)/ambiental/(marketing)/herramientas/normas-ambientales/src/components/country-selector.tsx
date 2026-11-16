"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";
import { ROUTE_BASE } from "../lib/api";

const AVAILABLE_COUNTRIES = [
  { code: "argentina", name: "Argentina", flag: "🇦🇷" },
  { code: "chile", name: "Chile", flag: "🇨🇱" },
  { code: "colombia", name: "Colombia", flag: "🇨🇴" },
  { code: "el-salvador", name: "El Salvador", flag: "🇸🇻" },
  { code: "estados-unidos", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "mexico", name: "México", flag: "🇲🇽" },
  { code: "peru", name: "Perú", flag: "🇵🇪" },
  { code: "union-europea", name: "Unión Europea", flag: "🇪🇺" },
];

export function CountrySelector() {
  // Initialize state with saved country from localStorage
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected-country");
      return saved && AVAILABLE_COUNTRIES.find((c) => c.code === saved)
        ? saved
        : "";
    }
    return "";
  });
  const router = useRouter();

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    localStorage.setItem("selected-country", countryCode);

    // Auto-navigate to explore page with selected country
    setTimeout(() => {
      router.push(`${ROUTE_BASE}/explorar?pais=${countryCode}`);
    }, 500);
  };

  return (
    <Select value={selectedCountry} onValueChange={handleCountryChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona un país para explorar sus estándares de calidad del agua" />
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_COUNTRIES.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
