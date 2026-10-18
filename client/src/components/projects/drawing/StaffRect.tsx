import {alpha, useTheme} from '@mui/material'
import {Rect} from 'react-konva'
import type {Staff} from '../../../domain/Staff.ts'

interface StaffRectProps {
    staff: Staff
    y: number
    height: number
    editable: boolean
    onDrag(y: number): void
    onDragEnd(y: number): number
}

export function StaffRect({staff, y, height, editable, onDrag, onDragEnd}: StaffRectProps) {
    const theme = useTheme()
    return (
        <Rect name="staff-body" x={staff.x} y={y} width={staff.width} height={height}
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
