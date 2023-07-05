import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import questionnaireSlice, { validateAndSubmitAnswer, resetQuestionnaire, initialState, updateAnswer } from '../redux/questionnaireSlice'

describe('Questionnaire Slice', () => {
    let store: EnhancedStore
    const questionId = 'QUESTION_1'
    const isEdit = false
    const value = 'TEST_VALUE'

    beforeEach(() => {
        store = configureStore({
            reducer: { questionnaire: questionnaireSlice },
            preloadedState: { questionnaire: initialState },
        })
    })

    test('should dispatch validateAndSubmitAnswer action and change store appropriately', () => {
        store.dispatch(updateAnswer({ questionId, isEdit, value }))

        store.dispatch(validateAndSubmitAnswer({ questionId, isEdit }))
        const { answers } = store.getState().questionnaire

        expect(answers[questionId].value).toEqual(value)
        expect(answers[questionId].submitted).toEqual(true)
    })

    test('should dispatch resetQuestionnaire action and make editingValue null', () => {
        store.dispatch(updateAnswer({ questionId, isEdit: true, value }))
        const { answers } = store.getState().questionnaire
        expect(answers[questionId].editingValue).toEqual(value)
        store.dispatch(resetQuestionnaire())
        const newAnswers = store.getState().questionnaire.answers
        expect(newAnswers[questionId].editingValue).toEqual(null)
    })
})
