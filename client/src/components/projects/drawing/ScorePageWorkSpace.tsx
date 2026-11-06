// @refresh reset
import {useLayoutEffect, useState} from 'react'
import {Alert, Box, useTheme} from '@mui/material'
import {Image as PageImage, Layer, Line, Stage} from 'react-konva'
import type {ProjectState, ProjectSaveState} from '../../../hooks/project';
import type {ScorePage} from '../../../domain';
import {useScorePageInteraction} from '../../../hooks/scorePage';
import type {EditingModeState, StaffSelectionState, ScorePageEditorState} from '../../../hooks/scorePage';
import {StaffRect} from './StaffRect.tsx'
import {StaffDividerLine} from './StaffDividerLine.tsx'
import {VerticalDividerLine} from './VerticalDividerLine.tsx'
import {InstrumentForm} from '../InstrumentForm.tsx'
import {InstrumentTag} from './InstrumentTag.tsx'
import {ToolBar} from '../ToolBar'

interface ScorePageWorkSpaceProps {
    projectState: ProjectState
    page: ScorePage
    editor: ScorePageEditorState
    editing: EditingModeState
    selection: StaffSelectionState
    saveState: ProjectSaveState
    onExport(): void
}

export function ScorePageWorkSpace({projectState, page, editor, editing, selection, saveState, onExport}: ScorePageWorkSpaceProps) {
    const {project} = projectState
    const theme = useTheme()
    const projectName = project.projectName
    const [scale, setScale] = useState(800 / page.width)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [error, setError] = useState(false)
    const interaction = useScorePageInteraction({projectState, page, editor, editing, selection, disabled: error})
    const {stageRef, cursor, pendingStaff, instrumentForm, dragPreview} = interaction

    useLayoutEffect(() => {
        const container = stageRef.current!.container()
        container.setAttribute('aria-label', `${projectName}, page ${page.number} workspace`)
        const parent = container.parentElement!
        const resize = () => setScale(Math.min(800, parent.clientWidth) / page.width)
        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(parent)

        const source = new window.Image()
        const url = URL.createObjectURL(page.blob)
        source.onload = () => setImage(source)
        source.onerror = () => setError(true)
        source.src = url
        return () => {
            observer.disconnect()
            source.onload = source.onerror = null
            URL.revokeObjectURL(url)
        }
    }, [page, projectName, stageRef])

    return (
        <>
            <ToolBar editing={editing} editor={editor} interaction={interaction} saveState={saveState} onExport={onExport}/>
            <Box sx={{width: '100%', maxWidth: 1104, display: 'grid', gridTemplateColumns: 'clamp(64px, 12vw, 144px) minmax(0, 800px) clamp(64px, 12vw, 144px)', gap: 1}}>
                <Box sx={{
                    minWidth: 0,
                    gridColumn: 2,
                    cursor,
                    '& .konvajs-content, & canvas': {cursor: 'inherit'},
                }}>
                    <Stage ref={stageRef} width={page.width * scale} height={page.height * scale}
                   scaleX={scale} scaleY={scale} role="region"
                   onClick={interaction.onClick}
                   onMouseDown={interaction.onMouseDown}
                   onMouseUp={interaction.onMouseUp}
                   onMouseMove={interaction.onMouseMove}
                   onMouseLeave={interaction.onMouseLeave}
                   onDragStart={interaction.onDragStart}
                   onDragEnd={interaction.onDragEnd}
                   style={{background: 'white', boxShadow: '0 3px 12px #0003'}}>
                <Layer name="page-image" listening={false}>
                    {image && <PageImage image={image} width={page.width} height={page.height}/>}
                </Layer>
                <Layer name="page-drawings">
                    {pendingStaff && [pendingStaff.startY, pendingStaff.endY].map((y, index) => (
                        <Line key={index} points={[page.leftDivider.x, y, page.rightDivider.x, y]}
                              stroke={theme.palette.secondary.dark} strokeWidth={3} listening={false}/>
                    ))}
                    {editor.staves.map(staff => (
                        <StaffRect key={staff.id} staff={staff} interaction={interaction}
                                   selected={selection.isSelected(staff.id)}
                                   y={dragPreview?.id === staff.id ? dragPreview.y : staff.y}
                                   height={dragPreview?.id === staff.id ? dragPreview.height : staff.height}/>
                    ))}
                    {editor.dividers.map((divider, index) => {
                        const isTop = divider === divider.staff.topDivider
                        const preview = dragPreview?.id === divider.staff.id ? dragPreview : null
                        return (
                            <StaffDividerLine key={index} divider={divider} interaction={interaction} scale={scale}
                                              y={preview ? preview.y + (isTop ? 0 : preview.height) : divider.y}/>
                        )
                    })}
                    <VerticalDividerLine divider={page.leftDivider} height={page.height} scale={scale}
                                         editable={interaction.editable}
                                         minX={0} maxX={page.rightDivider.x - 1}
                                         onDragEnd={interaction.moveLeftDivider}/>
                    <VerticalDividerLine divider={page.rightDivider} height={page.height} scale={scale}
                                         editable={interaction.editable}
                                         minX={page.leftDivider.x + 1} maxX={page.width}
                                         onDragEnd={interaction.moveRightDivider}/>
                </Layer>
                    </Stage>
                </Box>
                <Box component="aside" aria-label="Staff instruments" sx={{position: 'relative'}}>
                    {editor.staves.map(staff => <InstrumentTag key={staff.id} staff={staff} interaction={interaction} scale={scale}
                                                       selected={selection.isSelected(staff.id)}
                                                       y={dragPreview?.id === staff.id ? dragPreview.y : staff.y}
                                                       height={dragPreview?.id === staff.id ? dragPreview.height : staff.height}/>)}
                </Box>
            </Box>
            {instrumentForm && (
                <InstrumentForm position={instrumentForm.position} instruments={project.instruments}
                                instrument={'staffId' in instrumentForm ? instrumentForm.instrument : undefined}
                                title={'staffId' in instrumentForm ? 'Edit Instrument' : 'Add Staff'}
                                submitLabel={'staffId' in instrumentForm ? 'Save' : 'Create'}
                                onCancel={interaction.cancelInstrument}
                                onSubmit={interaction.submitInstrument}/>
            )}
            {error && <Alert severity="error">Page {page.number} could not be displayed.</Alert>}
        </>
    )
}
