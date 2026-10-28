import {useTheme} from '@mui/material'
import {Line} from 'react-konva'
import type {VerticalDivider} from '../../../domain/VerticalDivider.ts'

interface VerticalDividerLineProps {
    divider: VerticalDivider
    height: number
    editable: boolean
    scale: number
    minX: number
    maxX: number
    onDragEnd(n: number): void
}

export function VerticalDividerLine({divider, height, editable, scale, minX, maxX, onDragEnd}: VerticalDividerLineProps) {
    const theme = useTheme()
    const constrainX = (n: number) => Math.max(minX, Math.min(maxX, n))

    return (
        <Line name="vertical-divider" x={divider.x} y={0} points={[0, 0, 0, height]}
              stroke={theme.palette.secondary.dark} strokeWidth={3}
              listening={editable} draggable={editable} hitStrokeWidth={12 / scale}
              onDragMove={event => {
                  event.target.position({x: constrainX(event.target.x()), y: 0})
              }}
              onDragEnd={event => {
                  const n = constrainX(event.target.x())
                  event.target.position({x: n, y: 0})
                  onDragEnd(n)
              }}/>
    )
}
