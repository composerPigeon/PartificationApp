import {useState} from 'react'
import {Autocomplete, Box, Button, Popover, Stack, TextField, Typography} from '@mui/material'
import {Instrument} from '../../domain/Instrument.ts'
import type {ScorePage} from '../../domain/ScorePage.ts'

interface CreateStaffFormProps {
    position: {top: number, left: number}
    instruments: Instrument[]
    page: ScorePage
    centerY: number
    onCancel(): void
    onCreate(height: number, instrumentName: string, shortcut: string): void
}

export function CreateStaffForm({position, instruments, page, centerY, onCancel, onCreate}: CreateStaffFormProps) {
    const [height, setHeight] = useState('75')
    const [instrumentName, setInstrumentName] = useState('')
    const [shortcut, setShortcut] = useState('')
    const validHeight = Number.isFinite(Number(height)) && Number(height) > 0
    const fits = validHeight && page.canPlaceStaff(centerY, Number(height))
    const existingInstrument = instruments.find(instrument => instrument.id === Instrument.createId(instrumentName.trim()))
    const existingShortcut = existingInstrument?.shortcut.trim() ?? ''
    const selectedShortcut = existingShortcut || shortcut
    const canSubmit = fits && !!instrumentName.trim() && !!selectedShortcut.trim()

    return (
        <Popover open anchorReference="anchorPosition" anchorPosition={position} onClose={onCancel}>
            <Box component="form" aria-label="Create staff" sx={{p: 2, width: 280, maxWidth: 'calc(100vw - 32px)'}}
                 onSubmit={event => {
                     event.preventDefault()
                     if (canSubmit) {
                         onCreate(Number(height), instrumentName.trim(), selectedShortcut.trim())
                     }
                 }}>
                <Stack spacing={2}>
                    <Typography variant="subtitle1">Create staff</Typography>
                    <TextField label="Height" type="number" size="small" autoFocus required
                               value={height} onChange={event => setHeight(event.target.value)}
                               error={!fits} helperText={!validHeight ? 'Enter a positive height.' : !fits ? 'Staff overlaps another staff or extends beyond the page.' : undefined}
                               slotProps={{htmlInput: {min: 0, step: 'any'}}}/>
                    <Autocomplete freeSolo options={instruments.map(instrument => instrument.title)}
                                  inputValue={instrumentName} value={existingInstrument?.title ?? null}
                                  onInputChange={(_, value) => setInstrumentName(value)}
                                  renderInput={params => <TextField {...params} label="Instrument name" size="small" required/>}/>
                    <TextField label="Shortcut" size="small" required value={selectedShortcut}
                               disabled={!!existingShortcut}
                               onChange={event => setShortcut(event.target.value)}/>
                    <Stack direction="row" spacing={1} sx={{justifyContent: 'flex-end'}}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={!canSubmit}>Create</Button>
                    </Stack>
                </Stack>
            </Box>
        </Popover>
    )
}
