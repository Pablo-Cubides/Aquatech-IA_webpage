import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    if (!supabase) {
      logger.warn('Supabase not configured', { endpoint: '/api/days' })
      return NextResponse.json({ 
        error: 'Supabase no configurado. Configure las variables de entorno.' 
      }, { status: 503 })
    }

    const url = new URL(request.url)
    const datasetId = url.searchParams.get('datasetId')

    if (!datasetId) {
      logger.warn('Missing datasetId parameter in /api/days')
      return NextResponse.json({ 
        error: 'datasetId es requerido' 
      }, { status: 400 })
    }

    const { data: dataset, error } = await supabase
      .from('datasets')
      .select('available_dates')
      .eq('id', datasetId)
      .single()

    if (error || !dataset) {
      logger.error('Failed to fetch dataset dates', error, { datasetId })
      return NextResponse.json({ error: 'Dataset no encontrado' }, { status: 404 })
    }

    logger.info('Dataset dates fetched successfully', { 
      datasetId, 
      datesCount: dataset.available_dates?.length || 0 
    })
    return NextResponse.json({ dates: dataset.available_dates })
  } catch (error) {
    logger.error('Unexpected error in GET /api/days', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
