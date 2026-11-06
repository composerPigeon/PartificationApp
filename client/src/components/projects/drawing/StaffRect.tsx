import {alpha, useTheme} from '@mui/material'
import {Rect} from 'react-konva'
import type {Staff} from '../../../domain';
import type {ScorePageEditorState, ScorePageInteractionState} from '../../../hooks/scorePage';

interface StaffRectProps {
    staff: Staff
    editor: ScorePageEditorState
    interaction: ScorePageInteractionState
    y: number
    height: number
    selected: boolean
}

export function StaffRect({staff, editor, y, height, interaction, selected}: StaffRectProps) {
    const theme = useTheme()
    return (
        <Rect id={String(staff.id)} name="staff-body" x={staff.x} y={y} width={staff.width} height={height}
              draggable={interaction.editable}
              onDragMove={event => {
                  event.target.x(staff.x)
                  interaction.previewStaff(staff, event.target.y())
              }}
              onDragEnd={event => {
                  editor.moveStaff(staff.id, event.target.y())
                  interaction.clearPreview()
                  event.target.position({x: staff.x, y: staff.y})
              }}
              stroke={selected ? theme.palette.primary.main : undefined}
              strokeWidth={selected ? 2 : 0} strokeScaleEnabled={false}
              fill={alpha(selected ? theme.palette.primary.main : theme.palette.secondary.main, selected ? 0.2 : 0.12)}/>
    )
}
