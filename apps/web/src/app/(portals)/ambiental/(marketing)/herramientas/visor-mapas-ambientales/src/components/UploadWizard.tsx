'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { UploadWizardStep1, UploadWizardStep2, UploadWizardStep3, ColumnMapping } from '@/types'

interface UploadWizardProps {
  onComplete: (data: any) => void
  onCancel: () => void
}

export default function UploadWizard({ onComplete, onCancel }: UploadWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<UploadWizardStep1 | null>(null)
  const [step2Data, setStep2Data] = useState<UploadWizardStep2 | null>(null)
  const [step3Data, setStep3Data] = useState<UploadWizardStep3>({
    name: '',
    description: '',
    maxPointsPerDay: undefined,
    confirmWarning: false,
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      const fileType = file.name.endsWith('.geojson') 
        ? 'geojson' 
        : file.name.endsWith('.csv')
        ? 'csv'
        : file.name.endsWith('.xlsx')
        ? 'xlsx'
        : null

      if (!fileType) {
        throw new Error('Formato de archivo no soportado. Use .geojson, .csv o .xlsx')
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB permitidos.')
      }

      setStep1Data({ file, fileType })

      if (fileType === 'geojson') {
        const text = await file.text()
        const geojson = JSON.parse(text)
        
        if (geojson.type !== 'FeatureCollection' || !geojson.features) {
          throw new Error('Formato GeoJSON inválido')
        }

        // For GeoJSON, skip to step 3 since column mapping is not needed
        const sampleFeature = geojson.features[0]
        if (sampleFeature?.properties) {
          const detectedColumns = Object.keys(sampleFeature.properties)
          setStep2Data({
            columnMapping: {
              lat: 'lat',
              lon: 'lon', 
              fecha: 'fecha',
              pais: 'pais',
              departamento: 'departamento',
              ciudad: 'ciudad',
              parameters: {},
              units: {}
            },
            rawData: geojson.features,
            detectedColumns
          })
          setCurrentStep(3)
        }
      } else {
        // Parse CSV or Excel
        const processTabularData = (data: any[]) => {
          if (data.length === 0) {
            throw new Error('El archivo está vacío')
          }

          const detectedColumns = Object.keys(data[0] || {})
          setStep2Data({
            columnMapping: {
              lat: '',
              lon: '',
              fecha: '',
              pais: '',
              departamento: '',
              ciudad: '',
              parameters: {},
              units: {}
            },
            rawData: data,
            detectedColumns
          })
          setCurrentStep(2)
        }
        
        let rawData: any[] = []
        
        if (fileType === 'csv') {
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              rawData = results.data as any[]
              processTabularData(rawData)
            },
            error: (error) => {
              throw new Error(`Error procesando CSV: ${error.message}`)
            }
          })
        } else if (fileType === 'xlsx') {
          const buffer = await file.arrayBuffer()
          const workbook = XLSX.read(buffer, { type: 'buffer' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          rawData = XLSX.utils.sheet_to_json(worksheet)
          processTabularData(rawData)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Complete = (columnMapping: ColumnMapping) => {
    if (!step2Data) return

    setStep2Data({
      ...step2Data,
      columnMapping
    })
    setCurrentStep(3)
  }

  const handleStep3Complete = () => {
    if (!step1Data || !step2Data || !step3Data.confirmWarning) return

    const result = {
      file: step1Data,
      mapping: step2Data,
      metadata: step3Data
    }

    onComplete(result)
  }

  if (currentStep === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Paso 1: Cargar archivo
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md text-error-700">
              {error}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".geojson,.csv,.xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              disabled={loading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${loading ? 'opacity-50' : ''}`}
            >
              <div className="text-4xl text-gray-300 mb-2">📁</div>
              <p className="text-sm text-gray-600">
                {loading ? 'Procesando...' : 'Haz clic o arrastra archivos aquí'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formatos soportados: .geojson, .csv, .xlsx (máx. 10MB)
              </p>
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2 && step2Data) {
    return <ColumnMappingStep data={step2Data} onComplete={handleStep2Complete} onBack={() => setCurrentStep(1)} />
  }

  if (currentStep === 3) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Paso 3: Configuración del dataset
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del dataset *
              </label>
              <input
                type="text"
                className="input-field"
                value={step3Data.name}
                onChange={(e) => setStep3Data({ ...step3Data, name: e.target.value })}
                placeholder="Ej: Monitoreo Río Magdalena 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={step3Data.description}
                onChange={(e) => setStep3Data({ ...step3Data, description: e.target.value })}
                placeholder="Describe el dataset..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Límite de puntos por día (opcional)
              </label>
              <input
                type="number"
                className="input-field"
                value={step3Data.maxPointsPerDay || ''}
                onChange={(e) => setStep3Data({ 
                  ...step3Data, 
                  maxPointsPerDay: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="Ej: 1000"
              />
            </div>

            <div className="border-t pt-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={step3Data.confirmWarning}
                  onChange={(e) => setStep3Data({ ...step3Data, confirmWarning: e.target.checked })}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Entiendo que este dataset puede ser eliminado por un administrador
                  en cualquier momento.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-between space-x-3 mt-6">
            <button
              onClick={() => setCurrentStep(step1Data?.fileType === 'geojson' ? 1 : 2)}
              className="btn-secondary"
            >
              Atrás
            </button>
            <button
              onClick={handleStep3Complete}
              className="btn-primary"
              disabled={!step3Data.name || !step3Data.confirmWarning}
            >
              Crear dataset
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

interface ColumnMappingStepProps {
  data: UploadWizardStep2
  onComplete: (mapping: ColumnMapping) => void
  onBack: () => void
}

function ColumnMappingStep({ data, onComplete, onBack }: ColumnMappingStepProps) {
  const [mapping, setMapping] = useState<ColumnMapping>(data.columnMapping)

  const availableParameters = [
    'DBO', 'DQO', 'pH', 'Conductividad', 'Sólidos Totales', 'Alcalinidad', 'Dureza'
  ]

  const isValidMapping = () => {
    return mapping.lat && mapping.lon && mapping.fecha && 
           mapping.pais && mapping.departamento && mapping.ciudad
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Paso 2: Mapeo de columnas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Required fields */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Campos obligatorios</h3>
            
            {[
              { key: 'lat', label: 'Latitud' },
              { key: 'lon', label: 'Longitud' },
              { key: 'fecha', label: 'Fecha' },
              { key: 'pais', label: 'País' },
              { key: 'departamento', label: 'Departamento' },
              { key: 'ciudad', label: 'Ciudad' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} *
                </label>
                <select
                  className="input-field"
                  value={mapping[key as keyof ColumnMapping] as string}
                  onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}
                >
                  <option value="">Seleccionar columna...</option>
                  {data.detectedColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Parameter fields */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Parámetros (opcionales)</h3>
            
            {availableParameters.map(param => (
              <div key={param} className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {param}
                  </label>
                  <select
                    className="input-field"
                    value={mapping.parameters[param] || ''}
                    onChange={(e) => setMapping({
                      ...mapping,
                      parameters: { ...mapping.parameters, [param]: e.target.value }
                    })}
                  >
                    <option value="">Sin mapear</option>
                    {data.detectedColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad
                  </label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="mg/L"
                    value={mapping.units[param] || ''}
                    onChange={(e) => setMapping({
                      ...mapping,
                      units: { ...mapping.units, [param]: e.target.value }
                    })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between space-x-3">
          <button onClick={onBack} className="btn-secondary">
            Atrás
          </button>
          <button
            onClick={() => onComplete(mapping)}
            className="btn-primary"
            disabled={!isValidMapping()}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
