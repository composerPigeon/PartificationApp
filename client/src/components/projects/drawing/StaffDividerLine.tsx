import {useTheme} from '@mui/material'
import {Line} from 'react-konva'
import type {StaffDivider} from '../../../domain/StaffDivider.ts'

interface StaffDividerLineProps {
    divider: StaffDivider
}

export function StaffDividerLine({divider}: StaffDividerLineProps) {
    const theme = useTheme()
    return (
        <Line points={[divider.staff.x, divider.y, divider.staff.x + divider.staff.width, divider.y]}
              stroke={theme.palette.secondary.dark} strokeWidth={3} listening={false}/>
    )
}
