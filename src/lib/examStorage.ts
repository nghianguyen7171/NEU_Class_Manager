import { supabase } from './supabase'
import type { ExamResponse, FinalExamResponse, QuestionResponse, ShuffledQuestion } from './types'

// Save exam response to Supabase
export async function saveExamResponse(
  studentName: string,
  studentId: string,
  testVersion: number,
  questions: ShuffledQuestion[],
  studentAnswers: Record<number, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Calculate score for each question and build responses
    const questionResponses: QuestionResponse[] = []
    let totalScore = 0
    
    questions.forEach((question, index) => {
      const qNumber = index + 1
      const studentAnswer = studentAnswers[qNumber] || ''
      const isCorrect = studentAnswer === question.shuffledCorrectAnswer
      const score = isCorrect ? 0.25 : 0
      
      totalScore += score
      
      questionResponses.push({
        text: question.text,
        choices: JSON.stringify(question.displayChoices),
        studentAnswer,
        correctAnswer: question.shuffledCorrectAnswer,
        score
      })
    })
    
    // Prepare the response object
    const responseData: Omit<ExamResponse, 'id' | 'created_at'> = {
      student_name: studentName,
      student_id: studentId,
      test_version: testVersion,
      responses: JSON.stringify(questionResponses),
      total_score: totalScore
    }
    
    // Insert into Supabase
    const { error } = await supabase
      .from('exam_responses')
      .insert(responseData)
    
    if (error) {
      console.error('Error saving exam response:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in saveExamResponse:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

// Get exam response for a student
export async function getExamResponse(
  studentId: string
): Promise<ExamResponse | null> {
  try {
    const { data, error } = await supabase
      .from('exam_responses')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching exam response:', error)
      throw error
    }
    
    return data as ExamResponse
  } catch (error) {
    console.error('Error in getExamResponse:', error)
    return null
  }
}

// Save final exam response to Supabase
export async function saveFinalExamResponse(
  studentName: string,
  studentId: string,
  questions: ShuffledQuestion[],
  studentAnswers: Record<number, string>
): Promise<{ success: boolean; error?: string; totalScore?: number; numCorrect?: number }> {
  try {
    const questionResponses: QuestionResponse[] = []
    let totalScore = 0
    let numCorrect = 0

    questions.forEach((question, index) => {
      const qNumber = index + 1
      const studentAnswer = studentAnswers[qNumber] || ''
      const isCorrect = studentAnswer === question.shuffledCorrectAnswer
      const score = isCorrect ? 0.25 : 0

      if (isCorrect) numCorrect += 1
      totalScore += score

      questionResponses.push({
        text: question.text,
        choices: JSON.stringify(question.displayChoices),
        studentAnswer,
        correctAnswer: question.shuffledCorrectAnswer,
        score
      })
    })

    const responseData: Omit<FinalExamResponse, 'id' | 'created_at'> = {
      student_name: studentName,
      student_id: studentId,
      responses: JSON.stringify(questionResponses),
      total_score: totalScore,
      num_correct: numCorrect
    }

    const { error } = await supabase
      .from('final_exam_responses')
      .insert(responseData)

    if (error) {
      console.error('Error saving final exam response:', error)
      return { success: false, error: error.message }
    }

    return { success: true, totalScore, numCorrect }
  } catch (error) {
    console.error('Error in saveFinalExamResponse:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

// Get final exam response for a student
export async function getFinalExamResponse(
  studentId: string
): Promise<FinalExamResponse | null> {
  try {
    const { data, error } = await supabase
      .from('final_exam_responses')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching final exam response:', error)
      throw error
    }

    return data as FinalExamResponse
  } catch (error) {
    console.error('Error in getFinalExamResponse:', error)
    return null
  }
}

