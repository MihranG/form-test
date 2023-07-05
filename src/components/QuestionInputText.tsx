import { FC } from 'react'
import { Input } from '@fluentui/react-components'

interface IProps {
    value: string | string[]
    handler: (v: string) => void
    type: 'text' | 'number'
    disabled: boolean
}
const QuestionInputText: FC<IProps> = ({ value, handler, type, disabled }) => {
    const isValueTypeString = typeof value === 'string'
    // the above check is for be sure not get ts complains
    return (
        isValueTypeString && (
            <Input className="question_input" type={type} value={value} onChange={(e) => handler(e.target.value)} disabled={disabled} />
        )
    )
}

export default QuestionInputText
