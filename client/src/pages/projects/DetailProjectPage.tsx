import {Link, useLocation, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, CircularProgress, Container, Stack} from '@mui/material'
import {useState} from 'react'
import {useProjectDetail} from '../../hooks/useProjectDetail.ts'
import {ProjectPageWorkSpace} from '../../components/projects/drawing/ProjectPageWorkSpace.tsx'
import type {Project} from "../../domain";
import NavPage from '../../components/NavPage';
import {PageNavigation} from '../../components/projects/PageNavigation';
import {ToolBar} from '../../components/projects/ToolBar';
import type {EditingMode} from '../../components/projects/ToolBar';

function ProjectDetail(project: Project) {
    const model = useProjectDetail(project)
    const currentPage = model.pages[model.pageIndex]
    const [editingMode, setEditingMode] = useState<EditingMode>('select')
    const toolsDisabled = model.loading || !!model.error || !currentPage

    return (
        <NavPage title={project.projectName ?? 'Project'} navigation={
                                                              !model.loading && !model.error && currentPage ? (
                                                                  <PageNavigation pageIndex={model.pageIndex}
                                                                                  pageCount={model.pageCount}
                                                                                  onPrevious={model.previous}
                                                                                  onNext={model.next}/>
                                                              ) : undefined
                                                          }>
            <Box sx={{flex: 1, bgcolor: 'background.default', py: 1, pl: {xs: '64px', sm: '88px'}, pr: {xs: 1, sm: 3}}}>
                <ToolBar editingMode={editingMode} onModeChange={setEditingMode} disabled={toolsDisabled}/>
                <Container maxWidth="lg" disableGutters>
                    <Stack spacing={3}>
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
                                 sx={{display: 'flex', justifyContent: 'center', pb: 2,
                                     cursor: editingMode === 'add-staff' ? 'crosshair' : editingMode === 'edit-staff' ? 'cell' : 'default'}}>
                                <ProjectPageWorkSpace key={`${project.id}:${currentPage.number}`}
                                                  projectName={project.projectName} page={currentPage} editingMode={editingMode}/>
                            </Box>
                        ) : null}
                    </Stack>
                </Container>
            </Box>
        </NavPage>
    )
}

export default function DetailProjectPage() {
    const {projectId} = useParams({from: '/projects/$projectId'})
    const project = useLocation({
        select: location => location.state.project,
    })

    if (!project || project.id !== projectId) {
        return (
            <NavPage title="Project">
                <Alert severity="error">Project data is unavailable.</Alert>
            </NavPage>
        );
    }

    return <ProjectDetail key={projectId} {...project} />
}
