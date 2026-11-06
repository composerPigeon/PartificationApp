import {useTheme} from '@mui/material'
import {Line} from 'react-konva'
import type {StaffDivider} from '../../../domain';
import type {ScorePageInteractionState} from '../../../hooks/scorePage';

interface StaffDividerLineProps {
    divider: StaffDivider
    interaction: ScorePageInteractionState
    y: number
    scale: number
}

export function StaffDividerLine({divider, y, interaction, scale}: StaffDividerLineProps) {
    const theme = useTheme()
    return (
        <Line name="staff-divider" x={0} y={y} points={[divider.staff.x, 0, divider.staff.x + divider.staff.width, 0]}
              stroke={theme.palette.secondary.dark} strokeWidth={3}
              listening={interaction.editable} draggable={interaction.editable} hitStrokeWidth={12 / scale}
              onDragMove={event => {
                  const y = interaction.previewStaffResize(divider, event.target.y())
                  event.target.position({x: 0, y})
              }}
              onDragEnd={event => {
                  interaction.finishStaffResize(divider, event.target.y())
                  event.target.position({x: 0, y: divider.y})
              }}/>
    )
}
