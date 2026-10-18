// @refresh reset
import {useLayoutEffect, useRef, useState} from 'react'
import {Alert, Box} from '@mui/material'
import {Image as PageImage, Layer, Stage} from 'react-konva'
import type {KonvaEventObject} from 'konva/lib/Node'
import type {Stage as KonvaStage} from 'konva/lib/Stage'
import type {Project, ScorePage} from '../../../domain'
import type {EditingMode} from '../ToolBar.tsx'
import {StaffRect} from './StaffRect.tsx'
import {StaffDividerLine} from './StaffDividerLine.tsx'
import {CreateStaffForm} from '../CreateStaffForm.tsx'
import {Instrument} from '../../../domain/Instrument.ts'
import {InstrumentTag} from './InstrumentTag.tsx'
import type {StaffDivider} from '../../../domain/StaffDivider.ts'
import type {Node} from 'konva/lib/Node'

function cursorFor(target: Node | null, dragging = false) {
    if (target?.hasName('staff-divider')) return 'ns-resize'
    if (target?.hasName('staff-body')) return dragging ? 'grabbing' : 'grab'
    return 'default'
}

function resizeBounds(divider: StaffDivider, y: number) {
    const staff = divider.staff
    const top = divider === staff.topDivider ? Math.min(y, staff.y + staff.height - 1) : staff.y
    const bottom = divider === staff.bottomDivider ? Math.max(y, staff.y + 1) : staff.y + staff.height
    return {y: top, height: bottom - top}
}

interface ScorePageWorkSpaceProps {
    project: Project
    page: ScorePage
    editingMode?: EditingMode
}

export function ScorePageWorkSpace({project, page, editingMode = 'select'}: ScorePageWorkSpaceProps) {
    const projectName = project.projectName
    const stageRef = useRef<KonvaStage>(null)
    const dragTargetRef = useRef<Node | null>(null)
    const [scale, setScale] = useState(800 / page.width)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [error, setError] = useState(false)
    const [hoverCursor, setHoverCursor] = useState({mode: editingMode, value: 'default'})
    const cursor = editingMode === 'add-staff' && !error ? 'crosshair'
        : editingMode === 'edit-staff' && !error && hoverCursor.mode === editingMode ? hoverCursor.value : 'default'
    const [staves, setStaves] = useState(() => [...page.staves.values()])
    const [pendingStaff, setPendingStaff] = useState<{centerY: number, top: number, left: number} | null>(null)
    const [draggedStaff, setDraggedStaff] = useState<{id: number, y: number, height: number} | null>(null)
    const dragPreview = editingMode === 'edit-staff' ? draggedStaff : null
    const dividers = [...new Set(staves.flatMap(staff => [staff.topDivider, staff.bottomDivider]))]

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
    }, [page, projectName])

    const addStaff = (event: KonvaEventObject<MouseEvent>) => {
        if (editingMode !== 'add-staff' || event.evt.button !== 0 || error) return
        const pointer = stageRef.current?.getRelativePointerPosition()
        if (!pointer) return
        setPendingStaff({centerY: pointer.y, top: event.evt.clientY, left: event.evt.clientX})
    }

    return (
        <>
            <Box sx={{width: '100%', maxWidth: 1104, display: 'grid', gridTemplateColumns: 'clamp(64px, 12vw, 144px) minmax(0, 800px) clamp(64px, 12vw, 144px)', gap: 1}}>
                <Box sx={{
                    minWidth: 0,
                    gridColumn: 2,
                    cursor,
                    '& .konvajs-content, & canvas': {cursor: 'inherit'},
                }}>
                    <Stage ref={stageRef} width={page.width * scale} height={page.height * scale}
                   scaleX={scale} scaleY={scale} onClick={addStaff}
                   role="region"
                   onMouseMove={event => {
                       setHoverCursor({mode: editingMode, value: cursorFor(dragTargetRef.current ?? event.target, !!dragTargetRef.current)})
                   }}
                   onMouseLeave={() => setHoverCursor({mode: editingMode, value: cursorFor(dragTargetRef.current, !!dragTargetRef.current)})}
                   onDragStart={event => {
                       dragTargetRef.current = event.target
                       setHoverCursor({mode: editingMode, value: cursorFor(event.target, true)})
                   }}
                   onDragEnd={() => {
                       dragTargetRef.current = null
                       const stage = stageRef.current!
                       const pointer = stage.getPointerPosition()
                       setHoverCursor({mode: editingMode, value: cursorFor(pointer ? stage.getIntersection(pointer) : null)})
                   }}
                   style={{background: 'white', boxShadow: '0 3px 12px #0003'}}>
                <Layer name="page-image" listening={false}>
                    {image && <PageImage image={image} width={page.width} height={page.height}/>}
                </Layer>
                <Layer name="page-drawings">
                    {staves.map(staff => (
                        <StaffRect key={staff.id} staff={staff}
                                   y={dragPreview?.id === staff.id ? dragPreview.y : staff.y}
                                   height={dragPreview?.id === staff.id ? dragPreview.height : staff.height}
                                   editable={editingMode === 'edit-staff' && !error}
                                   onDrag={y => {
                                       setDraggedStaff({id: staff.id, y, height: staff.height})
                                   }}
                                   onDragEnd={y => {
                                       page.moveStaff(staff.id, y)
                                       setStaves([...page.staves.values()])
                                       setDraggedStaff(null)
                                       return staff.y
                                   }}/>
                    ))}
                    {dividers.map((divider, index) => {
                        const isTop = divider === divider.staff.topDivider
                        const preview = dragPreview?.id === divider.staff.id ? dragPreview : null
                        return (
                            <StaffDividerLine key={index} divider={divider} scale={scale}
                                              y={preview ? preview.y + (isTop ? 0 : preview.height) : divider.y}
                                              editable={editingMode === 'edit-staff' && !error}
                                              onDrag={y => {
                                                  const bounds = resizeBounds(divider, y)
                                                  setDraggedStaff({id: divider.staff.id, ...bounds})
                                                  return bounds.y + (isTop ? 0 : bounds.height)
                                              }}
                                              onDragEnd={y => {
                                                  const bounds = resizeBounds(divider, y)
                                                  page.resizeStaff(divider.staff.id, bounds.y, bounds.height)
                                                  setStaves([...page.staves.values()])
                                                  setDraggedStaff(null)
                                                  return divider.y
                                              }}/>
                        )
                    })}
                </Layer>
                    </Stage>
                </Box>
                <Box component="aside" aria-label="Staff instruments" sx={{position: 'relative'}}>
                    {staves.map(staff => <InstrumentTag key={staff.id} staff={staff} scale={scale}
                                                       y={dragPreview?.id === staff.id ? dragPreview.y : staff.y}
                                                       height={dragPreview?.id === staff.id ? dragPreview.height : staff.height}/>)}
                </Box>
            </Box>
            {pendingStaff && editingMode === 'add-staff' && (
                <CreateStaffForm position={{top: pendingStaff.top, left: pendingStaff.left}}
                                 instruments={project.instruments}
                                 page={page} centerY={pendingStaff.centerY}
                                 onCancel={() => setPendingStaff(null)}
                                 onCreate={(height, instrumentName, shortcut) => {
                                     const instrument = project.getInstrument(instrumentName) ?? new Instrument(instrumentName, shortcut)
                                     page.createStaff(pendingStaff.centerY, height, instrument)
                                     project.addInstrument(instrument)
                                     setStaves([...page.staves.values()])
                                     setPendingStaff(null)
                                 }}/>
            )}
            {error && <Alert severity="error">Page {page.number} could not be displayed.</Alert>}
        </>
    )
}
