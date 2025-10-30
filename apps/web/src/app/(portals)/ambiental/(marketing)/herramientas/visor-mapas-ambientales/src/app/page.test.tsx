import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '@/app/page'

// Mock del componente MapComponent
jest.mock('@/components/MapComponent', () => {
  return function MockMapComponent({ data }: { data: any[] }) {
    return (
      <div data-testid="map-component">
        <div>Mapa Interactivo</div>
        <div data-testid="map-data-count">{data?.length || 0} puntos</div>
      </div>
    )
  }
})

// Mock del componente UploadWizard
jest.mock('@/components/UploadWizard', () => {
  return function MockUploadWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null
    return (
      <div data-testid="upload-wizard">
        <div>Wizard de Subida</div>
        <button onClick={onClose} data-testid="close-wizard">Cerrar</button>
      </div>
    )
  }
})

describe('Página Principal - Mapa Ambiental', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks()
  })

  it('debe renderizar el título principal', () => {
    render(<Page />)

    expect(screen.getByText('Mapa Ambiental')).toBeInTheDocument()
  })

  it('debe mostrar la interfaz completa del mapa (autenticación mock)', () => {
    render(<Page />)

    // Verificar que se muestra la interfaz completa, no el login
    expect(screen.getByText('Mapa Ambiental')).toBeInTheDocument()
    expect(screen.getByText('Filtros')).toBeInTheDocument()
    expect(screen.getByText('Detalles del punto')).toBeInTheDocument()
  })

  it('debe mostrar los controles de filtro', () => {
    render(<Page />)

    expect(screen.getByText('Filtros')).toBeInTheDocument()
    expect(screen.getByText('País')).toBeInTheDocument()
    expect(screen.getByText('Departamento')).toBeInTheDocument()
    expect(screen.getByText('Ciudad')).toBeInTheDocument()
  })

  it('debe mostrar el selector de datasets', () => {
    render(<Page />)

    expect(screen.getByText('Seleccionar dataset...')).toBeInTheDocument()
  })

  it('debe mostrar el mapa', () => {
    render(<Page />)

    expect(screen.getByTestId('map-component')).toBeInTheDocument()
  })

  it('debe mostrar el botón de subir datos', () => {
    render(<Page />)

    const uploadButton = screen.getByRole('button', { name: '+ Subir datos' })
    expect(uploadButton).toBeInTheDocument()
  })

  it('debe mostrar el botón de cerrar sesión', () => {
    render(<Page />)

    const logoutButton = screen.getByRole('button', { name: 'Cerrar sesión' })
    expect(logoutButton).toBeInTheDocument()
  })

  it('debe mostrar el enlace a la guía de usuario', () => {
    render(<Page />)

    const guideLink = screen.getByRole('link', { name: '📖 Guía de uso' })
    expect(guideLink).toBeInTheDocument()
    expect(guideLink).toHaveAttribute('href', '/guia')
  })

  it('debe mostrar mensaje cuando no hay dataset seleccionado', () => {
    render(<Page />)

    expect(screen.getByText('Selecciona un dataset para ver los datos')).toBeInTheDocument()
    expect(screen.getByText('El mapa está listo para mostrar los puntos ambientales')).toBeInTheDocument()
  })

  it('debe mostrar las opciones de países en el filtro', () => {
    render(<Page />)

    const countrySelect = screen.getByText('Todos los países').closest('select')
    expect(countrySelect).toBeInTheDocument()

    // Verificar que Colombia está como opción
    expect(screen.getByText('Colombia')).toBeInTheDocument()
  })

  it('debe mostrar las opciones de departamentos en el filtro', () => {
    render(<Page />)

    const departmentSelect = screen.getByText('Todos los departamentos').closest('select')
    expect(departmentSelect).toBeInTheDocument()

    // Verificar que Cundinamarca está como opción
    expect(screen.getByText('Cundinamarca')).toBeInTheDocument()
  })

  it('debe mostrar las opciones de ciudades en el filtro', () => {
    render(<Page />)

    const citySelect = screen.getByText('Todas las ciudades').closest('select')
    expect(citySelect).toBeInTheDocument()

    // Verificar que Bogotá está como opción
    expect(screen.getByText('Bogotá')).toBeInTheDocument()
  })
})