import {useState} from 'react'
import {Autocomplete, Box, Button, Popover, Stack, TextField, Typography} from '@mui/material'
import {Instrument} from '../../domain/Instrument.ts'

interface CreateStaffFormProps {
    position: {top: number, left: number}
    instruments: Instrument[]
    onCancel(): void
    onCreate(height: number, instrumentName: string, shortcut: string): void
}

export function CreateStaffForm({position, instruments, onCancel, onCreate}: CreateStaffFormProps) {
    const [height, setHeight] = useState('75')
    const [instrumentName, setInstrumentName] = useState('Unassigned')
    const [shortcut, setShortcut] = useState('')
    const validHeight = Number.isFinite(Number(height)) && Number(height) > 0
    const existingInstrument = instruments.find(instrument => instrument.id === Instrument.createId(instrumentName.trim()))

    return (
        <Popover open anchorReference="anchorPosition" anchorPosition={position} onClose={onCancel}>
            <Box component="form" aria-label="Create staff" sx={{p: 2, width: 280, maxWidth: 'calc(100vw - 32px)'}}
                 onSubmit={event => {
                     event.preventDefault()
                     if (validHeight && instrumentName.trim()) {
                         onCreate(Number(height), instrumentName.trim(), shortcut.trim())
                     }
                 }}>
                <Stack spacing={2}>
                    <Typography variant="subtitle1">Create staff</Typography>
                    <TextField label="Height" type="number" size="small" autoFocus required
                               value={height} onChange={event => setHeight(event.target.value)}
                               error={!validHeight} helperText={!validHeight ? 'Enter a positive height.' : undefined}
                               slotProps={{htmlInput: {min: 0, step: 'any'}}}/>
                    <Autocomplete freeSolo options={instruments.map(instrument => instrument.title)}
                                  inputValue={instrumentName} value={existingInstrument?.title ?? null}
                                  onInputChange={(_, value) => setInstrumentName(value)}
                                  renderInput={params => <TextField {...params} label="Instrument name" size="small" required/>}/>
                    <TextField label="Shortcut" size="small" value={existingInstrument?.shortcut ?? shortcut}
                               disabled={!!existingInstrument}
                               onChange={event => setShortcut(event.target.value)}/>
                    <Stack direction="row" spacing={1} sx={{justifyContent: 'flex-end'}}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={!validHeight || !instrumentName.trim()}>Create</Button>
                    </Stack>
                </Stack>
            </Box>
        </Popover>
    )
}
