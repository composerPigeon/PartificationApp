import {alpha, useTheme} from '@mui/material'
import {Rect} from 'react-konva'
import type {Staff} from '../../../domain';
import type {ScorePageInteractionState} from '../../../hooks/scorePage';

interface StaffRectProps {
    staff: Staff
    interaction: ScorePageInteractionState
    y: number
    height: number
    selected: boolean
}

export function StaffRect({staff, y, height, interaction, selected}: StaffRectProps) {
    const theme = useTheme()
    return (
        <Rect id={String(staff.id)} name="staff-body" x={staff.x} y={y} width={staff.width} height={height}
              draggable={interaction.editable}
              onDragMove={event => {
                  event.target.x(staff.x)
                  interaction.previewStaff(staff, event.target.y())
              }}
              onDragEnd={event => {
                  interaction.finishStaffDrag(staff, event.target.y())
                  event.target.position({x: staff.x, y: staff.y})
              }}
              stroke={selected ? theme.palette.primary.main : undefined}
              strokeWidth={selected ? 2 : 0} strokeScaleEnabled={false}
              fill={alpha(selected ? theme.palette.primary.main : theme.palette.secondary.main, selected ? 0.2 : 0.12)}/>
    )
}
