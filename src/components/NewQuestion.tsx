import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store.ts'
import { addEditingQuestionToHistory, updateAnswer, validateAndSubmitAnswer } from '../redux/questionnaireSlice.ts'
import { IAnswer, IQuestion } from '../types.ts'
import { QuestionInputRenderer } from './QuestionInputRenderer.tsx'
import { BriefAnswers } from './BriefAnswers.tsx'
import { QuestionStatusIcon } from './QuestionStatusIcon.tsx'
import { Button } from '@fluentui/react-components'

interface QuestionProps {
    question: IQuestion
    expanded: boolean
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, expanded }) => {
    const dispatch = useDispatch()
    const { editingQuestionHistory, answers } = useSelector((state: RootState) => state.questionnaire)
    const { conditions } = question
    const isQuestionnaireSubmitted = Object.values(answers).every((answer: IAnswer) => answer.submitted)
    const isEditing = useMemo(() => {
        if (editingQuestionHistory.length) {
            return question.id === editingQuestionHistory[editingQuestionHistory.length - 1]
        }
        return false
    }, [editingQuestionHistory, question.id])

    const isQuestionExpanded = useMemo(() => {
        if (!isQuestionnaireSubmitted) {
            return expanded
        } else {
            return isEditing
        }
    }, [expanded, isEditing, isQuestionnaireSubmitted])
    const shouldEnableQuestion = useMemo(
        () =>
            !conditions ||
            !conditions.length ||
            conditions?.some((condition) => {
                const { questionId, selectedValue } = condition.value
                const answer = answers[questionId]?.value
                if (condition.type === 'equals') {
                    return answer === selectedValue
                } else {
                    return answer !== selectedValue
                }
            }),
        [answers, conditions]
    )
    const handleAnswerChange = (value: string | string[]) => {
        dispatch(updateAnswer({ questionId: question.id, value, isEdit: isEditing }))
    }

    const handleSubmit = () => {
        dispatch(validateAndSubmitAnswer({ questionId: question.id, isEdit: isEditing }))
    }

    const handleCancel = () => {
        dispatch(updateAnswer({ questionId: question.id, value: null, isEdit: isEditing }))
    }
    const valueOfInput = isEditing ? answers[question.id].editingValue ?? '' : answers[question.id].value ?? ''

    const errors = answers[question.id].error
    const handleHeaderClick = () => {
        if (isQuestionnaireSubmitted) {
            dispatch(addEditingQuestionToHistory(question.id))
        }
    }
    return (
        <div className={`question ${isQuestionExpanded ? 'expanded' : ''}`}>
            <>
                <div className="question-header" onClick={handleHeaderClick}>
                    <h3>{question.title}</h3>
                    {!isQuestionExpanded && (
                        <>
                            <BriefAnswers answer={answers[question.id].value} />
                            <QuestionStatusIcon isComplete={isQuestionnaireSubmitted} />
                        </>
                    )}
                </div>
                {isQuestionExpanded && (
                    <div className="question-content">
                        <QuestionInputRenderer
                            question={question}
                            valueOfInput={valueOfInput}
                            handleAnswerChange={handleAnswerChange}
                            shouldEnableQuestion={shouldEnableQuestion}
                        />
                        {errors &&
                            errors.map((e, idx) => (
                                <div className="question__error" key={idx}>
                                    {e}
                                </div>
                            ))}
                        <div className="cta-buttons">
                            <Button appearance="primary" onClick={handleSubmit} disabled={!shouldEnableQuestion}>
                                {isEditing ? 'Edit' : 'Submit'}
                            </Button>
                            <Button appearance="transparent" onClick={handleCancel}>
                                Cancel
                            </Button>
                            {!shouldEnableQuestion && (
                                <Button appearance="transparent" onClick={handleSubmit}>
                                    Skip
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </>
        </div>
    )
}

export default QuestionComponent
