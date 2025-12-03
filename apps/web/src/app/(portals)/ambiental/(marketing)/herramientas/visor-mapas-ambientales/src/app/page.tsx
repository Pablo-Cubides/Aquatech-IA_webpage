"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import UploadWizard from "../components/UploadWizard";
import type {
  DatasetMetadata,
  GeoJSONFeature,
  FilterState,
  User,
} from "../types";
import { logger } from "@/lib/logger";

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      Cargando mapa...
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
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    parameters: [],
  });

  // Mock login for development
  useEffect(() => {
    setUser({
      id: "1",
      email: "usuario@ejemplo.com",
      role: "uploader",
    });
  }, []);

  // Mock datasets for development
  useEffect(() => {
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

  // Apply parameter filters
  useEffect(() => {
    if (filters.parameters.length === 0) {
      // No parameters selected - show NO points
      console.log(
        "[PAGE] No parameters selected - hiding all points (user must select at least one parameter)",
      );
      setCurrentData([]);
    } else {
      // Filter data to show points that have AT LEAST ONE of the selected parameters
      const filtered = unfilteredData.filter((feature) => {
        return filters.parameters.some((param: string) => {
          const value = feature.properties[param];
          return value !== null && value !== undefined;
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
  }, [unfilteredData, filters.parameters]);

  const handleLogin = (email: string) => {
    // Mock login - password validation would happen server-side
    setUser({
      id: "1",
      email,
      role: "uploader",
    });
  };

  const handleUploadComplete = () => {
    logger.info("Upload completed successfully");
    setShowUploadWizard(false);
    // TODO: Process uploaded data and refresh datasets
  };

  if (!user) {
    return (
      <main className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
            Mapa Ambiental
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Visualización de datos ambientales
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleLogin(
                  formData.get("email") as string,
                );
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field"
                    placeholder="tu@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button type="submit" className="w-full btn-primary">
                  Iniciar sesión
                </button>
              </div>

              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  ¿No tienes cuenta? Regístrate
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
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
              <div className="flex items-center space-x-3">
                {/* Logo */}
                <img
                  src="\images\Portal ambiental\Herramientas\GeoVisor.png"
                  alt="Gesovisor"
                  className="object-contain w-auto h-40"
                />
                <select
                  className="w-64 input-field"
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
              <div className="flex items-center space-x-4">
                <a
                  href="/guia"
                  className="flex items-center btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir guía de uso en nueva pestaña"
                >
                  📖 Guía de uso
                </a>
                {(user.role === "admin" || user.role === "uploader") && (
                  <button
                    className="btn-primary"
                    onClick={() => setShowUploadWizard(true)}
                    aria-label="Abrir asistente para subir nuevos datos ambientales"
                  >
                    + Subir datos
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => setUser(null)}
                  aria-label="Cerrar sesión y volver al inicio"
                >
                  Cerrar sesión
                </button>
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
        <div className="flex flex-1">
          {/* Filters panel */}
          <aside className="p-6 overflow-y-auto bg-white border-r border-gray-200 w-80">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Filtros
            </h2>

            <div className="space-y-4">
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
                </>
              )}
            </div>
          </aside>

          {/* Map container */}
          <div className="relative flex-1">
            <MapComponent
              data={currentData}
              onPointClick={(feature) => setSelectedFeature(feature)}
              selectedParameters={filters.parameters}
            />

            {/* Overlay message when no dataset is selected */}
            {!selectedDataset && (
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

          {/* Details panel */}
          <aside className="p-6 overflow-y-auto bg-white border-l border-gray-200 w-80">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Detalles del punto
            </h2>

            {selectedFeature ? (
              <div className="space-y-4">
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
                      {selectedFeature.properties.fecha}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">País:</span>{" "}
                      {selectedFeature.properties.pais}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Departamento:</span>{" "}
                      {selectedFeature.properties.departamento}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Ciudad:</span>{" "}
                      {selectedFeature.properties.ciudad}
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
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>Haz clic en un punto del mapa para ver sus detalles</p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Upload wizard modal */}
      {showUploadWizard && (
        <UploadWizard
          onComplete={handleUploadComplete}
          onCancel={() => setShowUploadWizard(false)}
        />
      )}
    </>
  );
}
