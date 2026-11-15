import {useProjects} from '../../hooks/project';
import {ButtonIcon} from '../../components/buttons/ButtonIcon'
import {
    Alert, Box, Button, CircularProgress, Container,
    Paper, Stack, Typography,
} from '@mui/material'
import NavPage from '../../components/NavPage'
import {FloatButton} from '../../components/buttons/FloatButton'
import ProjectCard from '../../components/projects/ProjectCard'

function ProjectsPage() {
    const {projects, error, isLoading, deletingIds, deleteError, deleteProject, retry, clearDeleteError} = useProjects()

    return (
        <NavPage title="Projects">
            <Container maxWidth="md" sx={{pt: {xs: 4, sm: 8}, pb: 'calc(112px + env(safe-area-inset-bottom, 0px))'}}>
                <Stack spacing={3}>
                    {deleteError && <Alert severity="error" onClose={clearDeleteError}>{deleteError}</Alert>}
                    {isLoading ? (
                        <Box sx={{p: 6, display: 'grid', placeItems: 'center'}}>
                            <CircularProgress aria-label="Loading projects"/>
                        </Box>
                    ) : error ? (
                        <Alert severity="error" action={<Button color="inherit" onClick={retry}>Retry</Button>}>
                            {error}
                        </Alert>
                    ) : projects.length === 0 ? (
                        <Paper sx={{p: 4}}>
                            <Typography variant="h6">No projects yet</Typography>
                            <Typography color="text.secondary">There are no saved projects in this folder.</Typography>
                        </Paper>
                    ) : (
                        <Stack component="ul" aria-label="Projects" spacing={2} sx={{listStyle: 'none', m: 0, p: 0}}>
                            {projects.map(project => (
                                <ProjectCard key={project.id} project={project}
                                             deleting={deletingIds.includes(project.id)} onDelete={deleteProject}/>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Container>
            <FloatButton to="/project/new" icon aria-label="Create project">
                <ButtonIcon name="add" aria-hidden="true"/>
            </FloatButton>
        </NavPage>
    )
}

export default ProjectsPage
