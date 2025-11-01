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

// Shuffle choices for a single question
function shuffleChoices(question: Question, seed: number): ShuffledQuestion {
  const choices = [
    { letter: 'A', text: question['Lựa chọn A'] },
    { letter: 'B', text: question['Lựa chọn B'] },
    { letter: 'C', text: question['Lựa chọn C'] },
    { letter: 'D', text: question['Lựa chọn D'] }
  ]
  
  // Shuffle the choices
  const shuffled = shuffleArray(choices, seed)
  
  // Find the new position of the correct answer
  const originalCorrectLetter = question['Đáp án đúng']
  const originalCorrectChoice = choices.find(c => c.letter === originalCorrectLetter)
  const shuffledCorrectAnswer = shuffled.find(
    c => c.text === originalCorrectChoice?.text
  )?.letter || originalCorrectLetter
  
  return {
    id: 0, // Will be set when questions are assembled
    text: question['Text đáp án'],
    choices: shuffled.map(c => c.text),
    originalCorrectAnswer: originalCorrectLetter,
    shuffledCorrectAnswer,
    displayChoices: shuffled.map(c => ({ letter: c.letter, text: c.text }))
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
    
    // Use fixed seed to select 40 questions (same set for all tests)
    const selectedQuestions = shuffleArray(decodedQuestions, 12345)
      .slice(0, 40)
    
    // Generate 4 test versions with different shuffle seeds
    const testVersions: TestVersion[] = []
    
    for (let version = 1; version <= 4; version++) {
      const versionSeed = version * 1000 + version // 1001, 2002, 3003, 4004
      const shuffledQuestions = selectedQuestions.map((q, index) => {
        const shuffled = shuffleChoices(q, versionSeed + index)
        return {
          ...shuffled,
          id: index + 1 // Question numbers 1-40
        }
      })
      
      testVersions.push(shuffledQuestions)
    }
    
    // Cache the tests
    cachedTests = testVersions
    
    return testVersions
  } catch (error) {
    console.error('Error generating tests:', error)
    throw error
  }
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

