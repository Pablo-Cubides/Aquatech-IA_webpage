'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
          },
        ],
      },
      center: [-74.0721, 4.7110], // Bogotá, Colombia
      zoom: 10,
    })

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: data,
    }

    // Wait for map to load
    const addDataLayer = () => {
      if (!map.current) return

      // Remove existing layers and sources
      try {
        if (map.current.getLayer('points-layer')) {
          map.current.removeLayer('points-layer')
        }
        if (map.current.getLayer('points-cluster')) {
          map.current.removeLayer('points-cluster')
        }
        if (map.current.getSource('points')) {
          map.current.removeSource('points')
        }
      } catch (e) {
        // Source/layer might not exist
      }

      // Always add data source, even if empty
      map.current.addSource('points', {
        type: 'geojson',
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // Add cluster circles with better visual indication
      map.current.addLayer({
        id: 'points-cluster',
        type: 'circle',
        source: 'points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#22c55e', // Green for small clusters (1-10)
            10,
            '#3b82f6', // Blue for medium clusters (10-50)
            50,
            '#f59e0b', // Orange for large clusters (50-100)
            100,
            '#ef4444', // Red for very large clusters (100+)
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15, // Small clusters
            10,
            20, // Medium clusters
            50,
            25, // Large clusters
            100,
            30, // Very large clusters
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8,
        },
      })

      // Add cluster count labels (only if the style supports glyphs)
      // For now, we'll skip text labels to avoid glyph errors with basic OSM style
      // The cluster size will be indicated by circle size instead

      // Add individual points with better styling
      map.current.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#1d4ed8', // Blue color for individual points
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      })

      // Add click handlers
      map.current.on('click', 'points-cluster', (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: ['points-cluster'],
        })
        
        if (features.length > 0) {
          const geometry = features[0].geometry as any
          map.current!.easeTo({
            center: geometry.coordinates as [number, number],
            zoom: map.current!.getZoom() + 2,
          })
        }
      })

      map.current.on('click', 'points-layer', (e) => {
        if (onPointClick && e.features?.[0]) {
          const feature = e.features[0] as any
          onPointClick(feature as GeoJSONFeature)
        }
      })

      // Change cursor on hover
      map.current.on('mouseenter', 'points-cluster', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer'
        }
      })
      map.current.on('mouseleave', 'points-cluster', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = ''
        }
      })
      map.current.on('mouseenter', 'points-layer', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer'
        }
      })
      map.current.on('mouseleave', 'points-layer', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = ''
        }
      })

      // Fit map to data bounds only if there's data
      if (data.length > 0) {
        const bounds = new maplibregl.LngLatBounds()
        data.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates as [number, number])
        })
        map.current.fitBounds(bounds, { padding: 50 })
      }
    }

    if (map.current.isStyleLoaded()) {
      addDataLayer()
    } else {
      map.current.on('load', addDataLayer)
    }
  }, [data, onPointClick])

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}
