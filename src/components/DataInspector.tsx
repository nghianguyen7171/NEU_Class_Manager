'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DataInspector() {
  const [inspecting, setInspecting] = useState(false)
  const [tableData, setTableData] = useState<any[]>([])
  const [selectedTable, setSelectedTable] = useState('DS_Wed _5_6_Midterm.csv')

  const inspectTable = async () => {
    setInspecting(true)
    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*')
        .limit(10)

      if (error) {
        console.error('Inspection error:', error)
        setTableData([])
      } else {
        console.log('Table data:', data)
        setTableData(data || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setTableData([])
    } finally {
      setInspecting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-yellow-800 mb-3">
        🔍 Data Inspector (Debug Tool)
      </h3>
      <p className="text-yellow-700 mb-4">
        Inspect actual data in the database tables to debug search issues.
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-yellow-800 mb-2">
          Select Table:
        </label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white text-gray-900"
        >
          <option value="DS_Wed _5_6_Midterm.csv">DS_Wed _5_6_Midterm.csv (Thứ 5, tiết 7-8)</option>
          <option value="DS_Thurs _7_8_Midterm.csv">DS_Thurs _7_8_Midterm.csv (Thứ 4, tiết 5-6)</option>
        </select>
      </div>

      <button
        onClick={inspectTable}
        disabled={inspecting}
        className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-yellow-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {inspecting ? 'Inspecting...' : 'Inspect Table Data'}
      </button>

      {tableData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-yellow-800 mb-3">
            Sample Data (First 10 records):
          </h4>
          <div className="bg-white rounded-lg p-4 border border-yellow-200 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(tableData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {tableData.length === 0 && !inspecting && (
        <div className="mt-4 text-yellow-700">
          No data found or error occurred. Check console for details.
        </div>
      )}
    </div>
  )
}
