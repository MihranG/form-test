import { FC } from 'react'

interface IProps {
    isComplete: boolean
}
export const QuestionStatusIcon: FC<IProps> = ({ isComplete }) => <div className={`status_icon${isComplete ? ' completed' : ''}`} />
