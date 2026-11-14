import type {PropsWithChildren} from 'react'
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {main: '#922b35'},
        secondary: {main: '#247c80'},
        background: {default: '#fcf8f7', paper: '#ffffff'},
    },
    shape: {borderRadius: 12},
})

export function PartificationAppTheme({children}: PropsWithChildren) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
}
