import {alpha, useTheme} from '@mui/material'
import {Rect} from 'react-konva'
import type {Staff} from '../../../domain/Staff.ts'

interface StaffRectProps {
    staff: Staff
    y: number
    editable: boolean
    onDrag(y: number): void
    onDragEnd(y: number): number
}

export function StaffRect({staff, y, editable, onDrag, onDragEnd}: StaffRectProps) {
    const theme = useTheme()
    return (
        <Rect x={staff.x} y={y} width={staff.width} height={staff.height}
              draggable={editable}
              onDragMove={event => {
                  event.target.x(staff.x)
                  onDrag(event.target.y())
              }}
              onDragEnd={event => {
                  const finalY = onDragEnd(event.target.y())
                  event.target.position({x: staff.x, y: finalY})
              }}
              fill={alpha(theme.palette.secondary.main, 0.12)}/>
    )
}
