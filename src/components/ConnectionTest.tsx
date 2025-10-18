'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TableTestResult {
  tableName: string
  status: 'success' | 'error'
  recordCount?: number
  error?: string
}

export default function ConnectionTest() {
  const [testResults, setTestResults] = useState<TableTestResult[]>([])
  const [testing, setTesting] = useState(false)

  const testAllTables = async () => {
    setTesting(true)
    setTestResults([])
    
    const tablesToTest = [
      { name: 'DS_Wed _5_6_Midterm.csv', displayName: 'Thứ 5, tiết 7-8' },
      { name: 'DS_Thurs _7_8_Midterm.csv', displayName: 'Thứ 4, tiết 7-8' }
    ]

    const results: TableTestResult[] = []

    for (const table of tablesToTest) {
      try {
        const { error, count } = await supabase
          .from(table.name)
          .select('*', { count: 'exact' })
          .limit(1)

        if (error) {
          results.push({
            tableName: table.displayName,
            status: 'error',
            error: error.message
          })
        } else {
          results.push({
            tableName: table.displayName,
            status: 'success',
            recordCount: count || 0
          })
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        results.push({
          tableName: table.displayName,
          status: 'error',
          error: errorMessage
        })
      }
    }

    setTestResults(results)
    setTesting(false)
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        🔧 Database Connection Test
      </h3>
      <p className="text-gray-600 mb-4">
        Test the connection to all exam score tables to diagnose any issues.
      </p>
      <button
        onClick={testAllTables}
        disabled={testing}
        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        {testing ? 'Testing All Tables...' : 'Test All Tables'}
      </button>
      
      {testResults.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">Test Results:</h4>
          {testResults.map((result, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {result.status === 'success' ? '✅' : '❌'}
                  </span>
                  <div>
                    <h5 className="font-semibold text-gray-800">{result.tableName}</h5>
                    {result.status === 'success' && (
                      <p className="text-sm text-gray-600">
                        {result.recordCount} records available
                      </p>
                    )}
                    {result.status === 'error' && (
                      <p className="text-sm text-red-600 font-mono">
                        {result.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  result.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.status === 'success' ? 'Connected' : 'Failed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
