'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import type { GeoJSONFeature } from '@/types'

interface MapComponentProps {
  data: GeoJSONFeature[]
  onPointClick?: (feature: GeoJSONFeature) => void
  selectedParameters: string[]
}

export default function MapComponent({ 
  data, 
  onPointClick,
  selectedParameters 
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map with CartoDB basemap and optimizations
  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [-74.0721, 4.7110], // Bogotá, Colombia
      zoom: 4, // Start with zoom 4 to see all data
      minZoom: 2,
      maxZoom: 19,
      pitch: 0,
      bearing: 0,
    })

    // Add navigation controls with better positioning
    const navControl = new maplibregl.NavigationControl()
    map.current.addControl(navControl, 'top-right')

    // Add fullscreen control (if available)
    if ('FullscreenControl' in maplibregl) {
      map.current.addControl(new (maplibregl as any).FullscreenControl(), 'top-right')
    }

    // Mark map as loaded
    const handleLoad = () => {
      setMapLoaded(true)
    }

    map.current.on('load', handleLoad)

    return () => {
      if (map.current) {
        map.current.off('load', handleLoad)
        map.current.remove()
      }
    }
  }, [])

  // Update data layers with optimizations
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: data,
    }

    // Update layers function
    const updateLayers = () => {
      if (!map.current) return

      // Remove existing layers safely
      const layerIds = ['points-layer', 'points-cluster']
      layerIds.forEach((id) => {
        try {
          if (map.current?.getLayer(id)) {
            map.current.removeLayer(id)
          }
        } catch {
          // Layer doesn't exist
        }
      })

      // Remove existing source
      try {
        if (map.current?.getSource('points')) {
          map.current.removeSource('points')
        }
      } catch {
        // Source doesn't exist
      }

      // Add optimized data source (cluster if >100 points for performance)
      map.current.addSource('points', {
        type: 'geojson',
        data: geojsonData,
        cluster: data.length > 100,
        clusterMaxZoom: 14,
        clusterRadius: 50,
        buffer: 128,
      } as any)

      // Add cluster layer if there are many points
      if (data.length > 100) {
        map.current.addLayer({
          id: 'points-cluster',
          type: 'circle',
          source: 'points',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#22c55e', // Green for 1-10
              10,
              '#3b82f6', // Blue for 10-50
              50,
              '#f59e0b', // Orange for 50-100
              100,
              '#ef4444', // Red for 100+
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              15,
              10,
              20,
              50,
              25,
              100,
              30,
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.85,
          },
        } as any)

        // Cluster click handler - zoom in
        const handleClusterClick = (e: any) => {
          if (!e.features?.[0] || !map.current) return
          const geometry = e.features[0].geometry
          const coords = (geometry as any).coordinates
          map.current.easeTo({
            center: coords,
            zoom: Math.min(map.current.getZoom() + 2, 19),
          })
        }
        map.current.on('click', 'points-cluster', handleClusterClick)
      }

      // Add individual points layer
      map.current.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        filter: data.length > 100 ? ['!', ['has', 'point_count']] : undefined,
        paint: {
          'circle-color': '#1d4ed8',
          'circle-radius': 5,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85,
        },
      } as any)

      // Point click handler
      const handlePointClick = (e: any) => {
        if (onPointClick && e.features?.[0]) {
          onPointClick(e.features[0] as any as GeoJSONFeature)
        }
      }
      map.current.on('click', 'points-layer', handlePointClick)

      // Cursor hover effects
      const handleMouseEnter = () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer'
      }
      const handleMouseLeave = () => {
        if (map.current) map.current.getCanvas().style.cursor = ''
      }

      map.current.on('mouseenter', 'points-layer', handleMouseEnter)
      map.current.on('mouseleave', 'points-layer', handleMouseLeave)
      if (data.length > 100) {
        map.current.on('mouseenter', 'points-cluster', handleMouseEnter)
        map.current.on('mouseleave', 'points-cluster', handleMouseLeave)
      }

      // Fit bounds to data
      if (data.length > 0) {
        const bounds = new maplibregl.LngLatBounds()
        data.forEach((feature) => {
          const coords = (feature.geometry as any).coordinates as [number, number]
          bounds.extend(coords)
        })
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 16 })
      }
    }

    // Update when style is loaded
    if (map.current.isStyleLoaded()) {
      updateLayers()
    } else {
      map.current.once('load', updateLayers)
    }
  }, [data, onPointClick, mapLoaded, selectedParameters])

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}
