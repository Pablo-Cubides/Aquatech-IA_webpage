import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    if (!supabase) {
      logger.warn('Supabase not configured', { endpoint: '/api/geojson' })
      return NextResponse.json({ 
        error: 'Supabase no configurado. Configure las variables de entorno.' 
      }, { status: 503 })
    }

    const url = new URL(request.url)
    const datasetId = url.searchParams.get('datasetId')
    const date = url.searchParams.get('date')

    if (!datasetId || !date) {
      logger.warn('Missing required parameters in /api/geojson', { 
        hasDatasetId: !!datasetId, 
        hasDate: !!date 
      })
      return NextResponse.json({ 
        error: 'datasetId y date son requeridos' 
      }, { status: 400 })
    }

    // Get GeoJSON data for specific dataset and date from storage
    const fileName = `${datasetId}/${date}.geojson`
    
    const { data, error } = await supabase.storage
      .from('datasets')
      .download(fileName)

    if (error) {
      logger.error('Failed to download GeoJSON', error, { datasetId, date, fileName })
      return NextResponse.json({ error: 'Datos no encontrados' }, { status: 404 })
    }

    const text = await data.text()
    const geojson = JSON.parse(text)

    logger.info('GeoJSON fetched successfully', { 
      datasetId, 
      date, 
      featuresCount: geojson.features?.length || 0 
    })
    return NextResponse.json(geojson)
  } catch (error) {
    logger.error('Unexpected error in GET /api/geojson', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      logger.warn('Supabase not configured', { endpoint: '/api/geojson', method: 'POST' })
      return NextResponse.json({ 
        error: 'Supabase no configurado. Configure las variables de entorno.' 
      }, { status: 503 })
    }

    const body = await request.json()
    const { datasetId, date, geojson } = body

    if (!datasetId || !date || !geojson) {
      logger.warn('Missing required fields in POST /api/geojson', { 
        hasDatasetId: !!datasetId, 
        hasDate: !!date, 
        hasGeojson: !!geojson 
      })
      return NextResponse.json({ 
        error: 'datasetId, date y geojson son requeridos' 
      }, { status: 400 })
    }

    // Save GeoJSON data to storage
    const fileName = `${datasetId}/${date}.geojson`
    const fileData = JSON.stringify(geojson)

    const { error: uploadError } = await supabase.storage
      .from('datasets')
      .upload(fileName, fileData, {
        contentType: 'application/json',
        upsert: true
      })

    if (uploadError) {
      logger.error('Failed to upload GeoJSON', uploadError, { datasetId, date, fileName })
      return NextResponse.json({ error: 'Error al guardar los datos' }, { status: 500 })
    }

    logger.info('GeoJSON uploaded successfully', { 
      datasetId, 
      date, 
      fileName,
      featuresCount: geojson.features?.length || 0 
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Unexpected error in POST /api/geojson', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
