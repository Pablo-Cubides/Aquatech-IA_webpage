import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CountryStandards, Country } from '@/lib/types';
import { DOMINIOS } from '@/lib/constants';
import { getFlagEmoji } from '@/lib/constants';
import { API_BASE, ROUTE_BASE } from '@/lib/api';

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
  const [selectedDomain, setSelectedDomain] = useState<string>('agua');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');

  // Data containers
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[] | null>(null);
  const [data, setData] = useState<CountryStandards | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetchUrl, setLastFetchUrl] = useState<string>('');

  const { value: searchQuery, debouncedValue: debouncedSearchQuery, setValue: setSearchQuery } = useDebouncedSearch('', 300);

  // Sync selections from URL params
  useEffect(() => {
    const dominio = searchParams.get('dominio') || 'agua';
    const pais = searchParams.get('pais') || '';
    const rawSector = searchParams.get('sector');
    const sectorFromUrl = rawSector ? String(rawSector).replace(/_/g, '-') : null;

    setSelectedDomain(dominio);
    setSelectedCountry(pais);
    if (sectorFromUrl) setSelectedSector(sectorFromUrl);
  }, [searchParams]);

  // Fetch countries for selected domain
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch(`${API_BASE}/paises?dominio=${selectedDomain}`);
        if (!res.ok) throw new Error('No se pudieron cargar países');
        const payload = await res.json();
        const countries = (payload.countries || []).map((c: any) => {
          const code = String(c.code ?? '');
          const name = String(c.name ?? '');
          return { ...(c || {}), code, name, flag: getFlagEmoji(code, name) || '🏳️' } as Country;
        });
        setAvailableCountries(countries);
        setData(null);
      } catch (e) {
        console.error('[explorar] fetchCountries ERROR', e);
        setAvailableCountries([]);
      }
    }

    fetchCountries();
  }, [selectedDomain]);

  // Fetch sectors for selected country + domain
  useEffect(() => {
    if (!selectedCountry) {
      setAvailableSectors(null);
      setSelectedSector('');
      return;
    }

    async function fetchSectors() {
      try {
        const res = await fetch(`${API_BASE}/sectores?dominio=${selectedDomain}&pais=${selectedCountry}`);
        if (!res.ok) throw new Error('No se pudieron cargar sectores');
        const payload = await res.json();
        const sectors = Array.isArray(payload.sectors) ? payload.sectors : [];
        const normalized = sectors.map((s: string) => String(s).replace(/_/g, '-'));
        setAvailableSectors(normalized);

        const sectorFromUrl = searchParams.get('sector');
        const normFromUrl = sectorFromUrl ? String(sectorFromUrl).replace(/_/g, '-') : null;
        if (normalized.length > 0) {
          if (normFromUrl && normalized.includes(normFromUrl)) setSelectedSector(normFromUrl);
          else setSelectedSector(normalized[0]);
        } else setSelectedSector('');
      } catch (e) {
        console.error('[explorar] fetchSectors ERROR', e);
        setAvailableSectors([]);
        setSelectedSector('');
      }
    }

    fetchSectors();
  }, [selectedCountry, selectedDomain]);

  // Fetch norms/data when selections change
  useEffect(() => {
    if (!selectedCountry) {
      setData(null);
      setLoading(false);
      return;
    }
    if (!availableSectors) return; // wait for sectors

    async function loadCountryData() {
      setLoading(true);
      setError('');
      try {
        const url = (availableSectors && availableSectors.length > 0 && selectedSector)
          ? `${API_BASE}/normas?pais=${selectedCountry}&dominio=${selectedDomain}&sector=${selectedSector}`
          : `${API_BASE}/normas?pais=${selectedCountry}&dominio=${selectedDomain}`;
        setLastFetchUrl(url);
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se pudieron cargar los datos');
        const payload = await res.json();
        setData(payload as CountryStandards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    loadCountryData();
  }, [selectedCountry, selectedDomain, selectedSector, availableSectors]);

  const currentDominio = useMemo(() => DOMINIOS.find(d => d.id === selectedDomain) || DOMINIOS[0], [selectedDomain]);
  const countryInfo = useMemo(() => availableCountries.find(c => c.code === selectedCountry), [availableCountries, selectedCountry]);
  const records = useMemo(() => (data?.records || data?.registros || []) as AnyRecord[], [data]);

  const filteredRecords = useMemo(() => {
    if (!debouncedSearchQuery) return records;
    const q = debouncedSearchQuery.toLowerCase();
    return records.filter(r => {
      const param = String((r as any).parameter ?? (r as any).parametro ?? '').toLowerCase();
      const limit = String((r as any).limit ?? (r as any).limite ?? '').toLowerCase();
      const unit = String((r as any).unit ?? (r as any).unidad ?? '').toLowerCase();
      const notes = String((((r as any).notes ?? (r as any).notas) as any[] ?? []).map(String).join(' ')).toLowerCase();
      return param.includes(q) || limit.includes(q) || unit.includes(q) || notes.includes(q);
    });
  }, [records, debouncedSearchQuery]);

  const sectionsToDisplay = useMemo(() => {
    const out: Record<string, AnyRecord[]> = {};
    filteredRecords.forEach(rec => {
      const key = String((rec as any)._sector ?? (rec as any).categoria ?? 'general');
      out[key] = out[key] || [];
      out[key].push(rec);
    });
    return out;
  }, [filteredRecords]);

  const handleDomainChange = useCallback((domainId: string) => {
    setSelectedDomain(domainId);
    setSelectedCountry('');
    setData(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set('dominio', domainId);
    params.delete('pais');
    params.delete('sector');
  router.push(`${ROUTE_BASE}/explorar?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handleCountryChange = useCallback((countryCode: string) => {
    setSelectedCountry(countryCode);
    setSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.set('pais', countryCode);
    params.delete('sector');
  router.push(`${ROUTE_BASE}/explorar?${params.toString()}`, { scroll: false });
  }, [searchParams, router, setSearchQuery]);

  const handleSectorChange = useCallback((sector: string) => {
    setSelectedSector(sector);
    const params = new URLSearchParams(searchParams.toString());
    if (sector) params.set('sector', sector); else params.delete('sector');
  router.push(`${ROUTE_BASE}/explorar?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

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
