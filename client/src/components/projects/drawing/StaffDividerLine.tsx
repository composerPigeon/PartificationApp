import {useTheme} from '@mui/material'
import {Line} from 'react-konva'
import type {StaffDivider} from '../../../domain';
import {useStaffDragging} from '../../../hooks/project/workspace/scorePage';

interface StaffDividerLineProps {
    divider: StaffDivider
    scale: number
}

export function StaffDividerLine({divider, scale}: StaffDividerLineProps) {
    const dragging = useStaffDragging()
    const preview = dragging.dragPreview?.id === divider.staff.id ? dragging.dragPreview : null
    const y = preview ? preview.y + (divider === divider.staff.topDivider ? 0 : preview.height) : divider.y
    const theme = useTheme()
    return (
        <Line name="staff-divider" x={0} y={y} points={[divider.staff.x, 0, divider.staff.x + divider.staff.width, 0]}
              stroke={theme.palette.secondary.dark} strokeWidth={3}
              listening={dragging.editable} draggable={dragging.editable} hitStrokeWidth={12 / scale}
              onDragMove={event => {
                  const y = dragging.previewStaffResize(divider, event.target.y())
                  event.target.position({x: 0, y})
              }}
              onDragEnd={event => {
                  dragging.finishStaffResize(divider, event.target.y())
                  event.target.position({x: 0, y: divider.y})
              }}/>
    )
}
