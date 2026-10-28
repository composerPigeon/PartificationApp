import {Link, useLocation, useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, CircularProgress, Container, Stack, Typography} from '@mui/material'
import {useEffect, useRef, useState} from 'react'
import NavPage from '../../components/NavPage'
import {ExportToolBar} from '../../components/projects/ExportToolBar.tsx'
import {InstrumentsBar} from '../../components/projects/InstrumentsBar.tsx'
import {Project} from '../../domain/Project.ts'
import {ProjectPage} from '../../components/projects/ProjectPage.tsx'
import {ExportPdfViewer} from '../../components/projects/ExportPdfViewer.tsx'
import {exportPdfService} from '../../services'

function ProjectExport({project: snapshot}: {project: Project}) {
    const [project] = useState(() => Project.fromSnapshot(snapshot))
    const [editingMode, setEditingMode] = useState<'select'>('select')
    const [selectedInstrumentIds, setSelectedInstrumentIds] = useState<Set<string>>(() => new Set())
    const navigate = useNavigate()
    const [previewPdf, setPreviewPdf] = useState<Blob | null>(null)
    const previewUrlRef = useRef<string | null>(null)
    const [pageIndex, setPageIndex] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!previewPdf) return
        const url = URL.createObjectURL(previewPdf)
        previewUrlRef.current = url
        return () => {
            URL.revokeObjectURL(url)
            previewUrlRef.current = null
        }
    }, [previewPdf])

    function printPreview() {
        if (generating || !previewPdf || !previewUrlRef.current) return
        window.open(previewUrlRef.current, '_blank', 'noopener,noreferrer')
    }

    async function createPreview() {
        if (generating || !selectedInstrumentIds.size) return
        setGenerating(true)
        setError(null)
        setPreviewPdf(null)
        setPageIndex(0)
        setPageCount(0)
        try {
            const instruments = project.instruments.filter(instrument => selectedInstrumentIds.has(instrument.id))
            setPreviewPdf(await exportPdfService.createPdf(project, instruments))
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to generate PDF preview.')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <ProjectPage title="Export" projectTitle={project.projectName} previewInsets={{
            left: {xs: '240px', sm: '312px', md: '352px'},
            right: {xs: '8px', sm: '24px'},
        }} pagination={{
            pageIndex, pageCount,
            onPrevious: () => setPageIndex(index => Math.max(0, index - 1)),
            onNext: () => setPageIndex(index => Math.min(pageCount - 1, index + 1)),
        }}>
            <Box sx={{flex: 1, py: 2, pl: {xs: '240px', sm: '312px', md: '352px'}, pr: {xs: 1, sm: 3}}}>
                <ExportToolBar editingMode={editingMode} onModeChange={setEditingMode}
                               generating={generating} onPreview={createPreview}
                               hasPreview={!!previewPdf} onPrint={printPreview}
                               hasSelectedInstruments={selectedInstrumentIds.size > 0} onBack={() => {
                    void navigate({to: '/projects/$projectId', params: {projectId: project.id}, state: {project}})
                }}/>
                <InstrumentsBar instruments={project.instruments} selectedIds={selectedInstrumentIds} disabled={generating}
                                onToggle={(id, selected) => {
                                    setPreviewPdf(null)
                                    setPageCount(0)
                                    setPageIndex(0)
                                    setError(null)
                                    setSelectedInstrumentIds(current => {
                                    const next = new Set(current)
                                    if (selected) next.add(id)
                                    else next.delete(id)
                                    return next
                                    })
                                }}/>
                <Container maxWidth="xl" disableGutters>
                        <Box component="section" aria-label="Export PDF viewer"
                             data-editing-mode={editingMode}
                             sx={{minWidth: 0, minHeight: 'calc(100svh - 120px)', bgcolor: 'action.hover',
                                 border: '1px solid', borderColor: 'divider', borderRadius: 3,
                                 display: 'grid', placeItems: 'center', p: 3}}>
                            {generating ? (
                                <Stack spacing={2} sx={{alignItems: 'center'}}>
                                    <CircularProgress aria-label="Generating PDF preview"/>
                                    <Typography variant="body2">Building your score…</Typography>
                                </Stack>
                            ) : error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : previewPdf ? (
                                <ExportPdfViewer pdf={previewPdf} pageIndex={pageIndex} onPageCount={setPageCount}/>
                            ) : (
                                <Typography variant="body2" sx={{color: 'text.secondary'}}>Select instruments and click Preview.</Typography>
                            )}
                        </Box>
                </Container>
            </Box>
        </ProjectPage>
    )
}

export default function ProjectExportPage() {
    const {projectId} = useParams({from: '/projects/$projectId/export'})
    const project = useLocation({select: location => location.state.project})

    if (!project || project.id !== projectId) {
        return (
            <NavPage title="Export">
                <Alert severity="error" action={<Button component={Link} to="/projects" color="inherit">Projects</Button>}>
                    Project data is unavailable.
                </Alert>
            </NavPage>
        )
    }

    return <ProjectExport key={projectId} project={project}/>
}
