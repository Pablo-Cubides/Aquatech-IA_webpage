import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('Missing Supabase environment variables. Features requiring database will not work.', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  })
}

// Create a mock client if env vars are missing (for development)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string
          name: string
          description: string
          owner_id: string
          created_at: string
          updated_at: string
          column_mapping: any
          available_dates: string[]
          parameters: string[]
          units: any
          max_points_per_day?: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          owner_id: string
          created_at?: string
          updated_at?: string
          column_mapping: any
          available_dates: string[]
          parameters: string[]
          units: any
          max_points_per_day?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
          column_mapping?: any
          available_dates?: string[]
          parameters?: string[]
          units?: any
          max_points_per_day?: number
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'uploader' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'uploader' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'uploader' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
