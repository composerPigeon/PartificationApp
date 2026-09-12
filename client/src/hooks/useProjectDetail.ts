import { useEffect, useState } from 'react'
import { projectManager } from '../projects/ProjectManager'
import type { Project } from '../projects/Project'

export function useProjectDetail(projectId: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const directory = await projectManager.restoreDirectory()
        if (!directory?.granted) throw new Error('Choose a project folder or renew access on the login page.')
        const loaded = await projectManager.loadProject(projectId)
        if (active) setProject(loaded)
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : 'Unable to load project.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [projectId, attempt])

  function retry() {
    setLoading(true)
    setError(null)
    setAttempt(value => value + 1)
  }

  const pageCount = project?.images.length ?? 0
  function previous() { setPageIndex(index => Math.max(0, index - 1)) }
  function next() { setPageIndex(index => Math.min(Math.max(0, pageCount - 1), index + 1)) }

  return { project, error, loading, retry, pageIndex, pageCount, previous, next }
}
