import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import questionsJSON from '../utils/questions.json'
import { IQuestion, IAnswer, TAnswerValue } from '../types.ts'
import { getAnswersInitialState } from '../utils/storeHelpers.ts'

interface QuestionnaireState {
    questions: IQuestion[]
    answers: Record<string, IAnswer>
    editingQuestionHistory: string[]
}

export const initialState: QuestionnaireState = {
    questions: questionsJSON,
    answers: getAnswersInitialState(questionsJSON),
    editingQuestionHistory: [],
}

const questionnaireSlice = createSlice({
    name: 'questionnaire',
    initialState,
    reducers: {
        validateAndSubmitAnswer(state, action: PayloadAction<{ questionId: string; isEdit: boolean }>) {
            const { questionId, isEdit } = action.payload
            const question = state.questions.find((q) => q.id === questionId)
            if (question) {
                const validationErrors: string[] = []

                if (question.validations.length) {
                    for (const validation of question.validations) {
                        const { qty, type, message } = validation
                        const value = !isEdit ? state.answers[questionId].value : state.answers[questionId].editingValue
                        switch (type) {
                            case 'required':
                                if (!value) {
                                    validationErrors.push(message)
                                }
                                break
                            case 'min':
                                if (value && qty && value.length < qty) {
                                    validationErrors.push(message)
                                }
                                break
                            case 'max':
                                if (value && qty && value.length > qty) {
                                    validationErrors.push(message)
                                }
                                break
                            default:
                                break
                        }
                    }
                    state.answers[questionId].error = validationErrors.length > 0 ? validationErrors : null
                }

                if (validationErrors.length > 0) {
                    state.answers[questionId].error = validationErrors
                    state.answers[questionId].submitted = false
                } else {
                    state.answers[questionId].submitted = true
                    if (isEdit) {
                        state.answers[questionId].value = state.answers[questionId].editingValue
                        state.answers[questionId].editingValue = null
                        state.editingQuestionHistory.pop()
                    }
                }
            }
        },
        resetQuestionnaire: (state) => {
            state.questions = initialState.questions
            state.answers = initialState.answers
        },
        updateAnswer(state, action: PayloadAction<{ questionId: string; value: TAnswerValue; isEdit: boolean }>) {
            const { questionId, value, isEdit } = action.payload
            if (isEdit) {
                if (value === null) {
                    state.answers[questionId].editingValue = null
                    state.editingQuestionHistory.pop()
                } else {
                    state.answers[questionId].editingValue = value
                }
            } else {
                state.answers[questionId].value = value
                state.answers[questionId].error = null
            }
        },
        submitQuestionnaire(state) {
            console.log('Submitting questionnaire:', state.answers)
        },
        addEditingQuestionToHistory(state, action: PayloadAction<string>) {
            const questionId = action.payload
            const { editingQuestionHistory, answers } = state
            const latestEditingQuestion = editingQuestionHistory.length
                ? editingQuestionHistory[editingQuestionHistory.length - 1]
                : undefined
            if (latestEditingQuestion === questionId) {
                editingQuestionHistory.pop()
            } else {
                editingQuestionHistory.push(questionId)
                answers[questionId].editingValue = answers[questionId].value
            }
        },
    },
})

export const { validateAndSubmitAnswer, resetQuestionnaire, updateAnswer, addEditingQuestionToHistory, submitQuestionnaire } =
    questionnaireSlice.actions

export default questionnaireSlice.reducer
