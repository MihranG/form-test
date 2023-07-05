import { IAnswer, IQuestion } from '../types.ts'

export const getAnswersInitialState = (questions: IQuestion[]): Record<string, IAnswer> => {
    return questions.reduce((acc: Record<string, IAnswer>, el) => {
        const { id } = el
        acc[id] = {
            value: null,
            editingValue: null,
            submitted: false,
            error: null,
            id,
        }
        return acc
    }, {})
}
