import type {PropsWithChildren} from 'react'
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {main: '#7b1fa2'},
        secondary: {main: '#2e7d32'},
        background: {default: '#faf7fc', paper: '#ffffff'},
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
