import {Box, Container, Stack} from '@mui/material'
import {useProject} from '../../hooks/project';
import {useWorkspacePaging} from '../../hooks/workspace';
import {ProjectSaveStatus} from '../../components/projects/ProjectSaveStatus';
import {WorkspaceProvider} from '../../components/projects/WorkspaceProvider';
import {ScorePageWorkSpace} from '../../components/projects/drawing/ScorePageWorkSpace.tsx'
import {WorkspacePageNavigation} from '../../components/projects/PageNavigation';
import {ProjectPage} from '../../components/projects/ProjectPage';
import {WorkspacePageProvider} from '../../components/projects/WorkspacePageProvider';
import {WorkspaceUnsavedChangesDialog} from '../../components/projects/UnsavedChangesDialog.tsx';

export default function ProjectWorkspacePage() {
    return <WorkspaceProvider><WorkspaceContent/></WorkspaceProvider>;
}

function WorkspaceContent() {
    const projectState = useProject()
    const {currentPage} = useWorkspacePaging()

    return (
        <ProjectPage navigation={<WorkspacePageNavigation color="secondary"/>} title="Workspace" projectTitle={projectState.project.projectName ?? 'Project'}>
            <WorkspaceUnsavedChangesDialog/>
            <Box sx={{flex: 1, bgcolor: 'background.default', py: 1, px: {xs: '64px', sm: '88px'}}}>
                <Container maxWidth="lg" disableGutters>
                    <Stack spacing={3}>
                        <ProjectSaveStatus/>
                        {currentPage && (
                            <WorkspacePageProvider page={currentPage}>
                                <Box component="section" aria-label="Project page viewer"
                                     sx={{display: 'flex', justifyContent: 'center', pb: 2}}>
                                    <ScorePageWorkSpace/>
                                </Box>
                            </WorkspacePageProvider>
                        )}
                    </Stack>
                </Container>
            </Box>
        </ProjectPage>
    )
}
