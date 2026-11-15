// @refresh reset
import {useEffectEvent, useLayoutEffect, useRef, useState} from 'react'
import {Alert, Box, useTheme} from '@mui/material'
import {Image as PageImage, Layer, Line, Stage} from 'react-konva'
import {usePermissions, useWorkspacePage} from '../../../hooks/workspace';
import {useProject} from '../../../hooks/project';
import type {Stage as KonvaStage} from 'konva/lib/Stage';
import {useInteractionMode, useStaffSelection, useScorePageDomain, useStaffCreation, useInstrumentEditing} from '../../../hooks/workspace/scorePage';
import {StaffRect} from './StaffRect.tsx'
import {StaffDividerLine} from './StaffDividerLine.tsx'
import {VerticalDividerLine} from './VerticalDividerLine.tsx'
import {InstrumentForm} from '../InstrumentForm.tsx'
import {InstrumentTag} from './InstrumentTag.tsx'
import {ToolBar} from '../ToolBar'

export function ScorePageWorkSpace() {
    const {currentPage: page} = useWorkspacePage()
    const projectState = useProject()
    const domain = useScorePageDomain()
    const interactionMode = useInteractionMode()
    const selection = useStaffSelection()
    const {project} = projectState
    const theme = useTheme()
    const projectName = project.projectName
    const [scale, setScale] = useState(800 / page.width)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const permissions = usePermissions()
    const error = permissions.canvasError
    const stageRef = useRef<KonvaStage>(null)
    const creation = useStaffCreation()
    const {pendingStaff} = creation
    const instrumentEditing = useInstrumentEditing()
    const {instrumentForm} = instrumentEditing

    const reportCanvasError = useEffectEvent(() => permissions.reportCanvasError(page))

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
        source.onerror = () => reportCanvasError()
        source.src = url
        return () => {
            observer.disconnect()
            source.onload = source.onerror = null
            URL.revokeObjectURL(url)
        }
    }, [page, projectName, stageRef])

    return (
        <>
            <ToolBar/>
            <Box sx={{width: '100%', maxWidth: 1104, display: 'grid', gridTemplateColumns: 'clamp(64px, 12vw, 144px) minmax(0, 800px) clamp(64px, 12vw, 144px)', gap: 1}}>
                <Box data-editing-mode={interactionMode.mode} sx={{
                    minWidth: 0,
                    gridColumn: 2,
                    cursor: interactionMode.cursor,
                    '& .konvajs-content, & canvas': {cursor: 'inherit'},
                }}>
                    <Stage ref={stageRef} width={page.width * scale} height={page.height * scale}
                   scaleX={scale} scaleY={scale} role="region"
                   onClick={event => {
                       interactionMode.onClick(event)
                       selection.onClick(event)
                   }}
                   onMouseDown={event => creation.onMouseDown(event)}
                   onMouseUp={event => creation.onMouseUp(event)}
                   onMouseMove={event => {
                       creation.onMouseMove(event)
                       interactionMode.onMouseMove(event)
                   }}
                   onMouseLeave={() => {
                       creation.onMouseLeave()
                       interactionMode.onMouseLeave()
                   }}
                   onDragStart={event => interactionMode.onDragStart(event)}
                   onDragEnd={event => interactionMode.onDragEnd(event)}
                   style={{background: 'white', boxShadow: '0 3px 12px #0003'}}>
                <Layer name="page-image" listening={false}>
                    {image && <PageImage image={image} width={page.width} height={page.height}/>}
                </Layer>
                <Layer name="page-drawings">
                    {pendingStaff && [pendingStaff.startY, pendingStaff.endY].map((y, index) => (
                        <Line key={index} points={[page.leftDivider.x, y, page.rightDivider.x, y]}
                              stroke={theme.palette.secondary.dark} strokeWidth={3} listening={false}/>
                    ))}
                    {domain.staves.map(staff => (
                        <StaffRect key={staff.id} staff={staff}/>
                    ))}
                    {domain.dividers.map((divider, index) => (
                        <StaffDividerLine key={index} divider={divider} scale={scale}/>
                    ))}
                    <VerticalDividerLine divider={page.leftDivider} height={page.height} scale={scale}

                                         minX={0} maxX={page.rightDivider.x - 1}/>
                    <VerticalDividerLine divider={page.rightDivider} height={page.height} scale={scale}

                                         minX={page.leftDivider.x + 1} maxX={page.width}/>
                </Layer>
                    </Stage>
                </Box>
                <Box component="aside" aria-label="Staff instruments" sx={{position: 'relative'}}>
                    {domain.staves.map(staff => <InstrumentTag key={staff.id} staff={staff} scale={scale}/>)}
                </Box>
            </Box>
            {instrumentForm && (
                <InstrumentForm position={instrumentForm.position} instruments={project.instruments}
                                instrument={'staffId' in instrumentForm ? instrumentForm.instrument : undefined}
                                title={'staffId' in instrumentForm ? 'Edit Instrument' : 'Add Staff'}
                                submitLabel={'staffId' in instrumentForm ? 'Save' : 'Create'}
                                valid={permissions.canInteract}
                                onCancel={instrumentEditing.cancelInstrument}
                                onSubmit={instrumentEditing.submitInstrument}/>
            )}
            {error && <Alert severity="error">Page {page.number} could not be displayed.</Alert>}
        </>
    )
}
