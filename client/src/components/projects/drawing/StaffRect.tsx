import {alpha, useTheme} from '@mui/material'
import {Rect} from 'react-konva'
import type {Staff} from '../../../domain/Staff.ts'

interface StaffRectProps {
    staff: Staff
}

export function StaffRect({staff}: StaffRectProps) {
    const theme = useTheme()
    return (
        <Rect x={staff.x} y={staff.y} width={staff.width} height={staff.height}
              fill={alpha(theme.palette.secondary.main, 0.12)}/>
    )
}
