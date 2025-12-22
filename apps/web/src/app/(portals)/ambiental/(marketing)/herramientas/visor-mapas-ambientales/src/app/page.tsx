"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UploadWizard from "../components/UploadWizard";
import SearchBar from "../components/SearchBar";
import MapLegend from "../components/MapLegend";
import ExportButtons from "../components/ExportButtons";
import OpenAQLayerControl from "../components/OpenAQLayerControl";
import EONETLayerControl from "../components/EONETLayerControl";
import GBIFLayerControl, { type GBIFFilters } from "@/components/GBIFLayerControl";
import WQPLayerControl, { type WQPFilters } from "@/components/WQPLayerControl";
import RangeFilter from "../components/RangeFilter";
import ErrorBoundary from "../components/ErrorBoundary";
import type {
  DatasetMetadata,
  GeoJSONFeature,
  FilterState,
  User,
} from "../types";
import { logger } from "@/lib/logger";
// import { getAQIColor, getAQICategory } from "../lib/openaq";
import { getParameterLegendRanges } from "../lib/openaq";
import { searchOccurrences, getTaxonColor } from "@/lib/gbif";
import { searchStations, getSiteTypeColor, US_STATES } from "@/lib/wqp";

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([]);
  const [selectedDataset, setSelectedDataset] =
    useState<DatasetMetadata | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [unfilteredData, setUnfilteredData] = useState<GeoJSONFeature[]>([]);
  const [currentData, setCurrentData] = useState<GeoJSONFeature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -74.0721, 4.711,
  ]);
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    parameters: [],
  });
  const [openAQData, setOpenAQData] = useState<GeoJSONFeature[]>([]);
  const [showOpenAQLayer, setShowOpenAQLayer] = useState(false);
  const [openAQParameter, setOpenAQParameter] = useState<string>('pm25');
  const [eonetData, setEonetData] = useState<GeoJSONFeature[]>([]);
  const [showEONETLayer, setShowEONETLayer] = useState(false);
  const [gbifData, setGbifData] = useState<GeoJSONFeature[]>([]);
  const [showGBIFLayer, setShowGBIFLayer] = useState(false);
  const [gbifFilters, setGbifFilters] = useState<GBIFFilters>({});
  const [wqpData, setWqpData] = useState<GeoJSONFeature[]>([]);
  const [showWQPLayer, setShowWQPLayer] = useState(false);
  const [wqpFilters, setWqpFilters] = useState<WQPFilters>({ statecode: "US:06" }); // Default to California
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const [isDetailsPanelCollapsed, setIsDetailsPanelCollapsed] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [parameterRanges, setParameterRanges] = useState<Record<string, { min: number; max: number }>>({});
  const [activeRangeFilters, setActiveRangeFilters] = useState<Record<string, { min: number; max: number }>>({});

  // Memoize callbacks to prevent infinite renders
  const handleOpenAQDataLoad = useCallback((data: GeoJSONFeature[]) => {
    setOpenAQData(data);
  }, []);

  const handleOpenAQLoadingChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const handleOpenAQError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const handleEONETDataLoad = useCallback((data: GeoJSONFeature[]) => {
    setEonetData(data);
  }, []);

  const handleEONETLoadingChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const handleEONETError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const handleGBIFDataLoad = useCallback((data: GeoJSONFeature[]) => {
    setGbifData(data);
  }, []);

  const handleGBIFLoadingChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const handleGBIFError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const handleWQPDataLoad = useCallback((data: GeoJSONFeature[]) => {
    setWqpData(data);
  }, []);

  const handleWQPLoadingChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const handleWQPError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  const { data: session } = useSession();

  // Sync session with local user state
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setUser({
        id: user.id || "unknown", // Fallback if id missing
        email: user.email || "",
        role: user.role || "user", 
      });
    } else {
      setUser(null);
    }
  }, [session]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Mock datasets for development - TODO: Replace with real API data
  useEffect(() => {
    // Keep mock datasets for now until API is ready
    const mockDatasets: DatasetMetadata[] = [
      {
        id: "1",
        name: "Monitoreo Río Magdalena 2024",
        description: "Datos de calidad del agua del Río Magdalena",
        owner_id: "1",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        column_mapping: {
          lat: "latitud",
          lon: "longitud",
          fecha: "fecha_muestreo",
          pais: "pais",
          departamento: "departamento",
          ciudad: "municipio",
          parameters: {
            DBO: "dbo_mg_l",
            DQO: "dqo_mg_l",
            pH: "ph",
          },
        },
        available_dates: [
          "2024-01-15",
          "2024-01-16",
          "2024-01-17",
          "2024-01-18",
          "2024-01-19",
        ],
        parameters: ["DBO", "DQO", "pH"],
        units: {
          DBO: "mg/L",
          DQO: "mg/L",
          pH: "unidades",
        },
      },
    ];
    setDatasets(mockDatasets);
  }, []);

  // Handle dataset selection
  useEffect(() => {
    if (selectedDataset) {
      console.log("[PAGE] Dataset selected:", selectedDataset.name);
      setAvailableDates(selectedDataset.available_dates);
      setSelectedDate(selectedDataset.available_dates[0] || "");
      // Auto-select first parameter
      const firstParam = selectedDataset.parameters[0];
      setFilters({ parameters: firstParam ? [firstParam] : [] });
      console.log(
        "[PAGE] Set date to:",
        selectedDataset.available_dates[0],
        "and auto-selected parameter:",
        firstParam,
      );
    }
  }, [selectedDataset]);

  // Load data for selected date
  useEffect(() => {
    console.log("[PAGE] Load data effect triggered:", {
      hasDataset: !!selectedDataset,
      hasDate: !!selectedDate,
      dataset: selectedDataset?.name,
      date: selectedDate,
    });

    if (selectedDataset && selectedDate) {
      // Mock data base - different data per date
      const allMockData: Record<string, GeoJSONFeature[]> = {
        "2024-01-15": [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0721, 4.711] },
            properties: {
              id: "1",
              fecha: "2024-01-15",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 25.5,
              DQO: 45.2,
              pH: 7.2,
              estacion: "EST-001",
            },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0821, 4.721] },
            properties: {
              id: "2",
              fecha: "2024-01-15",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 18.3,
              DQO: 32.1,
              pH: 6.9,
              estacion: "EST-002",
            },
          },
        ],
        "2024-01-16": [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0621, 4.701] },
            properties: {
              id: "3",
              fecha: "2024-01-16",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 22.1,
              DQO: 38.5,
              pH: 7.0,
              estacion: "EST-003",
            },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0421, 4.681] },
            properties: {
              id: "3b",
              fecha: "2024-01-16",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              // Este punto solo tiene pH, no DBO ni DQO
              pH: 7.5,
              estacion: "EST-003B",
            },
          },
        ],
        "2024-01-17": [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0921, 4.731] },
            properties: {
              id: "4",
              fecha: "2024-01-17",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 28.7,
              DQO: 52.3,
              pH: 7.4,
              estacion: "EST-004",
            },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0521, 4.691] },
            properties: {
              id: "5",
              fecha: "2024-01-17",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 15.2,
              DQO: 28.9,
              pH: 6.8,
              estacion: "EST-005",
            },
          },
        ],
        "2024-01-18": [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0771, 4.716] },
            properties: {
              id: "6",
              fecha: "2024-01-18",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 20.5,
              DQO: 35.8,
              pH: 7.1,
              estacion: "EST-006",
            },
          },
        ],
        "2024-01-19": [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0671, 4.706] },
            properties: {
              id: "7",
              fecha: "2024-01-19",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 19.8,
              DQO: 33.4,
              pH: 6.95,
              estacion: "EST-007",
            },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0871, 4.726] },
            properties: {
              id: "8",
              fecha: "2024-01-19",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 24.3,
              DQO: 41.7,
              pH: 7.3,
              estacion: "EST-008",
            },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-74.0571, 4.696] },
            properties: {
              id: "9",
              fecha: "2024-01-19",
              pais: "Colombia",
              departamento: "Cundinamarca",
              ciudad: "Bogotá",
              DBO: 17.5,
              DQO: 30.2,
              pH: 6.85,
              estacion: "EST-009",
            },
          },
        ],
      };

      const dataForDate = allMockData[selectedDate] || [];
      console.log(
        "[PAGE] Loading data for date",
        selectedDate,
        ":",
        dataForDate.length,
        "points",
      );
      setUnfilteredData(dataForDate);
    } else {
      console.log("[PAGE] NOT loading data - conditions not met");
      setUnfilteredData([]);
    }
  }, [selectedDataset, selectedDate]);

  // Apply parameter filters and range filters
  useEffect(() => {
    if (filters.parameters.length === 0) {
      // No parameters selected - show NO points
      console.log(
        "[PAGE] No parameters selected - hiding all points (user must select at least one parameter)",
      );
      setCurrentData([]);
    } else {
      // Filter data to show points that have AT LEAST ONE of the selected parameters
      let filtered = unfilteredData.filter((feature) => {
        return filters.parameters.some((param: string) => {
          const value = feature.properties[param];
          return value !== null && value !== undefined;
        });
      });

      // Apply range filters
      filtered = filtered.filter((feature) => {
        return Object.keys(activeRangeFilters).every((param) => {
          const value = feature.properties[param];
          if (value === null || value === undefined) return true;
          const numValue = typeof value === "number" ? value : parseFloat(String(value));
          if (isNaN(numValue)) return true;
          const range = activeRangeFilters[param];
          return numValue >= range.min && numValue <= range.max;
        });
      });

      console.log(
        "[PAGE] Showing points with parameters:",
        filters.parameters.join(", "),
        "→",
        filtered.length,
        "of",
        unfilteredData.length,
        "points",
      );
      setCurrentData(filtered);
    }
  }, [unfilteredData, filters.parameters, activeRangeFilters]);

  // Calculate parameter ranges when dataset or date changes
  useEffect(() => {
    if (unfilteredData.length === 0 || !selectedDataset) {
      setParameterRanges({});
      setActiveRangeFilters({});
      return;
    }

    const ranges: Record<string, { min: number; max: number }> = {};

    selectedDataset.parameters.forEach((param: string) => {
      const values = unfilteredData
        .map((f) => f.properties[param])
        .filter((v) => v !== null && v !== undefined)
        .map((v) => (typeof v === "number" ? v : parseFloat(String(v))))
        .filter((v) => !isNaN(v));

      if (values.length > 0) {
        ranges[param] = {
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    });

    setParameterRanges(ranges);
    setActiveRangeFilters(ranges);
  }, [unfilteredData, selectedDataset]);

  // Load GBIF data when layer is enabled
  useEffect(() => {
    if (!showGBIFLayer) {
      setGbifData([]);
      return;
    }

    const loadGBIFData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await searchOccurrences({
          country: gbifFilters.country || 'CO', // Use filter or default to Colombia
          taxonKey: gbifFilters.taxonKey,
          basisOfRecord: gbifFilters.basisOfRecord,
          year: gbifFilters.year,
          limit: 300,
        });

        // Convert GBIF occurrences to GeoJSON features
        const features: GeoJSONFeature[] = result.results.map((occurrence) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [occurrence.decimalLongitude, occurrence.decimalLatitude],
          },
          properties: {
            id: occurrence.key.toString(),
            _layerType: "gbif",
            scientificName: occurrence.scientificName,
            kingdom: occurrence.kingdom,
            phylum: occurrence.phylum,
            class: occurrence.class,
            order: occurrence.order,
            family: occurrence.family,
            genus: occurrence.genus,
            species: occurrence.species,
            basisOfRecord: occurrence.basisOfRecord,
            eventDate: occurrence.eventDate,
            year: occurrence.year,
            country: occurrence.country,
            classKey: occurrence.classKey,
            phylumKey: occurrence.phylumKey,
            kingdomKey: occurrence.kingdomKey,
            _color: getTaxonColor({
              classKey: occurrence.classKey,
              phylumKey: occurrence.phylumKey,
              kingdomKey: occurrence.kingdomKey
            }),
          },
        }));

        setGbifData(features);
        logger.info(`Loaded ${features.length} GBIF occurrences`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error loading GBIF data";
        setError(errorMsg);
        logger.error("Failed to load GBIF data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGBIFData();
  }, [showGBIFLayer, gbifFilters]);

  // Load WQP data when layer is enabled
  useEffect(() => {
    if (!showWQPLayer) {
      setWqpData([]);
      return;
    }

    const loadWQPData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the selected state's bounding box
        const selectedStateCode = wqpFilters.statecode || "US:06"; // Default to California
        const selectedState = US_STATES.find(s => s.code === selectedStateCode);
        const stateBBox = selectedState?.bbox || "-124.48,32.53,-114.13,42.01"; // Default CA bbox
        
        logger.info(`Loading WQP data for ${selectedState?.name || 'California'}`);
        
        const result = await searchStations({
          bBox: stateBBox,
          statecode: selectedStateCode,
          countrycode: "US",
          characteristicName: wqpFilters.characteristicName,
          characteristicType: wqpFilters.characteristicType,
          siteType: wqpFilters.siteType,
          startDateLo: wqpFilters.startDateLo,
          providers: ["NWIS", "STORET"],
          resultLimit: 5000, // Limit to 5000 stations for performance
        });

        // Convert WQP stations to GeoJSON features
        const features: GeoJSONFeature[] = result.stations.map((station) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [station.LongitudeMeasure, station.LatitudeMeasure],
          },
          properties: {
            id: station.MonitoringLocationIdentifier,
            _layerType: "wqp",
            source: "wqp",
            stationName: station.MonitoringLocationName || station.MonitoringLocationIdentifier,
            siteType: station.MonitoringLocationTypeName,
            organization: station.OrganizationFormalName,
            provider: station.ProviderName,
            description: station.MonitoringLocationDescriptionText,
            country: station.CountryCode,
            _color: getSiteTypeColor(station.MonitoringLocationTypeName),
          },
        }));

        setWqpData(features);
        logger.info(`Loaded ${features.length} WQP stations`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error loading WQP data";
        setError(errorMsg);
        logger.error("Failed to load WQP data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWQPData();
  }, [showWQPLayer, wqpFilters]);

  const handleUploadComplete = () => {
    logger.info("Upload completed successfully");
    setShowUploadWizard(false);
    // TODO: Process uploaded data and refresh datasets
  };

  // Mostrar wizard solo si el usuario está autenticado
  const handleShowUploadWizard = () => {
    if (!user) {
      // Disparar modal de login global
      document.dispatchEvent(new CustomEvent('open-auth-modal'));
      return;
    }
    setShowUploadWizard(true);
  };

  return (
    <ErrorBoundary>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary-600 focus:text-white focus:font-semibold"
      >
        Saltar al contenido principal
      </a>

      <main id="main-content" className="flex flex-col h-screen">
        {/* Header */}
        <header
          className="bg-white border-b border-gray-200 shadow-sm"
          role="banner"
        >
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Abrir filtros"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-3 flex-1 lg:flex-initial">
                {/* Logo */}
                <h1 className="sr-only">Visor de Mapas Ambientales - AquatechIA</h1>
                <div className="relative w-auto h-20 sm:h-32 lg:h-40 hidden sm:block aspect-[2/1]">
                  <Image
                    src="/images/Portal ambiental/Herramientas/GeoVisor.png"
                    alt="Geovisor AquatechIA"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <select
                  className="w-full sm:w-64 input-field text-sm sm:text-base"
                  value={selectedDataset?.id || ""}
                  onChange={(e) => {
                    const dataset = datasets.find(
                      (d) => d.id === e.target.value,
                    );
                    setSelectedDataset(dataset || null);
                  }}
                  aria-label="Seleccionar dataset de datos ambientales"
                  aria-describedby="dataset-description"
                >
                  <option value="">Seleccionar dataset...</option>
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
                <span id="dataset-description" className="sr-only">
                  Seleccione un conjunto de datos ambientales para visualizar en
                  el mapa
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search Bar - Hidden on mobile */}
                {(currentData.length > 0 || openAQData.length > 0 || eonetData.length > 0) && (
                  <div className="hidden md:block">
                    <SearchBar
                      data={[...currentData, ...openAQData, ...eonetData]}
                      onResultSelect={(feature) => {
                        setSelectedFeature(feature);
                        setMapCenter([
                          feature.geometry.coordinates[0] as number,
                          feature.geometry.coordinates[1] as number,
                      ]);
                    }}
                  />
                  </div>
                )}
                
                {/* Export Buttons - Hidden on mobile */}
                {(currentData.length > 0 || openAQData.length > 0 || eonetData.length > 0) && (
                  <div className="hidden sm:block">
                    <ExportButtons
                      data={[...currentData, ...openAQData, ...eonetData]}
                      datasetName={
                        showEONETLayer
                          ? "NASA-EONET"
                          : showOpenAQLayer
                          ? "OpenAQ"
                          : selectedDataset?.name || "datos"
                      }
                    />
                  </div>
                )}
                
                <a
                  href="/guia"
                  className="hidden sm:flex items-center btn-secondary text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir guía de uso en nueva pestaña"
                >
                  📖 <span className="hidden lg:inline ml-1">Guía de uso</span>
                </a>
                {user && (user.role === "admin" || user.role === "uploader") && (
                  <button
                    className="btn-primary text-sm"
                    onClick={() => setShowUploadWizard(true)}
                    aria-label="Abrir asistente para subir nuevos datos ambientales"
                  >
                    + Subir datos
                  </button>
                )}
                {user ? (
                  <button
                    className="btn-secondary"
                    onClick={() => setUser(null)}
                    aria-label="Cerrar sesión y volver al inicio"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                   <button
                    className="btn-primary text-sm"
                    onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))}
                    aria-label="Iniciar sesión"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>

            {/* Date tabs */}
            {selectedDataset && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex space-x-1 overflow-x-auto">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                        selectedDate === date
                          ? "text-primary-600 border-primary-500"
                          : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 relative overflow-hidden">
          {/* Filters panel - Desktop sidebar / Mobile drawer */}
          <aside
            className={`
              fixed lg:relative inset-y-0 left-0 z-30
              transform lg:transform-none transition-transform duration-300 ease-in-out
              ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              w-80 p-6 overflow-y-auto bg-white border-r border-gray-200
              lg:block
            `}
          >
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              aria-label="Cerrar filtros"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Filtros
            </h2>

            <div className="space-y-4">
              {/* OpenAQ Layer Control */}
              <OpenAQLayerControl
                onToggle={setShowOpenAQLayer}
                onDataLoad={handleOpenAQDataLoad}
                onLoadingChange={handleOpenAQLoadingChange}
                onError={handleOpenAQError}
                onParameterChange={setOpenAQParameter}
              />

              {/* NASA EONET Layer Control */}
              <EONETLayerControl
                enabled={showEONETLayer}
                onToggle={setShowEONETLayer}
                onDataLoad={handleEONETDataLoad}
                onLoadingChange={handleEONETLoadingChange}
                onError={handleEONETError}
              />

              {/* GBIF Biodiversity Layer Control */}
              <GBIFLayerControl
                onToggle={setShowGBIFLayer}
                onFiltersChange={setGbifFilters}
                occurrenceCount={gbifData.length}
              />

              {/* WQP Water Quality Layer Control */}
              <WQPLayerControl
                onToggle={setShowWQPLayer}
                onFiltersChange={setWqpFilters}
                stationCount={wqpData.length}
              />

              <hr className="my-4" />
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  País
                </label>
                <select
                  className="input-field"
                  value={filters.pais || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      pais: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">Todos los países</option>
                  <option value="Colombia">Colombia</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Departamento
                </label>
                <select
                  className="input-field"
                  value={filters.departamento || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      departamento: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">Todos los departamentos</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <select
                  className="input-field"
                  value={filters.ciudad || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      ciudad: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">Todas las ciudades</option>
                  <option value="Bogotá">Bogotá</option>
                </select>
              </div>

              {selectedDataset && (
                <>
                  <hr className="my-4" />
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Parámetros
                    </h3>
                    <div className="space-y-2">
                      {selectedDataset.parameters.map((param: string) => (
                        <label key={param} className="flex items-center">
                          <input
                            type="checkbox"
                            className="border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                            checked={filters.parameters.includes(param)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({
                                  ...filters,
                                  parameters: [...filters.parameters, param],
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  parameters: filters.parameters.filter(
                                    (p: string) => p !== param,
                                  ),
                                });
                              }
                            }}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {param} ({selectedDataset.units[param] || "N/A"})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Range Filters */}
                  {filters.parameters.length > 0 && (
                    <>
                      <hr className="my-4" />
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-gray-700">
                          Filtros de Rango
                        </h3>
                        <div className="space-y-4">
                          {filters.parameters.map((param: string) => {
                            const range = parameterRanges[param];
                            if (!range) return null;

                            const activeRange = activeRangeFilters[param] || range;

                            return (
                              <RangeFilter
                                key={param}
                                label={param}
                                min={range.min}
                                max={range.max}
                                currentMin={activeRange.min}
                                currentMax={activeRange.max}
                                unit={selectedDataset?.units[param] || ""}
                                onChange={(min, max) => {
                                  setActiveRangeFilters({
                                    ...activeRangeFilters,
                                    [param]: { min, max },
                                  });
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </aside>

          {/* Mobile overlay */}
          {isMobileFiltersOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
          )}

          {/* Map container */}
          <div className="relative flex-1">
            <MapComponent
              data={[...currentData, ...openAQData, ...eonetData, ...gbifData, ...wqpData]}
              onPointClick={(feature) => {
                setSelectedFeature(feature);
                setIsMobileDetailsOpen(true);
              }}
              selectedParameters={filters.parameters}
              colorByParameter={showOpenAQLayer || showEONETLayer || showGBIFLayer || showWQPLayer}
            />

            {/* Map Legend - OpenAQ */}
            {showOpenAQLayer && openAQData.length > 0 && (() => {
              const legendRanges = getParameterLegendRanges(openAQParameter);
              const parameterDisplayNames: Record<string, string> = {
                pm25: 'PM2.5',
                pm10: 'PM10',
                o3: 'Ozono (O₃)',
                no2: 'Dióxido de Nitrógeno (NO₂)',
                so2: 'Dióxido de Azufre (SO₂)',
                co: 'Monóxido de Carbono (CO)',
              };
              const displayName = parameterDisplayNames[openAQParameter] || openAQParameter.toUpperCase();
              return (
                <div className="absolute z-10 bottom-4 left-4">
                  <MapLegend
                    items={legendRanges}
                    title={`Calidad del Aire - ${displayName}`}
                    parameter="OpenAQ"
                    units={legendRanges[0]?.units || 'µg/m³'}
                  />
                </div>
              );
            })()}

            {/* Map Legend - NASA EONET */}
            {showEONETLayer && eonetData.length > 0 && (
              <div className="absolute z-10 bottom-4 left-4">
                <MapLegend
                  items={[
                    { color: "#ff4500", label: "Incendios", range: "" },
                    { color: "#dc143c", label: "Volcanes", range: "" },
                    { color: "#4169e1", label: "Tormentas", range: "" },
                    { color: "#1e90ff", label: "Inundaciones", range: "" },
                    { color: "#daa520", label: "Sequías", range: "" },
                    { color: "#8b4513", label: "Terremotos", range: "" },
                  ]}
                  title="Eventos Naturales"
                  parameter="NASA EONET"
                  units=""
                />
              </div>
            )}

            {/* Map Legend - GBIF */}
            {showGBIFLayer && gbifData.length > 0 && (
              <div className="absolute z-10 bottom-4 left-4">
                <MapLegend
                  items={[
                    { color: "#4A90E2", label: "Aves", range: "" },
                    { color: "#E67E22", label: "Mamíferos", range: "" },
                    { color: "#3498DB", label: "Peces", range: "" },
                    { color: "#9B59B6", label: "Insectos", range: "" },
                    { color: "#27AE60", label: "Plantas", range: "" },
                    { color: "#16A085", label: "Reptiles", range: "" },
                  ]}
                  title="Biodiversidad"
                  parameter="GBIF"
                  units=""
                />
              </div>
            )}

            {/* Map Legend - WQP */}
            {showWQPLayer && wqpData.length > 0 && (
              <div className="absolute z-10 bottom-4 left-4">
                <MapLegend
                  items={[
                    { color: "#3498db", label: "Río/Arroyo", range: "" },
                    { color: "#2ecc71", label: "Lago/Embalse", range: "" },
                    { color: "#9b59b6", label: "Pozo", range: "" },
                    { color: "#1abc9c", label: "Estuario/Océano", range: "" },
                    { color: "#27ae60", label: "Humedal", range: "" },
                  ]}
                  title="Calidad del Agua"
                  parameter="WQP (USGS/EPA)"
                  units=""
                />
              </div>
            )}

            {/* Overlay message when no dataset is selected */}
            {!selectedDataset && !showOpenAQLayer && !showEONETLayer && !showGBIFLayer && !showWQPLayer && (
              <div className="absolute inset-0 flex items-center justify-center bg-black pointer-events-none bg-opacity-30">
                <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                  <div className="mb-2 text-4xl text-gray-300">📊</div>
                  <p className="font-medium text-gray-700">
                    Selecciona un dataset para ver los datos
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    El mapa está listo para mostrar los puntos ambientales
                  </p>
                </div>
              </div>
            )}

            {/* Overlay message when dataset is selected but no date */}
            {selectedDataset && !selectedDate && (
              <div className="absolute inset-0 flex items-center justify-center bg-black pointer-events-none bg-opacity-30">
                <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                  <div className="mb-2 text-4xl text-gray-300">�</div>
                  <p className="font-medium text-gray-700">
                    Selecciona una fecha para ver los datos
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Dataset: {selectedDataset.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details panel - Desktop sidebar / Mobile bottom sheet */}
          <aside
            className={`
              fixed lg:relative bottom-0 left-0 right-0 lg:inset-auto z-30
              transform lg:transform-none transition-transform duration-300 ease-in-out
              ${isMobileDetailsOpen && selectedFeature ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
              max-h-[50vh] lg:max-h-full lg:h-auto
              p-6 overflow-y-auto bg-white border-t lg:border-t-0 lg:border-l border-gray-200
              w-full lg:w-80
              rounded-t-2xl lg:rounded-none
              shadow-2xl lg:shadow-none
            `}
          >
            {/* Mobile drag handle */}
            <div className="lg:hidden flex justify-center mb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileDetailsOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              aria-label="Cerrar detalles"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Detalles del punto
            </h2>

            {selectedFeature ? (
              <div className="space-y-4">
                {/* Check data source and display appropriate fields */}
                {selectedFeature.properties.source === "openaq" ? (
                  /* OpenAQ Air Quality Data */
                  <>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Estación de Calidad del Aire
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Estación:</span>{" "}
                          {String(selectedFeature.properties.location || "N/A")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Fecha:</span>{" "}
                          {selectedFeature.properties.date ? new Date(String(selectedFeature.properties.date)).toLocaleString('es-ES') : "N/A"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">País:</span>{" "}
                          {String(selectedFeature.properties.country || "N/A")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Ciudad:</span>{" "}
                          {String(selectedFeature.properties.city || "N/A")}
                        </p>
                        {String(selectedFeature.properties.entity) && String(selectedFeature.properties.entity) !== "N/A" && (
                          <p className="text-sm">
                            <span className="font-medium">Entidad:</span>{" "}
                            {String(selectedFeature.properties.entity)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Air Quality Measurement */}
                    <div>
                      <h3 className="font-medium text-gray-900">Medición de Calidad del Aire</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Parámetro:</span>
                          <span>{String(selectedFeature.properties.parameterDisplay || selectedFeature.properties.parameter)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Valor:</span>
                          <span className="font-semibold text-lg">
                            {selectedFeature.properties.value !== undefined 
                              ? `${selectedFeature.properties.value} ${String(selectedFeature.properties.units || 'µg/m³')}`
                              : "N/A"}
                          </span>
                        </div>
                        {String(selectedFeature.properties.sensorType) && String(selectedFeature.properties.sensorType) !== "N/A" && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Tipo de Sensor:</span>
                            <span className="text-xs">{String(selectedFeature.properties.sensorType)}</span>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          Fuente: OpenAQ
                        </div>
                      </div>
                    </div>
                  </>
                ) : selectedFeature.properties._eventType === "eonet" ? (
                  /* EONET Events */
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Evento Natural
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Categoría:</span>
                        <span>{String(selectedFeature.properties.categoria)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Estado:</span>
                        <span
                          className={
                            selectedFeature.properties.estado === "Activo"
                              ? "text-red-600 font-semibold"
                              : "text-gray-600"
                          }
                        >
                          {String(selectedFeature.properties.estado)}
                        </span>
                      </div>
                      {(selectedFeature.properties.descripcion && typeof selectedFeature.properties.descripcion !== 'undefined') ? (
                        <div className="text-sm">
                          <span className="font-medium">Descripción:</span>
                          <p className="mt-1 text-gray-600">
                            {String(selectedFeature.properties.descripcion)}
                          </p>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.link && typeof selectedFeature.properties.link !== 'undefined') ? (
                        <a
                          href={String(selectedFeature.properties.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 underline block mt-2"
                        >
                          🔗 Ver más información
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : selectedFeature.properties._layerType === "gbif" ? (
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Biodiversidad (GBIF)
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Especie:</span>
                        <span className="italic">{String(selectedFeature.properties.scientificName)}</span>
                      </div>
                      {(selectedFeature.properties.kingdom && typeof selectedFeature.properties.kingdom !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Reino:</span>
                          <span>{String(selectedFeature.properties.kingdom)}</span>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.family && typeof selectedFeature.properties.family !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Familia:</span>
                          <span>{String(selectedFeature.properties.family)}</span>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.basisOfRecord && typeof selectedFeature.properties.basisOfRecord !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Tipo:</span>
                          <span>{String(selectedFeature.properties.basisOfRecord)}</span>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.eventDate && typeof selectedFeature.properties.eventDate !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Fecha:</span>
                          <span>{String(selectedFeature.properties.eventDate)}</span>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.country && typeof selectedFeature.properties.country !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">País:</span>
                          <span>{String(selectedFeature.properties.country)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : selectedFeature.properties._layerType === "wqp" ? (
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Estación de Calidad del Agua
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Estación:</span>
                        <span>{String(selectedFeature.properties.stationName)}</span>
                      </div>
                      {(selectedFeature.properties.siteType && typeof selectedFeature.properties.siteType !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Tipo:</span>
                          <span>{String(selectedFeature.properties.siteType)}</span>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.organization && typeof selectedFeature.properties.organization !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Organización:</span>
                          <span className="text-xs">{String(selectedFeature.properties.organization)}</span>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.provider && typeof selectedFeature.properties.provider !== 'undefined') ? (
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Fuente:</span>
                          <span>{String(selectedFeature.properties.provider)}</span>
                        </div>
                      ) : null}
                      {(selectedFeature.properties.description && typeof selectedFeature.properties.description !== 'undefined') ? (
                        <div className="text-sm">
                          <span className="font-medium">Descripción:</span>
                          <p className="mt-1 text-gray-600 text-xs">
                            {String(selectedFeature.properties.description)}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  /* Default: Local JSON datasets (agua, residuos, etc.) */
                  <>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Información general
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Estación:</span>{" "}
                          {selectedFeature.properties.estacion || "N/A"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Fecha:</span>{" "}
                          {selectedFeature.properties.fecha || "N/A"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">País:</span>{" "}
                          {selectedFeature.properties.pais || "N/A"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Departamento:</span>{" "}
                          {selectedFeature.properties.departamento || "N/A"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Ciudad:</span>{" "}
                          {selectedFeature.properties.ciudad || "N/A"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Parámetros</h3>
                      <div className="mt-2 space-y-2">
                        {selectedDataset?.parameters.map((param: string) => {
                          const value = selectedFeature.properties[param];
                          const unit = selectedDataset.units[param] || "";
                          return (
                            <div
                              key={param}
                              className="flex justify-between text-sm"
                            >
                              <span className="font-medium">{param}:</span>
                              <span>
                                {value !== undefined ? `${value} ${unit}` : "N/A"}
                              </span>
                            </div>
                        );
                      })}
                    </div>
                  </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>Haz clic en un punto del mapa para ver sus detalles</p>
              </div>
            )}
          </aside>

          {/* Mobile details overlay */}
          {isMobileDetailsOpen && selectedFeature && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
              onClick={() => setIsMobileDetailsOpen(false)}
            />
          )}
        </div>
      </main>

      {/* Upload wizard modal */}
      {showUploadWizard && (
        <UploadWizard
          onComplete={handleUploadComplete}
          onCancel={() => setShowUploadWizard(false)}
        />
      )}
    </ErrorBoundary>
  );
}
