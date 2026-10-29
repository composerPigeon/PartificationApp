import {useState} from 'react'
import {TextField} from '@mui/material'
import type {Instrument} from '../../domain/Instrument.ts'
import type {ScorePage} from '../../domain/ScorePage.ts'
import {InstrumentForm} from './InstrumentForm.tsx'

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
    const validHeight = Number.isFinite(Number(height)) && Number(height) > 0
    const fits = validHeight && page.canPlaceStaff(centerY, Number(height))

    return (
        <InstrumentForm position={position} instruments={instruments} title="Add Staff" submitLabel="Create"
                        valid={fits} onCancel={onCancel}
                        onSubmit={(instrumentName, shortcut) => onCreate(Number(height), instrumentName, shortcut)}>
            <TextField label="Height" type="number" size="small" autoFocus required
                       value={height} onChange={event => setHeight(event.target.value)}
                       error={!fits} helperText={!validHeight ? 'Enter a positive height.' : !fits ? 'Staff overlaps another staff or extends beyond the page.' : undefined}
                       slotProps={{htmlInput: {min: 0, step: 'any'}}}/>
        </InstrumentForm>
    )
}
