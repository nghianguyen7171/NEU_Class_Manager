'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTestVersion } from '@/lib/examGenerator'
import { saveExamResponse, getExamResponse } from '@/lib/examStorage'
import type { ShuffledQuestion } from '@/lib/types'

export default function ExamPage() {
  // State management
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [testVersion, setTestVersion] = useState<number | null>(null)
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([])
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({})
  const [examStarted, setExamStarted] = useState(false)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle starting the exam
  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!studentName.trim() || !studentId.trim()) {
      setError('Vui lòng nhập đầy đủ Họ và tên và MSV')
      return
    }

    // Check if student has already taken the exam
    setLoading(true)
    setError('')
    
    try {
      const existingResponse = await getExamResponse(studentId.trim())
      
      if (existingResponse) {
        setError('Bạn đã hoàn thành bài kiểm tra rồi!')
        setLoading(false)
        return
      }
    } catch (err) {
      console.error('Error checking existing response:', err)
      // Continue anyway
    }

    // Assign test version sequentially
    let counter = parseInt(localStorage.getItem('exam_counter') || '0')
    counter++
    const assignedVersion = (counter % 4) + 1 // Cycles through 1-4
    localStorage.setItem('exam_counter', counter.toString())
    
    setTestVersion(assignedVersion)

    try {
      // Load questions for assigned version
      const testQuestions = await getTestVersion(assignedVersion)
      setQuestions(testQuestions)
      setExamStarted(true)
    } catch (err) {
      console.error('Error loading exam:', err)
      setError('Không thể tải bài kiểm tra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Handle answer selection
  const handleAnswerChange = (qNumber: number, answer: string) => {
    setStudentAnswers(prev => ({
      ...prev,
      [qNumber]: answer
    }))
  }

  // Handle exam submission
  const handleSubmitExam = async () => {
    // Confirm submission
    const confirmed = window.confirm('Bạn có chắc chắn muốn nộp bài?')
    
    if (!confirmed) {
      return
    }

    if (!testVersion || questions.length === 0) {
      setError('Lỗi: Không tìm thấy thông tin bài kiểm tra')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Save response to Supabase
      const result = await saveExamResponse(
        studentName.trim(),
        studentId.trim(),
        testVersion,
        questions,
        studentAnswers
      )

      if (result.success) {
        // Calculate and display total score
        let score = 0
        questions.forEach(q => {
          const studentAnswer = studentAnswers[q.id]
          if (studentAnswer === q.shuffledCorrectAnswer) {
            score += 0.25
          }
        })
        setTotalScore(score)
        setExamSubmitted(true)
      } else {
        setError(result.error || 'Không thể lưu bài làm. Vui lòng thử lại.')
      }
    } catch (err) {
      console.error('Error submitting exam:', err)
      setError('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Render Phase 1: Entry form
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white text-center">
                Kiểm tra Giữa Kỳ - Data Science
              </h1>
              <div className="text-center mt-3">
                <span className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-lg font-semibold">
                  ⏱️ 60 phút
                </span>
              </div>
            </div>
            
            <div className="p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  ⚠️ {error}
                </div>
              )}
              
              <form onSubmit={handleStartExam}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-600"
                      placeholder="Nhập họ và tên của bạn"
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                      MSV (Mã số sinh viên)
                    </label>
                    <input
                      type="text"
                      id="id"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-600"
                      placeholder="Nhập MSV của bạn"
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Lưu ý:</strong> Bạn chỉ có một lần làm bài duy nhất. Vui lòng hoàn thành tất cả 40 câu hỏi trước khi nộp bài.
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Đang tải...' : 'Bắt đầu làm bài'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Phase 2: Exam interface
  if (!examSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Kiểm tra Giữa Kỳ</h2>
                <p className="text-gray-600 mt-1">
                  {studentName} - MSV: {studentId} - Đề thi số {testVersion}
                </p>
              </div>
              <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold">
                ⏱️ 60 phút
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}
            
            <div className="space-y-8">
              {questions.map((question) => (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="mb-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                      Câu {question.id}
                    </span>
                    <span className="text-gray-600 text-sm">(0.25 điểm)</span>
                  </div>
                  
                  <p className="text-gray-800 text-lg mb-4 font-medium">
                    {question.text}
                  </p>
                  
                  <div className="space-y-3">
                    {question.displayChoices.map((choice) => {
                      const isSelected = studentAnswers[question.id] === choice.letter
                      
                      return (
                        <label
                          key={choice.letter}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={choice.letter}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(question.id, choice.letter)}
                            className="mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800 mr-2">
                              {choice.letter}.)
                            </span>
                            <span className="text-gray-700">
                              {choice.text}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Lưu ý:</strong> Vui lòng kiểm tra lại các câu trả lời trước khi nộp bài. Sau khi nộp bài, bạn không thể chỉnh sửa.
                </p>
              </div>
              
              <button
                onClick={handleSubmitExam}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Đang nộp bài...' : '✅ Nộp bài'}
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-4">
                Đã trả lời: {Object.keys(studentAnswers).length} / 40 câu hỏi
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Phase 3: Completion screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-white">
              Đã nộp bài thành công!
            </h1>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 rounded-full p-8 mb-6">
                <div className="text-6xl mb-4">✅</div>
              </div>
              
              <p className="text-gray-700 text-lg mb-4 font-semibold">
                Cảm ơn bạn đã hoàn thành bài kiểm tra!
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Thông tin bài làm:</p>
                <p>Họ và tên: {studentName}</p>
                <p>MSV: {studentId}</p>
                <p>Đề thi số: {testVersion}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 text-center">
                Bài làm của bạn đã được lưu vào hệ thống. Kết quả sẽ được công bố sau.
              </p>
            </div>
            
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

