import { render, screen } from '@testing-library/react'
import Question from '../components/NewQuestion.tsx'
import questions from '../utils/questions.json'
import { configureStore } from '@reduxjs/toolkit'
import questionnaireSlice, { initialState } from '../redux/questionnaireSlice.ts'
import { Provider } from 'react-redux'

const question = questions[0]
describe('Question component', () => {
    const store = configureStore({
        reducer: { questionnaire: questionnaireSlice },
        preloadedState: { questionnaire: initialState },
    })
    test('renders question title', () => {
        render(
            <Provider store={store}>
                <Question expanded={true} question={question} />
            </Provider>
        )

        const titleElement = screen.getByText(question.title)
        expect(titleElement).toBeInTheDocument()
    })
    // the test is just for demo purposes , tried to write it within a short amount of time
})
