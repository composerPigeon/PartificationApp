import {useState} from 'react'
import {Box, Button, Popover, Stack, TextField, Typography} from '@mui/material'

interface CreateStaffFormProps {
    position: {top: number, left: number}
    onCancel(): void
    onCreate(height: number, instrumentName: string, shortcut: string): void
}

export function CreateStaffForm({position, onCancel, onCreate}: CreateStaffFormProps) {
    const [height, setHeight] = useState('75')
    const [instrumentName, setInstrumentName] = useState('Unassigned')
    const [shortcut, setShortcut] = useState('')
    const validHeight = Number.isFinite(Number(height)) && Number(height) > 0

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
                    <TextField label="Instrument name" size="small" required value={instrumentName}
                               onChange={event => setInstrumentName(event.target.value)}/>
                    <TextField label="Shortcut" size="small" value={shortcut}
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
