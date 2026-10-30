import {useAuth} from './auth/useAuth'
import {useEffect, useRef, useState} from 'react'
import {projectManager} from '../services'
import type {Project, ScorePage} from '../domain'

export function useProjectDetail(project: Project) {
    const {currentAccount} = useAuth()
    const userId = currentAccount?.userId
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [attempt, setAttempt] = useState(0)
    const [pages, setPages] = useState<ScorePage[]>([])
    const [pageIndex, setPageIndex] = useState(0)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const savePending = useRef(false)
    const hasUnsavedPages = () => pages.some(page => page.isChanged)
    const hasChanges = saving || hasUnsavedPages()

    function pageChanged() {
        setPages(current => [...current])
        void save()
    }

    async function save() {
        if (savePending.current || loading || error || !hasUnsavedPages()) return
        savePending.current = true
        setSaving(true)
        setSaveError(null)
        try {
            while (hasUnsavedPages()) {
                await projectManager.saveProject(project, pages)
            }
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Unable to save project.')
        } finally {
            savePending.current = false
            setSaving(false)
            setPages(current => [...current])
        }
    }

    useEffect(() => {
        let active = true

        async function load() {
            setPages([])
            setPageIndex(0)
            setError(null)
            setSaveError(null)
            setLoading(true)
            try {
                const loadedPages = await projectManager.loadPages(project)
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
    }, [project, attempt, userId])

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

    return {pages, error, loading, retry, pageIndex, pageCount, previous, next, hasChanges, saving, saveError, save, pageChanged}
}
