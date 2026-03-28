import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://asxhozsfmlmsrflmzizr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeGhvenNmbWxtc3JmbG16aXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1Njc2OTAsImV4cCI6MjA3NTE0MzY5MH0.EpsZVx-IPkH078KCeW-YCI_RWhs46LrgbujalXvf48Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    /** Strong anti-cache: some browsers still reuse GET responses unless Cache-Control is explicit. */
    fetch: (input, init = {}) => {
      const headers = new Headers(init.headers)
      if (!headers.has('Cache-Control')) {
        headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
      }
      if (!headers.has('Pragma')) {
        headers.set('Pragma', 'no-cache')
      }
      return fetch(input, { ...init, headers, cache: 'no-store' })
    },
  },
})

export interface ExamScore {
  Tên: string
  MSV: number
  /** PostgREST may return string or number depending on column type */
  'Số câu đúng'?: string | number | null
  'Điểm'?: string | number | null
}

// Re-export ExamResponse from types for convenience
export type { ExamResponse } from './types'
