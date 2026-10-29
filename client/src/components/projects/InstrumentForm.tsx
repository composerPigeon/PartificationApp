import {useState, type ReactNode} from 'react'
import {Autocomplete, Box, Button, Popover, Stack, TextField} from '@mui/material'
import {Instrument} from '../../domain/Instrument.ts'
import {ContextFormHeading} from '../formComponents/ContextFormHeading.tsx'

interface InstrumentFormProps {
    position: {top: number, left: number}
    instruments: Instrument[]
    instrument?: Instrument
    title?: string
    submitLabel?: string
    valid?: boolean
    children?: ReactNode
    onCancel(): void
    onSubmit?(instrumentName: string, shortcut: string): void
}

export function InstrumentForm({position, instruments, instrument, title = 'Edit Instrument', submitLabel = 'Save',
    valid = true, children, onCancel, onSubmit}: InstrumentFormProps) {
    const [instrumentName, setInstrumentName] = useState(instrument?.title ?? '')
    const [shortcut, setShortcut] = useState(instrument?.shortcut ?? '')
    const existingInstrument = instruments.find(item => item.id === Instrument.createId(instrumentName.trim()))
    const existingShortcut = existingInstrument !== instrument ? existingInstrument?.shortcut.trim() ?? '' : ''
    const selectedShortcut = existingShortcut || shortcut
    const canSubmit = !!onSubmit && valid && !!instrumentName.trim() && !!selectedShortcut.trim()

    return (
        <Popover open anchorReference="anchorPosition" anchorPosition={position} onClose={onCancel}>
            <Box component="form" aria-label={title} sx={{p: 2, width: 280, maxWidth: 'calc(100vw - 32px)'}}
                 onSubmit={event => {
                     event.preventDefault()
                     if (canSubmit) onSubmit?.(instrumentName.trim(), selectedShortcut.trim())
                 }}>
                <Stack spacing={2}>
                    <ContextFormHeading>{title}</ContextFormHeading>
                    {children}
                    <Autocomplete freeSolo options={instruments.map(item => item.title)}
                                  inputValue={instrumentName} value={existingInstrument?.title ?? null}
                                  onInputChange={(_, value) => setInstrumentName(value)}
                                  renderInput={params => <TextField {...params} label="Instrument name" size="small" required autoFocus={!children}/>}/>
                    <TextField label="Shortcut" size="small" required value={selectedShortcut}
                               disabled={!!existingShortcut}
                               onChange={event => setShortcut(event.target.value)}/>
                    <Stack direction="row" spacing={1} sx={{justifyContent: 'flex-end'}}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={!canSubmit}>{submitLabel}</Button>
                    </Stack>
                </Stack>
            </Box>
        </Popover>
    )
}
