import {Box, Typography} from '@mui/material'
import type {Staff} from '../../../domain/Staff.ts'

interface InstrumentTagProps {
    staff: Staff
    scale: number
    y: number
}

export function InstrumentTag({staff, scale, y}: InstrumentTagProps) {
    return (
        <Box sx={{
            position: 'absolute',
            top: (y + staff.height / 2) * scale,
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
        }}>
            <Typography variant="body2" sx={{fontWeight: 600}} noWrap title={staff.instrument.title}>
                {staff.instrument.title}
            </Typography>
        </Box>
    )
}
