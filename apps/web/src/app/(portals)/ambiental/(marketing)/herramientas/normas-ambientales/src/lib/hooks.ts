import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CountryStandards, Country } from "@/lib/types";
import { DOMINIOS } from "@/lib/constants";
import { getFlagEmoji } from "@/lib/constants";
import { API_BASE, ROUTE_BASE } from "@/lib/api";

type AnyRecord = Record<string, unknown>;

// Lightweight debounced search hook
export function useDebouncedSearch(initialValue: string, delay = 300) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return { value, debouncedValue, setValue };
}

// Core hook used by the explorar page
export function useExplorarState() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selections
  const [selectedDomain, setSelectedDomain] = useState<string>("agua");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const isInitialLoad = useRef(true); // Track if this is the first load from URL
  const urlSectorRef = useRef<string>(""); // Store the sector from URL to preserve it

  // Data containers
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  type SectorItem = { id: string; label: string };
  const [availableSectors, setAvailableSectors] = useState<SectorItem[] | null>(
    null,
  );
  const [data, setData] = useState<CountryStandards | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetchUrl, setLastFetchUrl] = useState<string>("");

  const {
    value: searchQuery,
    debouncedValue: debouncedSearchQuery,
    setValue: setSearchQuery,
  } = useDebouncedSearch("", 300);

  // Sync selections from URL params on mount only
  useEffect(() => {
    try {
      // Normalize incoming params to a stable form (lowercase slugs)
      const dominio = String(
        searchParams.get("dominio") || "agua",
      ).toLowerCase();
      const paisRaw = searchParams.get("pais") || "";
      const pais = String(paisRaw).toLowerCase().replace(/\s+/g, "-");
      const rawSector = searchParams.get("sector");
      const sectorFromUrl = rawSector
        ? String(rawSector)
            .toLowerCase()
            .replace(/_/g, "-")
            .replace(/\s+/g, "-")
        : "";

      setSelectedDomain(dominio);
      setSelectedCountry(pais);
      setSelectedSector(sectorFromUrl);
      urlSectorRef.current = sectorFromUrl; // Store the URL sector

      // Mark that initial load is complete
      isInitialLoad.current = false;
    } catch (err) {
      console.error("Error syncing selections from URL:", err);
      isInitialLoad.current = false;
    }
  }, []); // Only on mount

  // Helper: fetch using API_BASE
  const fetchWithFallback = useCallback(async (path: string) => {
    try {
      const res = await fetch(`${API_BASE}${path}`);
      return res;
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  }, []);

  // Fetch countries for selected domain
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetchWithFallback(
          `/paises?dominio=${selectedDomain}`,
        );
        if (!res || !res.ok) throw new Error("No se pudieron cargar países");
        const payload = await res.json();
        const countries = (payload.countries || []).map((c: any) => {
          const code = String(c.code ?? "");
          const name = String(c.name ?? "");
          return {
            ...(c || {}),
            code,
            name,
            flag: getFlagEmoji(code, name) || "🏳️",
          } as Country;
        });
        setAvailableCountries(countries);
        setData(null);
      } catch (e) {
        console.error("[explorar] fetchCountries ERROR", e);
        setAvailableCountries([]);
      }
    }

    fetchCountries();
  }, [selectedDomain]);

  // Fetch sectors for selected country + domain
  useEffect(() => {
    if (!selectedCountry) {
      setAvailableSectors(null);
      setSelectedSector("");
      return;
    }

    async function fetchSectors() {
      try {
        const res = await fetchWithFallback(
          `/sectores?dominio=${selectedDomain}&pais=${selectedCountry}`,
        );
        if (!res || !res.ok) throw new Error("No se pudieron cargar sectores");
        const payload = await res.json();
        const sectors = Array.isArray(payload.sectors) ? payload.sectors : [];

        // Normalize into { id, label } objects — accept legacy string arrays or new object arrays
        const normalizedSectors = sectors
          .map((s: unknown) => {
            if (typeof s === "string") {
              const raw = String(s);
              const id = raw
                .replace(/_/g, "-")
                .replace(/\s+/g, "-")
                .toLowerCase();
              const label = raw
                .replace(/_/g, " ")
                .replace(/-/g, " ")
                .replace(/\s+/g, " ")
                .trim();
              return { id, label } as SectorItem;
            }
            if (s && typeof s === "object") {
              const obj = s as Record<string, unknown>;
              const idRaw = String(obj.id ?? obj.slug ?? obj.key ?? "");
              const id = idRaw
                ? idRaw.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase()
                : "";
              const label = String(
                (obj.label ?? obj.name ?? obj.title ?? idRaw) || "",
              )
                .replace(/_/g, " ")
                .replace(/-/g, " ");
              return { id, label } as SectorItem;
            }
            return null;
          })
          .filter(Boolean) as SectorItem[];

        // Set empty array for domains without sectors (e.g., aire, residuos-solidos)
        // This signals "sectors loaded, but none exist" vs null "not loaded yet"
        setAvailableSectors(
          normalizedSectors.length > 0 ? normalizedSectors : [],
        );

        // Only auto-select first sector if:
        // 1. Not the initial load with a URL sector (user is navigating between countries)
        // 2. OR no sector was specified in URL
        // 3. AND the current sector doesn't exist in new sectors list
        if (normalizedSectors.length > 0) {
          const currentSectorExists =
            selectedSector &&
            normalizedSectors.find((s) => s.id === selectedSector);

          // If there was a URL sector and this is first time loading sectors, keep the URL sector
          if (urlSectorRef.current && isInitialLoad.current) {
            // Don't change sector on initial load if one was specified in URL
            isInitialLoad.current = false; // Mark as processed
            return;
          }

          // If current sector doesn't exist in new country, select first available
          if (!currentSectorExists) {
            setSelectedSector(normalizedSectors[0].id);
          }
        } else {
          // No sectors available for this domain (e.g., aire, residuos-solidos)
          setSelectedSector("");
        }
      } catch (e) {
        console.error("[explorar] fetchSectors ERROR", e);
        setAvailableSectors([]);
        setSelectedSector("");
      }
    }

    fetchSectors();
  }, [selectedCountry, selectedDomain]); // Removed selectedSector to avoid loops, isInitialLoad is a ref so doesn't need to be in deps

  // Fetch norms/data when selections change
  useEffect(() => {
    if (!selectedCountry) {
      setData(null);
      setLoading(false);
      return;
    }
    // Wait for sectors to load (null = loading, [] = no sectors available, [...] = sectors exist)
    if (availableSectors === null) return;

    async function loadCountryData() {
      setLoading(true);
      setError("");
      try {
        // Only include sector in request if:
        // 1. Sectors exist for this domain (availableSectors.length > 0)
        // 2. A sector is selected
        // 3. The selected sector exists in availableSectors
        const hasSectors = availableSectors && availableSectors.length > 0;
        const validSector =
          hasSectors &&
          selectedSector &&
          availableSectors.find((s) => s.id === selectedSector)
            ? selectedSector
            : null;

        const urlPath =
          hasSectors && validSector
            ? `/normas?pais=${selectedCountry}&dominio=${selectedDomain}&sector=${validSector}`
            : `/normas?pais=${selectedCountry}&dominio=${selectedDomain}`;
        const fullUrl = `${API_BASE}${urlPath}`;
        setLastFetchUrl(fullUrl);
        const res = await fetchWithFallback(urlPath);
        if (!res || !res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "No se pudieron cargar los datos");
        }
        const payload = await res.json();
        setData(payload as CountryStandards);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    loadCountryData();
  }, [selectedCountry, selectedDomain, selectedSector, availableSectors]);

  const currentDominio = useMemo(
    () => DOMINIOS.find((d) => d.id === selectedDomain) || DOMINIOS[0],
    [selectedDomain],
  );
  const countryInfo = useMemo(
    () =>
      availableCountries.find(
        (c) => c.code.toLowerCase() === selectedCountry.toLowerCase(),
      ),
    [availableCountries, selectedCountry],
  );
  const records = useMemo(
    () => (data?.records || data?.registros || []) as AnyRecord[],
    [data],
  );

  const filteredRecords = useMemo(() => {
    if (!debouncedSearchQuery) return records;
    const q = debouncedSearchQuery.toLowerCase();
    return records.filter((r) => {
      const param = String(
        (r as any).parameter ?? (r as any).parametro ?? "",
      ).toLowerCase();
      const limit = String(
        (r as any).limit ?? (r as any).limite ?? "",
      ).toLowerCase();
      const unit = String(
        (r as any).unit ?? (r as any).unidad ?? "",
      ).toLowerCase();
      const notes = String(
        ((((r as any).notes ?? (r as any).notas) as any[]) ?? [])
          .map(String)
          .join(" "),
      ).toLowerCase();
      return (
        param.includes(q) ||
        limit.includes(q) ||
        unit.includes(q) ||
        notes.includes(q)
      );
    });
  }, [records, debouncedSearchQuery]);

  const sectionsToDisplay = useMemo(() => {
    const out: Record<string, AnyRecord[]> = {};
    filteredRecords.forEach((rec) => {
      const key = String(
        (rec as any)._sector ?? (rec as any).categoria ?? "general",
      );
      out[key] = out[key] || [];
      out[key].push(rec);
    });
    return out;
  }, [filteredRecords]);

  const handleDomainChange = useCallback(
    (domainId: string) => {
      setSelectedDomain(domainId);
      setSelectedCountry("");
      setSelectedSector(""); // Clear sector when changing domain
      setData(null);
      const params = new URLSearchParams(searchParams.toString());
      params.set("dominio", domainId);
      params.delete("pais");
      params.delete("sector");
      router.push(`${ROUTE_BASE}/explorar?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router],
  );

  const handleCountryChange = useCallback(
    (countryCode: string) => {
      setSelectedCountry(countryCode);
      setSelectedSector(""); // Clear sector immediately when changing country
      setSearchQuery("");
      const params = new URLSearchParams(searchParams.toString());
      params.set("pais", countryCode);
      params.delete("sector");
      router.push(`${ROUTE_BASE}/explorar?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, setSearchQuery],
  );

  const handleSectorChange = useCallback(
    (sector: string) => {
      setSelectedSector(sector);
      const params = new URLSearchParams(searchParams.toString());
      if (sector) params.set("sector", sector);
      else params.delete("sector");
      router.push(`${ROUTE_BASE}/explorar?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router],
  );

  return {
    selectedDomain,
    selectedCountry,
    selectedSector,
    availableCountries,
    availableSectors,
    data,
    loading,
    error,
    lastFetchUrl,
    searchQuery,
    debouncedSearchQuery,
    currentDominio,
    countryInfo,
    records,
    filteredRecords,
    sectionsToDisplay,
    handleDomainChange,
    handleCountryChange,
    handleSectorChange,
    setSearchQuery,
  };
}
