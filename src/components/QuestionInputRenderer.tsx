import QuestionInputText from './QuestionInputText.tsx'
import { FC } from 'react'
import { IOption, IQuestion } from '../types.ts'
import { Input, Label, Select, RadioGroup, Radio, Checkbox } from '@fluentui/react-components'

interface IProps {
    question: IQuestion
    valueOfInput: string | string[]
    handleAnswerChange: (v: string | string[]) => void
    shouldEnableQuestion: boolean
}

export const QuestionInputRenderer: FC<IProps> = ({ question, valueOfInput, handleAnswerChange, shouldEnableQuestion }) => {
    switch (question.type) {
        case 'TEXT':
            return <QuestionInputText value={valueOfInput} handler={handleAnswerChange} type="text" disabled={!shouldEnableQuestion} />
        case 'NUMBER':
            return <QuestionInputText value={valueOfInput} handler={handleAnswerChange} type="number" disabled={!shouldEnableQuestion} />
        case 'RADIO':
            return (
                <RadioGroup>
                    {question.options?.map((option: IOption) => (
                        <Label key={option.key}>
                            <Radio
                                disabled={!shouldEnableQuestion}
                                name={question.id}
                                value={option.key}
                                checked={valueOfInput === option.key}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                            />
                            {option.text}
                        </Label>
                    ))}
                </RadioGroup>
            )
        case 'DATE':
            return (
                <Input
                    type="date"
                    disabled={!shouldEnableQuestion}
                    value={typeof valueOfInput === 'string' ? valueOfInput : ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                />
            )
        case 'CHECKBOX':
            return (
                <div>
                    {question.options?.map((option: IOption) => (
                        <Label key={option.key}>
                            <Checkbox
                                name={option.key}
                                disabled={!shouldEnableQuestion}
                                checked={valueOfInput.includes(option.key) || false}
                                onChange={(e) => {
                                    const isChecked = e.target.checked
                                    const updatedAnswers = isChecked
                                        ? [...valueOfInput, option.key]
                                        : Array.isArray(valueOfInput)
                                        ? valueOfInput.filter((value: string) => value !== option.key)
                                        : []
                                    // the above code is just to avoid typescript warning
                                    handleAnswerChange(updatedAnswers)
                                }}
                            />
                            {option.text}
                        </Label>
                    ))}
                </div>
            )
        case 'SELECT':
            return (
                <Select value={valueOfInput} disabled={!shouldEnableQuestion} onChange={(e) => handleAnswerChange(e.target.value)}>
                    <option value="">Select an option</option>
                    {question.options?.map((option: IOption) => (
                        <option key={option.key} value={option.key}>
                            {option.text}
                        </option>
                    ))}
                </Select>
            )
    }
}
