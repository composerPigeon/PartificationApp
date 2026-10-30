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
import {VerticalDividerLine} from './VerticalDividerLine.tsx'
import {CreateStaffForm} from '../CreateStaffForm.tsx'
import {InstrumentForm} from '../InstrumentForm.tsx'
import type {Instrument} from '../../../domain/Instrument.ts'
import {InstrumentTag} from './InstrumentTag.tsx'
import type {StaffDivider} from '../../../domain/StaffDivider.ts'
import type {Node} from 'konva/lib/Node'
import {recommendInstrument} from '../../../services/projects/recommendInstrument.ts'

function cursorFor(target: Node | null, dragging = false, mode: EditingMode = 'edit-staff') {
    if (target?.hasName('vertical-divider')) return 'ew-resize'
    if (target?.hasName('staff-divider')) return 'ns-resize'
    if (target?.hasName('staff-body')) return dragging ? 'grabbing' : mode === 'select' ? 'pointer' : 'grab'
    return 'default'
}

function modeFor(target: Node | null, dragging = false): EditingMode {
    if (dragging || target?.hasName('staff-divider') || target?.hasName('vertical-divider')) return 'edit-staff'
    return target?.hasName('staff-body') ? 'select' : 'add-staff'
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
    pages: ScorePage[]
    editingMode?: EditingMode
    onModeChange(mode: EditingMode): void
    selectedStaffId: number | null
    onSelectStaff(staffId: number | null): void
    onPageChange(): void
}

export function ScorePageWorkSpace({project, page, pages, editingMode = 'select', onModeChange, selectedStaffId, onSelectStaff, onPageChange}: ScorePageWorkSpaceProps) {
    const projectName = project.projectName
    const stageRef = useRef<KonvaStage>(null)
    const dragTargetRef = useRef<Node | null>(null)
    const [scale, setScale] = useState(800 / page.width)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [error, setError] = useState(false)
    const [hoverCursor, setHoverCursor] = useState({mode: editingMode, value: 'default'})
    const cursor = selectedStaffId !== null ? 'default' : editingMode === 'add-staff' && !error ? 'crosshair'
        : !error && hoverCursor.mode === editingMode ? hoverCursor.value : 'default'
    const editable = !error && selectedStaffId === null
    const [staves, setStaves] = useState(() => [...page.staves.values()])
    const [pendingStaff, setPendingStaff] = useState<{centerY: number, top: number, left: number} | null>(null)
    const [editingInstrument, setEditingInstrument] = useState<{staffId: number, instrument: Instrument, position: {top: number, left: number}} | null>(null)
    const [draggedStaff, setDraggedStaff] = useState<{id: number, y: number, height: number} | null>(null)
    const dragPreview = draggedStaff
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

    const handlePageClick = (event: KonvaEventObject<MouseEvent>) => {
        if (event.evt.button !== 0 || error) return
        if (selectedStaffId !== null) {
            if (event.target.hasName('staff-body')) {
                const staffId = Number(event.target.id())
                onSelectStaff(staffId === selectedStaffId ? null : staffId)
            } else {
                onSelectStaff(null)
            }
            return
        }
        const mode = modeFor(event.target)
        onModeChange(mode)
        if (event.target.hasName('staff-body')) {
            onSelectStaff(Number(event.target.id()))
            return
        }
        if (mode !== 'add-staff') return
        onSelectStaff(null)
        const pointer = stageRef.current?.getRelativePointerPosition()
        if (!pointer) return
        setPendingStaff({centerY: pointer.y, top: event.evt.clientY, left: event.evt.clientX})
    }

    const updateInteraction = (target: Node | null, dragging = false) => {
        if (error || pendingStaff || editingInstrument || selectedStaffId !== null) return
        const mode = modeFor(target, dragging)
        onModeChange(mode)
        setHoverCursor({mode, value: cursorFor(target, dragging, mode)})
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
                   scaleX={scale} scaleY={scale} onClick={handlePageClick}
                   role="region"
                   onMouseMove={event => {
                       updateInteraction(dragTargetRef.current ?? event.target, !!dragTargetRef.current)
                   }}
                   onMouseLeave={() => setHoverCursor({mode: editingMode, value: cursorFor(dragTargetRef.current, !!dragTargetRef.current, editingMode)})}
                   onDragStart={event => {
                       dragTargetRef.current = event.target
                       updateInteraction(event.target, true)
                   }}
                   onDragEnd={() => {
                       dragTargetRef.current = null
                       const stage = stageRef.current!
                       const pointer = stage.getPointerPosition()
                       updateInteraction(pointer ? stage.getIntersection(pointer) : null)
                   }}
                   style={{background: 'white', boxShadow: '0 3px 12px #0003'}}>
                <Layer name="page-image" listening={false}>
                    {image && <PageImage image={image} width={page.width} height={page.height}/>}
                </Layer>
                <Layer name="page-drawings">
                    {staves.map(staff => (
                        <StaffRect key={staff.id} staff={staff}
                                   selected={selectedStaffId === staff.id}
                                   y={dragPreview?.id === staff.id ? dragPreview.y : staff.y}
                                   height={dragPreview?.id === staff.id ? dragPreview.height : staff.height}
                                   editable={editable}
                                   onDrag={y => {
                                       setDraggedStaff({id: staff.id, y, height: staff.height})
                                   }}
                                   onDragEnd={y => {
                                       if (page.moveStaff(staff.id, y)) onPageChange()
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
                                              editable={editable}
                                              onDrag={y => {
                                                  const bounds = resizeBounds(divider, y)
                                                  setDraggedStaff({id: divider.staff.id, ...bounds})
                                                  return bounds.y + (isTop ? 0 : bounds.height)
                                              }}
                                              onDragEnd={y => {
                                                  const bounds = resizeBounds(divider, y)
                                                  if (page.resizeStaff(divider.staff.id, bounds.y, bounds.height)) onPageChange()
                                                  setStaves([...page.staves.values()])
                                                  setDraggedStaff(null)
                                                  return divider.y
                                              }}/>
                        )
                    })}
                    <VerticalDividerLine divider={page.leftDivider} height={page.height} scale={scale}
                                         editable={editable}
                                         minX={0} maxX={page.rightDivider.x - 1}
                                         onDragEnd={n => {
                                             page.moveLeftDivider(n)
                                             setStaves([...page.staves.values()])
                                             onPageChange()
                                         }}/>
                    <VerticalDividerLine divider={page.rightDivider} height={page.height} scale={scale}
                                         editable={editable}
                                         minX={page.leftDivider.x + 1} maxX={page.width}
                                         onDragEnd={n => {
                                             page.moveRightDivider(n)
                                             setStaves([...page.staves.values()])
                                             onPageChange()
                                         }}/>
                </Layer>
                    </Stage>
                </Box>
                <Box component="aside" aria-label="Staff instruments" sx={{position: 'relative'}}>
                    {staves.map(staff => <InstrumentTag key={staff.id} staff={staff} scale={scale}
                                                       selected={selectedStaffId === staff.id}
                                                       y={dragPreview?.id === staff.id ? dragPreview.y : staff.y}
                                                       onEdit={position => {
                                                           onSelectStaff(staff.id)
                                                           onModeChange('select')
                                                           setEditingInstrument({staffId: staff.id, instrument: staff.instrument, position})
                                                       }}
                                                       height={dragPreview?.id === staff.id ? dragPreview.height : staff.height}/>)}
                </Box>
            </Box>
            {pendingStaff && editingMode === 'add-staff' && (
                <CreateStaffForm position={{top: pendingStaff.top, left: pendingStaff.left}}
                                 instruments={project.instruments}
                                 instrument={recommendInstrument(project, pages, page, pendingStaff.centerY)}
                                 page={page} centerY={pendingStaff.centerY}
                                 onCancel={() => setPendingStaff(null)}
                                 onCreate={(height, instrumentName, shortcut) => {
                                     const instrument = project.getOrCreateInstrument(instrumentName, shortcut)
                                     page.createStaff(pendingStaff.centerY, height, instrument)
                                     onPageChange()
                                     setStaves([...page.staves.values()])
                                     setPendingStaff(null)
                                 }}/>
            )}
            {editingInstrument && (
                <InstrumentForm position={editingInstrument.position} instruments={project.instruments}
                                instrument={recommendInstrument(project, pages, page, page.getStaff(editingInstrument.staffId)!.y)
                                    ?? editingInstrument.instrument}
                                onCancel={() => setEditingInstrument(null)}
                                onSubmit={(instrumentName, shortcut) => {
                                    if (!page.getStaff(editingInstrument.staffId)) return
                                    const instrument = project.getOrCreateInstrument(instrumentName, shortcut)
                                    page.changeInstrumentForStaff(editingInstrument.staffId, instrument)
                                    onPageChange()
                                    setStaves([...page.staves.values()])
                                    setEditingInstrument(null)
                                }}/>
            )}
            {error && <Alert severity="error">Page {page.number} could not be displayed.</Alert>}
        </>
    )
}
