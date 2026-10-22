import {ButtonIcon} from '../../components/buttons/ButtonIcon'
import {useEffect, useState} from 'react'
import {
    Alert, Box, Button, CircularProgress, Container,
    Paper, Stack, Typography,
} from '@mui/material'
import {projectManager} from '../../services'
import type {Project} from '../../domain/Project.ts'
import NavPage from '../../components/NavPage'
import {FloatButton} from '../../components/buttons/FloatButton'
import ProjectCard from '../../components/projects/ProjectCard'

function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [attempt, setAttempt] = useState(0)
    const [deletingIds, setDeletingIds] = useState<string[]>([])
    const [deleteError, setDeleteError] = useState<string | null>(null)

    async function deleteProject(project: Project) {
        setDeleteError(null)
        setDeletingIds(ids => [...ids, project.id])
        try {
            await projectManager.deleteProject(project.id)
            setProjects(current => current.filter(item => item.id !== project.id))
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Unable to delete project.')
        } finally {
            setDeletingIds(ids => ids.filter(id => id !== project.id))
        }
    }

    useEffect(() => {
        let active = true

        async function load() {
            try {
                const loaded = await projectManager.loadProjects()
                if (active) {
                    setProjects(loaded)
                }
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : 'Unable to load projects.')
            } finally {
                if (active) setIsLoading(false)
            }
        }

        void load()
        return () => {
            active = false
        }
    }, [attempt])

    function retry() {
        setError(null)
        setIsLoading(true)
        setAttempt(value => value + 1)
    }

    return (
        <NavPage title="Projects">
            <Container maxWidth="md" sx={{pt: {xs: 4, sm: 8}, pb: 'calc(112px + env(safe-area-inset-bottom, 0px))'}}>
                <Stack spacing={3}>
                    {deleteError && <Alert severity="error" onClose={() => setDeleteError(null)}>{deleteError}</Alert>}
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
            <FloatButton to="/projects/new" icon aria-label="Create project">
                <ButtonIcon name="add" aria-hidden="true"/>
            </FloatButton>
        </NavPage>
    )
}

export default ProjectsPage
