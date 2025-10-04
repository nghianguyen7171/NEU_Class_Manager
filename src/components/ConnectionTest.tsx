'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ConnectionTest() {
  const [testResult, setTestResult] = useState<string>('')
  const [testing, setTesting] = useState(false)

  const testConnection = async () => {
    setTesting(true)
    setTestResult('')
    
    try {
      // Test basic connection
      const { error } = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('count')
        .limit(1)

      if (error) {
        setTestResult(`❌ Connection failed: ${error.message}`)
      } else {
        setTestResult('✅ Connection successful! Database is accessible.')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setTestResult(`❌ Unexpected error: ${errorMessage}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        🔧 Database Connection Test
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Test the connection to the Supabase database to diagnose any issues.
      </p>
      <button
        onClick={testConnection}
        disabled={testing}
        className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {testing ? 'Testing...' : 'Test Connection'}
      </button>
      {testResult && (
        <div className="mt-3 p-3 rounded-md bg-white border">
          <p className="text-sm font-mono">{testResult}</p>
        </div>
      )}
    </div>
  )
}
