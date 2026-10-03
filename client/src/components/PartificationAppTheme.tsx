import type {PropsWithChildren} from 'react'
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {main: '#1976d2'},
        secondary: {main: '#0288d1'},
        background: {default: '#f7faff', paper: '#ffffff'},
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
