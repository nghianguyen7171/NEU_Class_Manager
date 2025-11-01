import { supabase } from './supabase'
import type { ExamResponse, QuestionResponse, ShuffledQuestion } from './types'

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

