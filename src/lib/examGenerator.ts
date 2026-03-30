import seedrandom from 'seedrandom'
import { supabase } from './supabase'
import type { Question, ShuffledQuestion, TestVersion } from './types'

// Cache for generated tests
let cachedTests: TestVersion[] | null = null

// Helper function to shuffle an array using seeded random
function shuffleArray<T>(array: T[], seed: number): T[] {
  const rng = seedrandom(String(seed))
  const shuffled = [...array]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

type ChoiceSlot = { originalLetter: 'A' | 'B' | 'C' | 'D'; text: string }

const DISPLAY_LETTERS: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D']

function normalizeCorrectLetter(raw: string): 'A' | 'B' | 'C' | 'D' {
  const u = String(raw ?? '')
    .trim()
    .toUpperCase()
    .slice(0, 1)
  if (u === 'A' || u === 'B' || u === 'C' || u === 'D') return u
  return 'A'
}

/** Shuffle the four options per question; letters A–D label positions after shuffle. Seeded by version + index so each đề is stable. */
function createQuestion(
  question: Question,
  testVersion: number,
  questionIndexInTest: number
): ShuffledQuestion {
  const slots: ChoiceSlot[] = [
    { originalLetter: 'A', text: question['Lựa chọn A'] },
    { originalLetter: 'B', text: question['Lựa chọn B'] },
    { originalLetter: 'C', text: question['Lựa chọn C'] },
    { originalLetter: 'D', text: question['Lựa chọn D'] }
  ]

  const originalCorrectAnswer = normalizeCorrectLetter(question['Đáp án đúng'])

  const perQuestionSeed = 50000 + testVersion * 10000 + questionIndexInTest * 97
  const shuffledSlots = shuffleArray([...slots], perQuestionSeed)

  const displayChoices = shuffledSlots.map((slot, i) => ({
    letter: DISPLAY_LETTERS[i],
    text: slot.text
  }))

  const correctPos = shuffledSlots.findIndex((s) => s.originalLetter === originalCorrectAnswer)
  const shuffledCorrectAnswer = DISPLAY_LETTERS[correctPos >= 0 ? correctPos : 0]

  return {
    id: 0,
    text: question['Text đáp án'],
    choices: displayChoices.map((c) => c.text),
    originalCorrectAnswer,
    shuffledCorrectAnswer,
    displayChoices
  }
}

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  }
  
  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity)
}

// Generate 4 fixed test versions
export async function generateFixedTests(): Promise<TestVersion[]> {
  // Return cached tests if available
  if (cachedTests) {
    return cachedTests
  }
  
  try {
    // Fetch all questions from Supabase
    const { data: questions, error } = await supabase
      .from('test_library_lec1_lec6.csv')
      .select('*')
      .order('Text đáp án', { ascending: true })
    
    if (error) {
      console.error('Error fetching questions:', error)
      throw error
    }
    
    if (!questions || questions.length === 0) {
      throw new Error('No questions found in database')
    }
    
    // Decode HTML entities in all questions
    const decodedQuestions: Question[] = questions.map((q: Question) => ({
      'Text đáp án': decodeHtmlEntities(q['Text đáp án']),
      'Lựa chọn A': decodeHtmlEntities(q['Lựa chọn A']),
      'Lựa chọn B': decodeHtmlEntities(q['Lựa chọn B']),
      'Lựa chọn C': decodeHtmlEntities(q['Lựa chọn C']),
      'Lựa chọn D': decodeHtmlEntities(q['Lựa chọn D']),
      'Đáp án đúng': q['Đáp án đúng'],
      'Điểm': q['Điểm']
    }))
    
    // Generate 4 test versions with minimal question overlap
    // Strategy: Each test gets 40 questions from the 87-question pool
    // Use different shuffle seeds for each version to maximize diversity
    // With 87 questions and 4 tests of 40 each, overlap is naturally minimized
    
    const testVersions: TestVersion[] = []
    const questionsPerTest = 40
    
    // Generate 4 test versions with different question sets
    for (let version = 1; version <= 4; version++) {
      // Use different seed for each version to get different question order
      // Version 1: Seed 11000, Version 2: Seed 12000, Version 3: Seed 13000, Version 4: Seed 14000
      const versionSeed = 10000 + version * 1000
      const versionShuffled = shuffleArray([...decodedQuestions], versionSeed)
      
      // Take first 40 questions for this version
      const versionQuestions = versionShuffled.slice(0, questionsPerTest)

      const versionTestQuestions = versionQuestions.map((q, index) => ({
        ...createQuestion(q, version, index),
        id: index + 1 // Question numbers 1-40
      }))
      
      testVersions.push(versionTestQuestions)
    }
    
    // Cache the tests
    cachedTests = testVersions
    
    return testVersions
  } catch (error) {
    console.error('Error generating tests:', error)
    throw error
  }
}

/**
 * Gán đề 1–4 theo MSV: phân tán SV khác nhau ra các bộ 40 câu khác nhau;
 * cùng MSV luôn cùng đề (ổn định khi refresh trước khi nộp).
 * (Trước đây dùng localStorage — mọi phiên mới đều bắt đầu counter → hầu hết cùng một đề.)
 */
export function testVersionFromStudentId(studentId: string): number {
  const id = studentId.trim()
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (Math.abs(h) % 4) + 1
}

// Get a specific test version (1-4)
export async function getTestVersion(version: number): Promise<TestVersion> {
  const allTests = await generateFixedTests()
  
  if (version < 1 || version > 4) {
    throw new Error(`Invalid test version: ${version}. Must be 1-4.`)
  }
  
  return allTests[version - 1]
}

// Reset cache (useful for testing)
export function resetTestCache(): void {
  cachedTests = null
}

