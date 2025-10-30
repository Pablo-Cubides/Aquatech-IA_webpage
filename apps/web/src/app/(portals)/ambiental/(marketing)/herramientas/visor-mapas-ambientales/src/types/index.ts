export interface GeoJSONFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  properties: {
    id?: string
    fecha: string
    pais: string
    departamento: string
    ciudad: string
    [parameter: string]: any // DBO, DQO, pH, etc.
  }
}

export interface DatasetMetadata {
  id: string
  name: string
  description: string
  owner_id: string
  created_at: string
  updated_at: string
  column_mapping: {
    lat: string
    lon: string
    fecha: string
    pais: string
    departamento: string
    ciudad: string
    parameters: { [key: string]: string }
  }
  available_dates: string[]
  parameters: string[]
  units: { [parameter: string]: string }
  max_points_per_day?: number
}

export interface ColumnMapping {
  lat: string
  lon: string
  fecha: string
  pais: string
  departamento: string
  ciudad: string
  parameters: { [parameter: string]: string }
  units: { [parameter: string]: string }
}

export interface UploadWizardStep1 {
  file: File
  fileType: 'geojson' | 'csv' | 'xlsx'
}

export interface UploadWizardStep2 {
  columnMapping: ColumnMapping
  rawData: any[]
  detectedColumns: string[]
}

export interface UploadWizardStep3 {
  name: string
  description: string
  maxPointsPerDay?: number
  confirmWarning: boolean
}

export interface FilterState {
  pais?: string
  departamento?: string
  ciudad?: string
  parameters: string[]
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'uploader' | 'viewer'
}
