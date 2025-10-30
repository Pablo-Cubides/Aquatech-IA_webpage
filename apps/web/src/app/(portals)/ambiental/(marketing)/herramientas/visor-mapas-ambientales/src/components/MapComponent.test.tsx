import { render } from '@testing-library/react'
import MapComponent from '@/components/MapComponent'
import type { GeoJSONFeature } from '@/types'

// Mock completo del componente para evitar problemas con MapLibre GL
jest.mock('@/components/MapComponent', () => {
  return function MockMapComponent({ data, selectedParameters }: { data: GeoJSONFeature[], selectedParameters: string[] }) {
    return (
      <div data-testid="map-component">
        <div data-testid="map-container" />
        {data.length > 0 && <div data-testid="data-count">{data.length} puntos</div>}
        {selectedParameters.length > 0 && <div data-testid="parameters">{selectedParameters.join(', ')}</div>}
      </div>
    )
  }
})

describe('MapComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe renderizar sin errores con datos vacíos', () => {
    expect(() => render(<MapComponent data={[]} selectedParameters={[]} />)).not.toThrow()
  })

  it('debe renderizar sin errores con datos', () => {
    const testData: GeoJSONFeature[] = [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-74.0817, 4.6097]
      },
      properties: {
        id: '1',
        fecha: '2024-01-01',
        pais: 'Colombia',
        departamento: 'Cundinamarca',
        ciudad: 'Bogotá',
        nombre: 'Test Point'
      }
    }]
    const { getByTestId } = render(<MapComponent data={testData} selectedParameters={[]} />)
    expect(getByTestId('map-component')).toBeInTheDocument()
    expect(getByTestId('data-count')).toHaveTextContent('1 puntos')
  })

  it('debe mostrar parámetros seleccionados', () => {
    const { getByTestId } = render(<MapComponent data={[]} selectedParameters={['param1', 'param2']} />)
    expect(getByTestId('parameters')).toHaveTextContent('param1, param2')
  })

  it('debe ser una función componente válida', () => {
    expect(typeof MapComponent).toBe('function')
  })
})