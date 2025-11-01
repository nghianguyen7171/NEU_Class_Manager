'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, ExamScore } from '@/lib/supabase'
import ConnectionTest from '@/components/ConnectionTest'

export default function LookupPage() {
  const [selectedClass, setSelectedClass] = useState('Thứ 5, tiết 7-8')
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [result, setResult] = useState<ExamScore | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  // Class to table mapping
  const CLASS_TABLE_MAPPING = {
    'Thứ 5, tiết 7-8': 'DS_Thurs _7_8_Midterm.csv',
    'Thứ 4, tiết 5-6': 'DS_Wed _5_6_Midterm.csv',
    'Thứ 6, tiết 1-2': 'DS_Fri_1_2_Midterm.csv'
  }

  // Helper function to get table name from class
  const getTableName = (className: string): string => {
    return CLASS_TABLE_MAPPING[className as keyof typeof CLASS_TABLE_MAPPING] || 'DS_Thurs _7_8_Midterm.csv'
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedClass || !studentName.trim() || !studentId.trim()) {
      setError('Vui lòng chọn lớp học và nhập đầy đủ thông tin')
      return
    }

    setLoading(true)
    setError('')
    setNotFound(false)
    setResult(null)

    try {
      // Get the table name based on selected class
      const tableName = getTableName(selectedClass)
      
      // Try multiple search strategies
      let searchResult = null
      let searchError = null
      
      // Strategy 1: Exact match with trimmed values
      const exactResult = await supabase
        .from(tableName)
        .select('*')
        .eq('Tên', studentName.trim())
        .eq('MSV', parseInt(studentId.trim()))
        .single()
      
      if (!exactResult.error && exactResult.data) {
        searchResult = exactResult.data
      } else {
        // Strategy 2: Try with MSV as string
        const stringResult = await supabase
          .from(tableName)
          .select('*')
          .eq('Tên', studentName.trim())
          .eq('MSV', studentId.trim())
          .single()
        
        if (!stringResult.error && stringResult.data) {
          searchResult = stringResult.data
        } else {
          // Strategy 3: Case-insensitive name search
          const caseInsensitiveResult = await supabase
            .from(tableName)
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
    setSelectedClass('Thứ 5, tiết 7-8')
    setStudentName('')
    setStudentId('')
    setResult(null)
    setError('')
    setNotFound(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            ← Về trang chủ
          </Link>
        </div>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8">
          <Image
            src="/logo/NEU logo.png"
            alt="NEU Logo"
            width={150}
            height={150}
            className="object-contain h-auto"
          />
          <Image
            src="/logo/LogoNCT.png"
            alt="NCT Logo"
            width={150}
            height={150}
            className="object-contain h-auto"
          />
          <Image
            src="/logo/FDA logo_không nền.png"
            alt="FDA Logo"
            width={150}
            height={150}
            className="object-contain h-auto"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            🔍 Tra Cứu Điểm Thi
          </h1>
          <p className="text-gray-700 text-lg">
            Chọn lớp học và nhập thông tin để tra cứu điểm thi giữa kỳ
          </p>
        </div>

        {/* Connection Test */}
        <ConnectionTest />

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Class Selection */}
            <div>
              <label htmlFor="classSelect" className="block text-sm font-semibold text-gray-800 mb-2">
                Lớp học *
              </label>
              <select
                id="classSelect"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white hover:border-gray-400 transition-colors"
                disabled={loading}
                aria-label="Chọn lớp học"
              >
                <option value="Thứ 5, tiết 7-8">Thứ 5, tiết 7-8</option>
                <option value="Thứ 4, tiết 5-6">Thứ 4, tiết 5-6</option>
                <option value="Thứ 6, tiết 1-2">Thứ 6, tiết 1-2 (Kết quả thi online)</option>
              </select>
            </div>
            {/* Student Name */}
            <div>
              <label htmlFor="studentName" className="block text-sm font-semibold text-gray-800 mb-2">
                Tên sinh viên *
              </label>
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-600 transition-colors"
                placeholder="Nhập họ tên đầy đủ"
                disabled={loading}
                aria-label="Nhập tên sinh viên"
              />
            </div>
            
            {/* Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-semibold text-gray-800 mb-2">
                Mã số sinh viên *
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-600 transition-colors"
                placeholder="Nhập mã số sinh viên"
                disabled={loading}
                aria-label="Nhập mã số sinh viên"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Làm mới
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {(result || notFound || error) && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                  🎉 Kết quả tìm kiếm
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-3xl mr-4">✅</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tên sinh viên:</span>
                      <p className="text-lg font-bold text-green-800 mt-1">{result.Tên}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-3xl mr-4">🎯</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Số câu đúng:</span>
                      <p className="text-lg font-bold text-green-800 mt-1">{result['Số câu đúng']}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-3xl mr-4">🧾</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Điểm số:</span>
                      <p className="text-2xl font-bold text-green-800 mt-1">{result['Điểm']}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

