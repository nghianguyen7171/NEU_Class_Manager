'use client'

import { useState } from 'react'
import { supabase, ExamScore } from '@/lib/supabase'
import ConnectionTest from '@/components/ConnectionTest'

export default function Home() {
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [result, setResult] = useState<ExamScore | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!studentName.trim() || !studentId.trim()) {
      setError('Vui lòng nhập đầy đủ tên và mã số sinh viên')
      return
    }

    setLoading(true)
    setError('')
    setNotFound(false)
    setResult(null)

    try {
      // Try multiple search strategies
      let searchResult = null
      let searchError = null
      
      // Strategy 1: Exact match with trimmed values
      const exactResult = await supabase
        .from('DS_Thurs _7_8_Midterm.csv')
        .select('*')
        .eq('Tên', studentName.trim())
        .eq('MSV', parseInt(studentId.trim()))
        .single()
      
      if (!exactResult.error && exactResult.data) {
        searchResult = exactResult.data
      } else {
        // Strategy 2: Try with MSV as string
        const stringResult = await supabase
          .from('DS_Thurs _7_8_Midterm.csv')
          .select('*')
          .eq('Tên', studentName.trim())
          .eq('MSV', studentId.trim())
          .single()
        
        if (!stringResult.error && stringResult.data) {
          searchResult = stringResult.data
        } else {
          // Strategy 3: Case-insensitive name search
          const caseInsensitiveResult = await supabase
            .from('DS_Thurs _7_8_Midterm.csv')
            .select('*')
            .ilike('Tên', `%${studentName.trim()}%`)
            .eq('MSV', parseInt(studentId.trim()))
            .single()
          
          if (!caseInsensitiveResult.error && caseInsensitiveResult.data) {
            searchResult = caseInsensitiveResult.data
          } else {
            searchError = exactResult.error || stringResult.error || caseInsensitiveResult.error
          }
        }
      }

      if (searchError) {
        if (searchError.code === 'PGRST116') {
          // No rows returned
          setNotFound(true)
        } else if (searchError.message.includes('Could not find the table')) {
          console.error('Table not found error:', searchError)
          setError('Database table not accessible. Please contact administrator.')
        } else {
          console.error('Supabase error:', searchError)
          setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.')
        }
      } else if (searchResult) {
        setResult(searchResult)
      } else {
        setNotFound(true)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStudentName('')
    setStudentId('')
    setResult(null)
    setError('')
    setNotFound(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Tra Cứu Điểm Thi
          </h1>
          <p className="text-gray-600">
            Nhập tên và mã số sinh viên để tra cứu điểm thi giữa kỳ
          </p>
        </div>

        {/* Connection Test */}
        <ConnectionTest />

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên sinh viên *
              </label>
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-600"
                placeholder="Nhập họ tên đầy đủ"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Mã số sinh viên *
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-600"
                placeholder="Nhập mã số sinh viên"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tìm kiếm...
                  </span>
                ) : (
                  'Tìm kiếm'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Làm mới
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {(result || notFound || error) && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {notFound && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      ⚠️ No record found. Please check your name or student ID.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-md p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 text-center">
                  Kết quả tìm kiếm
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tên:</span>
                      <span className="ml-2 font-semibold text-green-800">{result.Tên}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Số câu đúng:</span>
                      <span className="ml-2 font-semibold text-green-800">{result['Số câu đúng']}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🧾</span>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Điểm:</span>
                      <span className="ml-2 font-semibold text-green-800 text-xl">{result['Điểm']}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 NEU Class Manager - Exam Score Lookup</p>
        </div>
      </div>
    </div>
  )
}