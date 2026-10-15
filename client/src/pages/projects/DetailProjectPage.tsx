import {Link, useLocation, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, CircularProgress, Container, Paper, Stack, SvgIcon} from '@mui/material'
import {useState} from 'react'
import {useProjectDetail} from '../../hooks/useProjectDetail.ts'
import {ProjectPageImage} from '../../components/projects/ProjectPageImage.tsx'
import type {Project} from "../../domain";
import NavPage from '../../components/NavPage';
import {PageNavigation} from '../../components/projects/PageNavigation';
import {ToolButton} from '../../components/buttons/ToolButton';

type EditingMode = 'select' | 'add-stave' | 'edit-stave'

function StaveClef() {
    return (
        <g transform="translate(-2.1 -0.8) scale(1.35 1.08)">
            <path d="M6.7 14.8c-3.8-1-3.5-4.8-.7-7.5 2.4-2.3 2.4-4.7 1-5.3-1.7 1-1.5 3.8-.9 6.6l1.7 9.6c.5 3-2.8 3.7-3.6 1.4M5.5 13.5c-1.3-1.7.1-3.6 1.7-3.1 2.9.8 2.4 4.9-.5 4.4"
                  fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    )
}

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
                <Paper component="aside" aria-label="Project tools" elevation={5}
                       sx={{
                           position: 'fixed',
                           left: {xs: 8, sm: 16},
                           top: '50%',
                           transform: 'translateY(-50%)',
                           width: {xs: 40, sm: 56},
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           gap: 1,
                           py: 1,
                           borderRadius: 3,
                           zIndex: 10
                       }}>
                    <ToolButton label="Select" selected={editingMode === 'select'}
                                onSelect={() => setEditingMode('select')} disabled={toolsDisabled}
                                icon={<SvgIcon><path d="M5 3v17l4.5-4.5 3.3 6 2.6-1.5-3.3-5.7H19L5 3z"/></SvgIcon>}/>
                    <ToolButton label="Add stave" selected={editingMode === 'add-stave'}
                                onSelect={() => setEditingMode('add-stave')} disabled={toolsDisabled}
                                icon={<SvgIcon viewBox="0 0 24 24" fill="none">
                                    <path d="M3 5h18M3 8h18M3 11h12M3 14h11M3 17h11M19 13v8M15 17h8"
                                          fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                    <StaveClef/>
                                </SvgIcon>}/>
                    <ToolButton label="Edit stave" selected={editingMode === 'edit-stave'}
                                onSelect={() => setEditingMode('edit-stave')} disabled={toolsDisabled}
                                icon={<SvgIcon viewBox="0 0 24 24">
                                    <path d="M3 5h18M3 8h14M3 11h11M3 14h8M3 17h6"
                                          fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                    <StaveClef/>
                                    <path d="m11 17 8-8 3 3-8 8-4 1 1-4Zm6-6 3 3"
                                          fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                                </SvgIcon>}/>
                </Paper>
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
                                     cursor: editingMode === 'add-stave' ? 'crosshair' : editingMode === 'edit-stave' ? 'cell' : 'default'}}>
                                <ProjectPageImage key={`${project.id}:${currentPage.number}`}
                                                  projectName={project.projectName} page={currentPage}/>
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
