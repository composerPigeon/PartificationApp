import {Link, useBlocker, useLoaderData, useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, CircularProgress, Container, Stack} from '@mui/material'
import {useState} from 'react'
import {useProjectDetail} from '../../hooks/useProjectDetail.ts'
import {ScorePageWorkSpace} from '../../components/projects/drawing/ScorePageWorkSpace.tsx'
import {Project} from "../../domain";
import {ProjectPage} from '../../components/projects/ProjectPage';
import {ToolBar} from '../../components/projects/ToolBar';
import type {EditingMode} from '../../components/projects/ToolBar';
import {UnsavedChangesDialog} from '../../components/projects/UnsavedChangesDialog.tsx'

function ProjectDetail({project: snapshot}: {project: Project}) {
    const {userId, projectName} = useParams({from: '/$userId/$projectName'})
    const [project] = useState(() => Project.fromSnapshot(snapshot))
    const model = useProjectDetail(project)
    const navigate = useNavigate()
    const currentPage = model.pages[model.pageIndex]
    const [editingMode, setEditingMode] = useState<EditingMode>('select')
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null)
    const changeMode = (mode: EditingMode) => {
        if (selectedStaffId !== null && mode !== 'select') return
        setEditingMode(mode)
    }
    const toolsDisabled = model.loading || !!model.error || !currentPage
    const blocker = useBlocker({
        shouldBlockFn: ({current, next}) => model.hasChanges && current.pathname !== next.pathname,
        enableBeforeUnload: model.hasChanges,
        disabled: !model.hasChanges,
        withResolver: true,
    })

    return (
        <ProjectPage title="Workspace" projectTitle={project.projectName ?? 'Project'} pagination={{
            pageIndex: model.pageIndex,
            pageCount: !model.loading && !model.error && currentPage ? model.pageCount : 0,
            onPrevious: () => { setSelectedStaffId(null); model.previous() },
            onNext: () => { setSelectedStaffId(null); model.next() },
        }}>
            <UnsavedChangesDialog open={blocker.status === 'blocked'}
                                  onStay={() => blocker.reset?.()}
                                  onLeave={() => blocker.proceed?.()}/>
            <Box sx={{flex: 1, bgcolor: 'background.default', py: 1, px: {xs: '64px', sm: '88px'}}}>
                <ToolBar editingMode={editingMode} onModeChange={changeMode} disabled={toolsDisabled}
                         modeLocked={selectedStaffId !== null}
                         hasChanges={model.hasChanges} saving={model.saving} onSave={model.save}
                         onExport={() => {
                             void navigate({to: '/$userId/$projectName/export', params: {userId, projectName}, state: {project}})
                         }}/>
                <Container maxWidth="lg" disableGutters>
                    <Stack spacing={3}>
                        {model.saveError && (
                            <Alert severity="error" action={<Button color="inherit" onClick={model.save}
                                                                    disabled={model.saving}>Retry save</Button>}>
                                {model.saveError}
                            </Alert>
                        )}
                        {model.loading ? (
                            <Box sx={{minHeight: '60svh', display: 'grid', placeItems: 'center'}}>
                                <CircularProgress aria-label="Loading project"/>
                            </Box>
                        ) : model.error ? (
                            <Stack spacing={2}>
                                <Alert severity="error" action={<Button color="inherit"
                                                                        onClick={model.retry}>Retry</Button>}>{model.error}</Alert>
                                <Button component={Link} to="/login">Choose folder / allow access</Button>
                            </Stack>
                        ) : project && currentPage ? (
                            <Box component="section" aria-label="Project page viewer"
                                 data-editing-mode={editingMode}
                                 sx={{display: 'flex', justifyContent: 'center', pb: 2}}>
                                <ScorePageWorkSpace key={`${project.id}:${currentPage.number}`}
                                                  project={project} page={currentPage} editingMode={editingMode}
                                                  onModeChange={changeMode}
                                                  selectedStaffId={selectedStaffId} onSelectStaff={setSelectedStaffId}
                                                  onPageChange={model.pageChanged}/>
                            </Box>
                        ) : null}
                    </Stack>
                </Container>
            </Box>
        </ProjectPage>
    )
}

export default function ProjectWorkspacePage() {
    const {project} = useLoaderData({from: '/$userId/$projectName'})
    return <ProjectDetail key={project.id} project={project} />
}
