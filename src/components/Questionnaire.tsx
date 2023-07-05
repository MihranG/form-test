import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { resetQuestionnaire } from '../redux/questionnaireSlice.ts'
import NewQuestion from './NewQuestion.tsx'
import { IQuestion } from '../types.ts'
import { FC } from 'react'

const Questionnaire: FC = () => {
    const dispatch = useDispatch()
    const { questions, answers } = useSelector((state: RootState) => state.questionnaire)
    const lastEditingQuestion: number = useSelector((state: RootState) => {
        let indexOfEditableQuestion = 0
        questions.forEach(({ id }: IQuestion, indexOfElement) => {
            if (state.questionnaire.answers[id].submitted) {
                indexOfEditableQuestion = indexOfElement + 1
            }
        })
        return indexOfEditableQuestion
    })
    const handleRestartQuestionnaire = () => {
        dispatch(resetQuestionnaire())
    }

    const isQuestionnaireCompleted = lastEditingQuestion === questions.length

    return (
        <div className="questionnaire">
            <h2>Questionnaire</h2>
            {questions.map((question, indexOfQuestion) => {
                if (indexOfQuestion <= lastEditingQuestion) {
                    const expanded = indexOfQuestion === lastEditingQuestion
                    return (
                        <div key={question.id} className={`question-container ${expanded ? 'expanded' : 'collapsed'}`}>
                            <NewQuestion question={question} key={question.id} expanded={expanded} />
                        </div>
                    )
                }
            })}
            {isQuestionnaireCompleted && (
                <div className="completed-state">
                    <h3>Questionnaire Completed</h3>
                    <p>All questions have been answered.</p>
                    <button
                        onClick={() => {
                            console.log('show', answers)
                        }}
                    >
                        show answers in console
                    </button>
                    <button onClick={handleRestartQuestionnaire}>Restart Questionnaire</button>
                </div>
            )}
        </div>
    )
}

export default Questionnaire
