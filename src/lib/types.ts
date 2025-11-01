// Type definitions for the exam system

export interface Question {
  'Text đáp án': string
  'Lựa chọn A': string
  'Lựa chọn B': string
  'Lựa chọn C': string
  'Lựa chọn D': string
  'Đáp án đúng': string // A, B, C, or D
  'Điểm': string
}

export interface ShuffledQuestion {
  id: number
  text: string
  choices: string[] // Array of 4 choices in shuffled order
  originalCorrectAnswer: string // Original correct answer letter
  shuffledCorrectAnswer: string // Correct answer letter after shuffling
  displayChoices: { letter: string; text: string }[] // For easy rendering
}

export interface QuestionResponse {
  text: string
  choices: string
  studentAnswer: string
  correctAnswer: string
  score: number
}

export interface ExamResponse {
  id?: number
  created_at?: string
  student_name: string
  student_id: string
  test_version: number
  responses: string // JSON string containing all 40 Q&A
  total_score: number
}

export type TestVersion = ShuffledQuestion[]

