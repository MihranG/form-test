import { configureStore } from '@reduxjs/toolkit'
import questionnaireSlice from './questionnaireSlice.ts'

export const store = configureStore({
    reducer: {
        questionnaire: questionnaireSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type StoreType = typeof store
export type AppDispatch = typeof store.dispatch
