import {useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, Container, Stack} from '@mui/material'
import {useProject, useProjectSave} from '../../hooks/project';
import {usePaging} from '../../hooks';
import {ScorePageWorkSpace} from '../../components/projects/drawing/ScorePageWorkSpace.tsx'
import {ProjectPage} from '../../components/projects/ProjectPage';
import {ToolBar} from '../../components/projects/ToolBar';
import {useEditingMode, useStaffSelection, useScorePageEditor} from '../../hooks/scorePage';
import {UnsavedChangesDialog} from '../../components/projects/UnsavedChangesDialog.tsx';

export default function ProjectWorkspacePage() {
    const {userId, projectName} = useParams({from: '/$userId/$projectName'})
    const projectState = useProject()
    const paging = usePaging(projectState.pages.length)
    const saveState = useProjectSave(projectState.project, projectState.pages)

    const navigate = useNavigate()
    const currentPage = projectState.pages[paging.pageIndex]
    const selection = useStaffSelection(currentPage)
    const editing = useEditingMode(selection)
    const editor = useScorePageEditor(projectState, paging, saveState)

    async function goToExportProject() {
        if (await saveState.save()) {
            void navigate({to: '/$userId/$projectName/export', params: {userId, projectName}})
        }
    }

    return (
        <ProjectPage title="Workspace" projectTitle={projectState.project.projectName ?? 'Project'} pagination={paging}>
            <UnsavedChangesDialog hasChanges={saveState.hasChanges}/>
            <Box sx={{flex: 1, bgcolor: 'background.default', py: 1, px: {xs: '64px', sm: '88px'}}}>
                {!currentPage && <ToolBar editing={editing} editor={editor} disabled
                                          saveState={saveState} onExport={goToExportProject}/>}
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
                                                  projectState={projectState} page={currentPage} editor={editor} editing={editing} selection={selection}
                                                  saveState={saveState} onExport={goToExportProject}/>
                            </Box>
                        ) : null}
                    </Stack>
                </Container>
            </Box>
        </ProjectPage>
    )
}
