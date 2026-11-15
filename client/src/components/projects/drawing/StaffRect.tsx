import {alpha, useTheme} from '@mui/material'
import {Rect} from 'react-konva'
import type {Staff} from '../../../domain';
import {useStaffDragging, useStaffSelection} from '../../../hooks/project/workspace/scorePage';

interface StaffRectProps {
    staff: Staff
}

export function StaffRect({staff}: StaffRectProps) {
    const dragging = useStaffDragging()
    const selection = useStaffSelection()
    const selected = selection.isSelected(staff.id)
    const preview = dragging.dragPreview?.id === staff.id ? dragging.dragPreview : null
    const y = preview?.y ?? staff.y
    const height = preview?.height ?? staff.height
    const theme = useTheme()
    return (
        <Rect id={String(staff.id)} name="staff-body" x={staff.x} y={y} width={staff.width} height={height}
              draggable={dragging.editable}
              onDragMove={event => {
                  event.target.x(staff.x)
                  dragging.previewStaff(staff, event.target.y())
              }}
              onDragEnd={event => {
                  dragging.finishStaffDrag(staff, event.target.y())
                  event.target.position({x: staff.x, y: staff.y})
              }}
              stroke={selected ? theme.palette.primary.main : undefined}
              strokeWidth={selected ? 2 : 0} strokeScaleEnabled={false}
              fill={alpha(selected ? theme.palette.primary.main : theme.palette.secondary.main, selected ? 0.2 : 0.12)}/>
    )
}
