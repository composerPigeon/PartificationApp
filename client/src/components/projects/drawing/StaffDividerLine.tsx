import {useTheme} from '@mui/material'
import {Line} from 'react-konva'
import type {StaffDivider} from '../../../domain/StaffDivider.ts'

interface StaffDividerLineProps {
    divider: StaffDivider
    y: number
}

export function StaffDividerLine({divider, y}: StaffDividerLineProps) {
    const theme = useTheme()
    return (
        <Line points={[divider.staff.x, y, divider.staff.x + divider.staff.width, y]}
              stroke={theme.palette.secondary.dark} strokeWidth={3} listening={false}/>
    )
}
