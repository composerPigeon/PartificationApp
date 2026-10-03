import {useEffect, useState} from 'react'
import {projectManager} from '../services'
import type {Project, ProjectPage} from '../domain'

export function useProjectDetail(project: Project) {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [attempt, setAttempt] = useState(0)
    const [pages, setPages] = useState<ProjectPage[]>([])
    const [pageIndex, setPageIndex] = useState(0)

    useEffect(() => {
        let active = true

        async function load() {
            try {
                const loadedPages = await projectManager.loadPages(project.id)
                if (active) setPages(loadedPages);
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : 'Unable to load pages.')
            } finally {
                if (active) setLoading(false)
            }
        }

        void load()
        return () => {
            active = false
        }
    }, [project.id, attempt])

    function retry() {
        setLoading(true)
        setError(null)
        setAttempt(value => value + 1)
    }

    const pageCount = project.pageCount

    function previous() {
        setPageIndex(index => Math.max(0, index - 1))
    }

    function next() {
        setPageIndex(index => Math.min(Math.max(0, pageCount - 1), index + 1))
    }

    return {pages, error, loading, retry, pageIndex, pageCount, previous, next}
}
