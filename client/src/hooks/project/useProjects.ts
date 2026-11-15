import {useEffect, useState} from 'react';
import {useAuthState} from '../auth';
import {projectManager} from '../../services';
import type {Project} from '../../domain';

export function useProjects() {
    const {currentAccount} = useAuthState()
    const userId = currentAccount?.userId
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
            setProjects([])
            setError(null)
            setDeleteError(null)
            setIsLoading(true)
            try {
                const loaded = await projectManager.loadProjects()
                if (active) {
                    setProjects(loaded)
                }
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : 'Unable to load project.')
            } finally {
                if (active) setIsLoading(false)
            }
        }

        void load()
        return () => {
            active = false
        }
    }, [attempt, userId])

    function retry() {
        setError(null)
        setIsLoading(true)
        setAttempt(value => value + 1)
    }

    return {projects, error, isLoading, deletingIds, deleteError, deleteProject, retry,
        clearDeleteError() { setDeleteError(null); },
    };
}
