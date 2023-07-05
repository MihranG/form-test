import { FC } from 'react'
import { TAnswerValue } from '../types.ts'

interface IProps {
    answer: TAnswerValue
}
export const BriefAnswers: FC<IProps> = ({ answer }) => {
    const isArray = Array.isArray(answer)
    return <div className="brief-answers">{isArray ? <h4>{answer.map((a) => `${a} `)}</h4> : <h4>{answer}</h4>}</div>
}
