import {useTheme} from '@mui/material'
import {Line} from 'react-konva'
import type {StaffDivider} from '../../../domain';
import type {ScorePageEditorState, ScorePageInteractionState} from '../../../hooks/scorePage';

interface StaffDividerLineProps {
    divider: StaffDivider
    editor: ScorePageEditorState
    interaction: ScorePageInteractionState
    y: number
    scale: number
}

export function StaffDividerLine({divider, editor, y, interaction, scale}: StaffDividerLineProps) {
    const theme = useTheme()
    return (
        <Line name="staff-divider" x={0} y={y} points={[divider.staff.x, 0, divider.staff.x + divider.staff.width, 0]}
              stroke={theme.palette.secondary.dark} strokeWidth={3}
              listening={interaction.editable} draggable={interaction.editable} hitStrokeWidth={12 / scale}
              onDragMove={event => {
                  const bounds = editor.getStaffResizeBounds(divider, event.target.y())
                  interaction.previewStaffResize(divider.staff, bounds)
                  event.target.position({x: 0, y: bounds.y + (divider === divider.staff.topDivider ? 0 : bounds.height)})
              }}
              onDragEnd={event => {
                  editor.moveStaffDivider(divider, event.target.y())
                  interaction.clearPreview()
                  event.target.position({x: 0, y: divider.y})
              }}/>
    )
}
