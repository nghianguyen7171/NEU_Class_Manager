'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DatabaseDebugger() {
  const [debugResult, setDebugResult] = useState<string>('')
  const [debugging, setDebugging] = useState(false)
  const [studentName, setStudentName] = useState('Bùi Quang Hà')
  const [studentId, setStudentId] = useState('11233662')

  const runDebugTest = async () => {
    setDebugging(true)
    setDebugResult('')
    
    try {
      let debugInfo = '🔍 DATABASE DEBUG REPORT\n\n'
      
      // Test 1: Check total records
      const countResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*', { count: 'exact' })
      
      debugInfo += `📊 Total records in table: ${countResult.count}\n\n`
      
      if (countResult.count === 0) {
        debugInfo += '❌ PROBLEM: Table is empty!\n'
        debugInfo += 'You need to upload your data to the Supabase table.\n\n'
        setDebugResult(debugInfo)
        return
      }
      
      // Test 2: Get sample records
      const sampleResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .limit(3)
      
      debugInfo += `📋 Sample records (first 3):\n`
      sampleResult.data?.forEach((record, index) => {
        debugInfo += `\nRecord ${index + 1}:\n`
        debugInfo += `  Tên: "${record.Tên}" (length: ${record.Tên?.length})\n`
        debugInfo += `  MSV: ${record.MSV} (type: ${typeof record.MSV})\n`
        debugInfo += `  Số câu đúng: "${record['Số câu đúng']}"\n`
        debugInfo += `  Điểm: "${record['Điểm']}"\n`
      })
      
      debugInfo += `\n\n🔍 SEARCH TESTS:\n\n`
      
      // Test 3: Search by MSV only
      const msvResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .eq('MSV', parseInt(studentId))
      
      debugInfo += `Test 1 - Search by MSV (${studentId}):\n`
      debugInfo += `  Found: ${msvResult.data?.length || 0} records\n`
      if (msvResult.data && msvResult.data.length > 0) {
        debugInfo += `  Record: "${msvResult.data[0].Tên}"\n`
      }
      
      // Test 4: Search by name only
      const nameResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .eq('Tên', studentName)
      
      debugInfo += `\nTest 2 - Search by Tên ("${studentName}"):\n`
      debugInfo += `  Found: ${nameResult.data?.length || 0} records\n`
      if (nameResult.data && nameResult.data.length > 0) {
        debugInfo += `  MSV: ${nameResult.data[0].MSV}\n`
      }
      
      // Test 5: Search by both (exact match)
      const bothResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .eq('Tên', studentName)
        .eq('MSV', parseInt(studentId))
      
      debugInfo += `\nTest 3 - Search by both (exact match):\n`
      debugInfo += `  Found: ${bothResult.data?.length || 0} records\n`
      
      // Test 6: Search with trimmed values
      const trimmedResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .eq('Tên', studentName.trim())
        .eq('MSV', parseInt(studentId.trim()))
      
      debugInfo += `\nTest 4 - Search with trimmed values:\n`
      debugInfo += `  Found: ${trimmedResult.data?.length || 0} records\n`
      
      // Test 7: Search with different MSV formats
      const msvStringResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .eq('MSV', studentId)
      
      debugInfo += `\nTest 5 - Search MSV as string ("${studentId}"):\n`
      debugInfo += `  Found: ${msvStringResult.data?.length || 0} records\n`
      
      // Test 8: Case-insensitive name search
      const caseInsensitiveResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .ilike('Tên', `%${studentName}%`)
      
      debugInfo += `\nTest 6 - Case-insensitive name search:\n`
      debugInfo += `  Found: ${caseInsensitiveResult.data?.length || 0} records\n`
      
      debugInfo += `\n\n✅ Debug complete!`
      
      setDebugResult(debugInfo)
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setDebugResult(`❌ Debug failed: ${errorMessage}`)
    } finally {
      setDebugging(false)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔧 Database Debugger
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        This tool will help diagnose why your search isn&apos;t working.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Student Name:
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Student ID:
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student ID"
          />
        </div>
      </div>
      
      <button
        onClick={runDebugTest}
        disabled={debugging}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {debugging ? 'Running Debug...' : 'Run Debug Test'}
      </button>
      
      {debugResult && (
        <div className="mt-4 p-4 rounded-md bg-white border">
          <pre className="text-xs font-mono whitespace-pre-wrap text-gray-800">
            {debugResult}
          </pre>
        </div>
      )}
    </div>
  )
}
