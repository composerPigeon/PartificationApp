import {useTheme} from '@mui/material'
import {Line} from 'react-konva'
import type {StaffDivider} from '../../../domain/StaffDivider.ts'

interface StaffDividerLineProps {
    divider: StaffDivider
    y: number
    editable: boolean
    scale: number
    onDrag(y: number): number
    onDragEnd(y: number): number
}

export function StaffDividerLine({divider, y, editable, scale, onDrag, onDragEnd}: StaffDividerLineProps) {
    const theme = useTheme()
    return (
        <Line name="staff-divider" x={0} y={y} points={[divider.staff.x, 0, divider.staff.x + divider.staff.width, 0]}
              stroke={theme.palette.secondary.dark} strokeWidth={3}
              listening={editable} draggable={editable} hitStrokeWidth={12 / scale}
              onDragMove={event => {
                  event.target.position({x: 0, y: onDrag(event.target.y())})
              }}
              onDragEnd={event => {
                  event.target.position({x: 0, y: onDragEnd(event.target.y())})
              }}/>
    )
}
