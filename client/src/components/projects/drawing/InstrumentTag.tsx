import {Box, Typography} from '@mui/material'
import type {Staff} from '../../../domain/Staff.ts'

interface InstrumentTagProps {
    staff: Staff
    scale: number
    y: number
    height: number
    selected: boolean
    onEdit(position: {top: number, left: number}): void
}

export function InstrumentTag({staff, scale, y, height, selected, onEdit}: InstrumentTagProps) {
    return (
        <Box role="button" tabIndex={0} aria-label={`Edit instrument ${staff.instrument.title}`}
             onClick={event => onEdit({top: event.clientY, left: event.clientX})}
             onKeyDown={event => {
                 if (event.key !== 'Enter' && event.key !== ' ') return
                 event.preventDefault()
                 const bounds = event.currentTarget.getBoundingClientRect()
                 onEdit({top: bounds.top, left: bounds.left})
             }} sx={{
            cursor: 'pointer',
            position: 'absolute',
            top: (y + height / 2) * scale,
            transform: 'translateY(-50%)',
            width: '100%',
            boxSizing: 'border-box',
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            borderRadius: '4px 12px 12px 4px',
            borderLeft: '4px solid',
            borderColor: 'secondary.dark',
            px: 1.5,
            py: 0.75,
            boxShadow: 1,
            outline: selected ? '2px solid' : undefined,
            outlineColor: 'primary.main',
            outlineOffset: 2,
        }}>
            <Typography variant="body2" sx={{fontWeight: 600}} noWrap title={staff.instrument.title}>
                {staff.instrument.title}
            </Typography>
        </Box>
    )
}
