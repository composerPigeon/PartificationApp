import {useId} from 'react'
import {Box, Stack, SvgIcon, Typography} from '@mui/material'

interface PdfFileFieldProps {
    state: { file: File | null }

    disabled?: boolean
}

export function PdfFileField({state, disabled}: PdfFileFieldProps) {
    const id = useId()
    return (
        <Box sx={{my: 2}}>
            <Box component="label" htmlFor={id} sx={{
                position: 'relative', display: 'block', p: 3, border: '1px dashed',
                borderColor: state.file ? 'primary.main' : 'divider', borderRadius: 2,
                bgcolor: state.file ? 'action.selected' : 'background.default',
                cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
                transition: 'border-color 150ms, background-color 150ms',
                ...(!disabled && {
                    '&:hover': {borderColor: 'primary.main', bgcolor: 'action.hover'},
                    '&:focus-within': {outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3},
                }),
            }}>
                <Stack spacing={1} sx={{alignItems: 'center', textAlign: 'center', minWidth: 0}}>
                    <Box sx={{display: 'grid', placeItems: 'center', width: 44, height: 44,
                        borderRadius: 2, bgcolor: 'action.selected', color: 'primary.main'}}>
                        <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2.8L17.2 8H14V4.8zM18 20H6V4h6v6h6v10zM11 18h2v-4h3l-4-4-4 4h3v4z"/>
                        </SvgIcon>
                    </Box>
                    <Typography id={`${id}-label`} variant="body2"
                                sx={{fontWeight: 600, overflowWrap: 'anywhere', maxWidth: '100%'}}>
                        {state.file?.name ?? 'Choose a PDF'}
                    </Typography>
                </Stack>
            <Box component="input" id={id} name="pdf" type="file" accept=".pdf,application/pdf"
                 required disabled={disabled} aria-labelledby={`${id}-label`}
                 sx={{position: 'absolute', inset: 0, width: '100%', height: '100%',
                     opacity: 0, cursor: disabled ? 'default' : 'pointer'}}
                 onChange={event => {
                     state.file = event.target.files?.[0] ?? null
                 }}/>
            </Box>
        </Box>
    )
}
