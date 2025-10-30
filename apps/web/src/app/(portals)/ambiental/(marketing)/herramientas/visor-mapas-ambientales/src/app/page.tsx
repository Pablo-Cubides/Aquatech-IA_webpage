'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import UploadWizard from '@/components/UploadWizard'
import type { DatasetMetadata, GeoJSONFeature, FilterState, User } from '@/types'
import { logger } from '@/lib/logger'

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Cargando mapa...</div> }
)

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([])
  const [selectedDataset, setSelectedDataset] = useState<DatasetMetadata | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [currentData, setCurrentData] = useState<GeoJSONFeature[]>([])
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null)
  const [showUploadWizard, setShowUploadWizard] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    parameters: []
  })

  // Mock login for development
  useEffect(() => {
    setUser({
      id: '1',
      email: 'usuario@ejemplo.com',
      role: 'uploader'
    })
  }, [])

  // Mock datasets for development
  useEffect(() => {
    const mockDatasets: DatasetMetadata[] = [
      {
        id: '1',
        name: 'Monitoreo Río Magdalena 2024',
        description: 'Datos de calidad del agua del Río Magdalena',
        owner_id: '1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        column_mapping: {
          lat: 'latitud',
          lon: 'longitud',
          fecha: 'fecha_muestreo',
          pais: 'pais',
          departamento: 'departamento',
          ciudad: 'municipio',
          parameters: {
            'DBO': 'dbo_mg_l',
            'DQO': 'dqo_mg_l',
            'pH': 'ph'
          }
        },
        available_dates: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'],
        parameters: ['DBO', 'DQO', 'pH'],
        units: {
          'DBO': 'mg/L',
          'DQO': 'mg/L',
          'pH': 'unidades'
        }
      }
    ]
    setDatasets(mockDatasets)
  }, [])

  // Handle dataset selection
  useEffect(() => {
    if (selectedDataset) {
      setAvailableDates(selectedDataset.available_dates)
      setSelectedDate(selectedDataset.available_dates[0] || '')
      setFilters({ parameters: [] })
    }
  }, [selectedDataset])

  // Load data for selected date
  useEffect(() => {
    if (selectedDataset && selectedDate) {
      // Mock data for development
      const mockData: GeoJSONFeature[] = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-74.0721, 4.7110] // Bogotá
          },
          properties: {
            id: '1',
            fecha: selectedDate,
            pais: 'Colombia',
            departamento: 'Cundinamarca', 
            ciudad: 'Bogotá',
            DBO: 25.5,
            DQO: 45.2,
            pH: 7.2,
            estacion: 'EST-001'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-74.0821, 4.7210]
          },
          properties: {
            id: '2',
            fecha: selectedDate,
            pais: 'Colombia',
            departamento: 'Cundinamarca',
            ciudad: 'Bogotá',
            DBO: 18.3,
            DQO: 32.1,
            pH: 6.9,
            estacion: 'EST-002'
          }
        }
      ]
      setCurrentData(mockData)
    }
  }, [selectedDataset, selectedDate])

  const handleLogin = (email: string, password: string) => {
    // Mock login
    setUser({
      id: '1',
      email,
      role: 'uploader'
    })
  }

  const handleUploadComplete = (data: any) => {
    logger.info('Upload completed successfully', { 
      datasetId: data?.datasetId,
      recordCount: data?.recordCount 
    })
    setShowUploadWizard(false)
    // TODO: Process uploaded data and refresh datasets
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Mapa Ambiental
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Visualización de datos ambientales
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleLogin(
                formData.get('email') as string,
                formData.get('password') as string
              )
            }}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                  ¿No tienes cuenta? Regístrate
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    )
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

      <main id="main-content" className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">Mapa Ambiental</h1>
                <select 
                  className="input-field w-64"
                  value={selectedDataset?.id || ''}
                  onChange={(e) => {
                    const dataset = datasets.find(d => d.id === e.target.value)
                    setSelectedDataset(dataset || null)
                  }}
                  aria-label="Seleccionar dataset de datos ambientales"
                  aria-describedby="dataset-description"
                >
                  <option value="">Seleccionar dataset...</option>
                  {datasets.map(dataset => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
                <span id="dataset-description" className="sr-only">
                  Seleccione un conjunto de datos ambientales para visualizar en el mapa
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/guia"
                  className="btn-secondary flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir guía de uso en nueva pestaña"
                >
                  📖 Guía de uso
                </a>
                {(user.role === 'admin' || user.role === 'uploader') && (
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
              <div className="border-t border-gray-200 pt-2">
                <div className="flex space-x-1 overflow-x-auto">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                        selectedDate === date
                          ? 'text-primary-600 border-primary-500'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
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
        <div className="flex-1 flex">
          {/* Filters panel */}
          <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <select 
                  className="input-field"
                  value={filters.pais || ''}
                  onChange={(e) => setFilters({ ...filters, pais: e.target.value || undefined })}
                >
                  <option value="">Todos los países</option>
                  <option value="Colombia">Colombia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <select 
                  className="input-field"
                  value={filters.departamento || ''}
                  onChange={(e) => setFilters({ ...filters, departamento: e.target.value || undefined })}
                >
                  <option value="">Todos los departamentos</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <select 
                  className="input-field"
                  value={filters.ciudad || ''}
                  onChange={(e) => setFilters({ ...filters, ciudad: e.target.value || undefined })}
                >
                  <option value="">Todas las ciudades</option>
                  <option value="Bogotá">Bogotá</option>
                </select>
              </div>

              {selectedDataset && (
                <>
                  <hr className="my-4" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Parámetros</h3>
                    <div className="space-y-2">
                      {selectedDataset.parameters.map((param) => (
                        <label key={param} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                            checked={filters.parameters.includes(param)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, parameters: [...filters.parameters, param] })
                              } else {
                                setFilters({ ...filters, parameters: filters.parameters.filter(p => p !== param) })
                              }
                            }}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {param} ({selectedDataset.units[param] || 'N/A'})
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
          <div className="flex-1 relative">
            <MapComponent
              data={selectedDataset && selectedDate ? currentData : []}
              onPointClick={setSelectedFeature}
              selectedParameters={filters.parameters}
            />
            
            {/* Overlay message when no dataset is selected */}
            {!selectedDataset && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
                <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                  <div className="text-4xl text-gray-300 mb-2">📊</div>
                  <p className="text-gray-700 font-medium">
                    Selecciona un dataset para ver los datos
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    El mapa está listo para mostrar los puntos ambientales
                  </p>
                </div>
              </div>
            )}
            
            {/* Overlay message when dataset is selected but no date */}
            {selectedDataset && !selectedDate && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
                <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                  <div className="text-4xl text-gray-300 mb-2">�</div>
                  <p className="text-gray-700 font-medium">
                    Selecciona una fecha para ver los datos
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Dataset: {selectedDataset.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details panel */}
          <aside className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del punto</h2>
            
            {selectedFeature ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Información general</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm"><span className="font-medium">Estación:</span> {selectedFeature.properties.estacion || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Fecha:</span> {selectedFeature.properties.fecha}</p>
                    <p className="text-sm"><span className="font-medium">País:</span> {selectedFeature.properties.pais}</p>
                    <p className="text-sm"><span className="font-medium">Departamento:</span> {selectedFeature.properties.departamento}</p>
                    <p className="text-sm"><span className="font-medium">Ciudad:</span> {selectedFeature.properties.ciudad}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Parámetros</h3>
                  <div className="mt-2 space-y-2">
                    {selectedDataset?.parameters.map((param) => {
                      const value = selectedFeature.properties[param]
                      const unit = selectedDataset.units[param] || ''
                      return (
                        <div key={param} className="flex justify-between text-sm">
                          <span className="font-medium">{param}:</span>
                          <span>{value !== undefined ? `${value} ${unit}` : 'N/A'}</span>
                        </div>
                      )
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
  )
}
