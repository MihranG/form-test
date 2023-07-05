export type TAnswerValue = string | string[] | null
export type IAnswer = {
    id: string
    value: TAnswerValue
    submitted: boolean
    error: string[] | null
    editingValue: TAnswerValue
}

export interface IOption {
    key: string
    text: string
}

export interface IValidation {
    type: string
    message: string
    qty?: number
}

export interface IQuestion {
    id: string
    title: string
    description: string
    type: 'TEXT' | 'RADIO' | 'DATE' | 'CHECKBOX' | 'SELECT' | 'NUMBER' | string // todo fix the problem with types after adding logic for enable
    options: IOption[] | null
    value: string | string[] | null
    enabled?: boolean
    validations: IValidation[]
    conditions?: Array<{
        type: 'not_equals' | 'equals' | string
        value: { questionId: string; selectedValue: string }
    }>
}
