import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import {Questionnaire} from './components/Questionnaire.tsx'

function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <Questionnaire />
        </FluentProvider>
    )
}

export default App
