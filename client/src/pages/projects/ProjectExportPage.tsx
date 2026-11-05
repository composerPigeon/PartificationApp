import {useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, CircularProgress, Container, Stack, Typography} from '@mui/material'
import {useEffect, useRef, useState} from 'react'
import {ExportToolBar} from '../../components/projects/ExportToolBar.tsx'
import {InstrumentsBar} from '../../components/projects/InstrumentsBar.tsx'
import {useProjectState} from '../../hooks/projects/useProjectState.ts'
import {useProjectSave} from '../../hooks/projects/useProjectSave.ts'
import {ProjectPage} from '../../components/projects/ProjectPage.tsx'
import {ExportPdfViewer} from '../../components/projects/ExportPdfViewer.tsx'
import {exportPdfService} from '../../services'
import {usePaging} from '../../hooks/usePaging.ts'
import {UnsavedChangesDialog} from '../../components/projects/UnsavedChangesDialog.tsx';

export default function ProjectExportPage() {
    const {userId, projectName} = useParams({from: '/$userId/$projectName/export'})
    const projectState = useProjectState()
    const saveState = useProjectSave(projectState.project, projectState.pages)
    const {project} = projectState
    const [editingMode, setEditingMode] = useState<'select'>('select')
    const [selectedInstrumentIds, setSelectedInstrumentIds] = useState<Set<string>>(() => new Set())
    const navigate = useNavigate()
    const [previewPdf, setPreviewPdf] = useState<Blob | null>(null)
    const previewUrlRef = useRef<string | null>(null)
    const paging = usePaging()
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
        paging.reset()
        paging.pageCount = 0
        try {
            if (!await saveState.save()) throw new Error('Save the project successfully before exporting.');
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
        }} pagination={paging}>
            <UnsavedChangesDialog hasChanges={saveState.hasChanges}/>
            <Box sx={{flex: 1, py: 2, pl: {xs: '240px', sm: '312px', md: '352px'}, pr: {xs: 1, sm: 3}}}>
                <ExportToolBar editingMode={editingMode} onModeChange={setEditingMode}
                               generating={generating} onPreview={createPreview}
                               hasPreview={!!previewPdf} onPrint={printPreview}
                               hasSelectedInstruments={selectedInstrumentIds.size > 0} onBack={() => {
                    void navigate({to: '/$userId/$projectName', params: {userId, projectName}})
                }}/>
                <InstrumentsBar instruments={project.instruments} selectedIds={selectedInstrumentIds} disabled={generating}
                                onToggle={(id, selected) => {
                                    setPreviewPdf(null)
                                    paging.pageCount = 0
                                    paging.reset()
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
                                <ExportPdfViewer pdf={previewPdf} paging={paging}/>
                            ) : (
                                <Typography variant="body2" sx={{color: 'text.secondary'}}>Select instruments and click Preview.</Typography>
                            )}
                        </Box>
                </Container>
            </Box>
        </ProjectPage>
    )
}
