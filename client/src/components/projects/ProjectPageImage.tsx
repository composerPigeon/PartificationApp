import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress } from '@mui/material'
import { projectManager } from '../../projects/ProjectManager'
import type { ProjectImage } from '../../projects/Project'

export function ProjectPageImage({ projectId, image, projectName }: {
  projectId: string; image: ProjectImage; projectName: string;
}) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    let objectUrl: string | undefined
    projectManager.loadPage(projectId, image)
      .then(blob => {
        if (!active) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => {
        if (active) setError(`Unable to load page ${image.pageNumber}. Check that its PNG file is still in the project folder.`)
      })
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [projectId, image, attempt])

  if (error) return (
    <Alert severity="error" action={<Button color="inherit" onClick={() => {
      setError(null)
      setUrl(null)
      setAttempt(value => value + 1)
    }}>Retry</Button>}>{error}</Alert>
  )
  if (!url) return <CircularProgress aria-label={`Loading page ${image.pageNumber}`} />
  return (
    <Box component="img" src={url} alt={`${projectName}, page ${image.pageNumber}`}
      onError={() => setError(`Page ${image.pageNumber} is not a readable PNG image.`)}
      sx={{ display: 'block', maxWidth: '100%', maxHeight: 'calc(100svh - 260px)', objectFit: 'contain', bgcolor: 'white', boxShadow: 3 }} />
  )
}
