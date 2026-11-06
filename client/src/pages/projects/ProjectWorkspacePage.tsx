import {useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, Container, Stack} from '@mui/material'
import {useProject, useProjectSave} from '../../hooks/project';
import {usePaging} from '../../hooks';
import {ScorePageWorkSpace} from '../../components/projects/drawing/ScorePageWorkSpace.tsx'
import {ProjectPage} from '../../components/projects/ProjectPage';
import {ToolBar} from '../../components/projects/ToolBar';
import {useEditingMode, useStaffSelection} from '../../hooks/scorePage';
import {UnsavedChangesDialog} from '../../components/projects/UnsavedChangesDialog.tsx';

export default function ProjectWorkspacePage() {
    const {userId, projectName} = useParams({from: '/$userId/$projectName'})
    const projectState = useProject()
    const paging = usePaging(projectState.pages.length)
    const saveState = useProjectSave(projectState.project, projectState.pages)

    const navigate = useNavigate()
    const currentPage = projectState.pages[paging.pageIndex]
    const selection = useStaffSelection(currentPage)
    const editing = useEditingMode()

    const toolsDisabled = !currentPage

    return (
        <ProjectPage title="Workspace" projectTitle={projectState.project.projectName ?? 'Project'} pagination={paging}>
            <UnsavedChangesDialog hasChanges={saveState.hasChanges}/>
            <Box sx={{flex: 1, bgcolor: 'background.default', py: 1, px: {xs: '64px', sm: '88px'}}}>
                <ToolBar editing={editing} selection={selection} disabled={toolsDisabled}
                         saveState={saveState}
                         onExport={async () => {
                             if (await saveState.save()) {
                                 void navigate({to: '/$userId/$projectName/export', params: {userId, projectName}})
                             }
                         }}/>
                <Container maxWidth="lg" disableGutters>
                    <Stack spacing={3}>
                        {saveState.error && (
                            <Alert severity="error" action={<Button color="inherit" onClick={() => { void saveState.save(); }}
                                                                    disabled={saveState.saving}>Retry save</Button>}>
                                {saveState.error}
                            </Alert>
                        )}
                        {currentPage ? (
                            <Box component="section" aria-label="Project page viewer"
                                 data-editing-mode={editing.mode}
                                 sx={{display: 'flex', justifyContent: 'center', pb: 2}}>
                                <ScorePageWorkSpace key={`${projectState.project.id}:${currentPage.number}`}
                                                  projectState={projectState} page={currentPage} saveState={saveState} editing={editing}
                                                  selection={selection}/>
                            </Box>
                        ) : null}
                    </Stack>
                </Container>
            </Box>
        </ProjectPage>
    )
}
