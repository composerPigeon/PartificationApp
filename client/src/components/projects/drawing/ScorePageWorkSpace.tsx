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

interface ScorePageWorkSpaceProps {
    project: Project
    page: ScorePage
    editingMode?: EditingMode
}

export function ScorePageWorkSpace({project, page, editingMode = 'select'}: ScorePageWorkSpaceProps) {
    const projectName = project.projectName
    const stageRef = useRef<KonvaStage>(null)
    const [scale, setScale] = useState(800 / page.width)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [error, setError] = useState(false)
    const [staves, setStaves] = useState(() => [...page.staves.values()])
    const [pendingStaff, setPendingStaff] = useState<{centerY: number, top: number, left: number} | null>(null)
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
                <Box sx={{minWidth: 0, gridColumn: 2}}>
                    <Stage ref={stageRef} width={page.width * scale} height={page.height * scale}
                   scaleX={scale} scaleY={scale} onClick={addStaff}
                   role="region"
                   style={{background: 'white', boxShadow: '0 3px 12px #0003', cursor: editingMode === 'add-staff' ? 'crosshair' : 'default'}}>
                <Layer name="page-image" listening={false}>
                    {image && <PageImage image={image} width={page.width} height={page.height}/>}
                </Layer>
                <Layer name="page-drawings">
                    {staves.map(staff => <StaffRect key={staff.id} staff={staff}/>)}
                    {dividers.map((divider, index) => <StaffDividerLine key={index} divider={divider}/>)}
                </Layer>
                    </Stage>
                </Box>
                <Box component="aside" aria-label="Staff instruments" sx={{position: 'relative'}}>
                    {staves.map(staff => <InstrumentTag key={staff.id} staff={staff} scale={scale}/>)}
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
