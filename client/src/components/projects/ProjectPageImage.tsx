import {useEffect, useState} from 'react'
import {Alert, Box, Button, CircularProgress} from '@mui/material'
import type {ProjectPage} from '../../domain'

export function ProjectPageImage({projectName, page}: { projectName: string, page: ProjectPage }) {
    const [url, setUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let objectUrl = URL.createObjectURL(page.blob)
        setUrl(objectUrl)

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [url, attempt])

    if (error) return (
        <Alert severity="error" action={<Button color="inherit" onClick={() => {
            setError(null)
            setUrl(null)
            setAttempt(value => value + 1)
        }}>Retry</Button>}>{error}</Alert>
    )
    if (!url) return <CircularProgress aria-label={`Loading page ${page.number}`}/>
    return (
        <Box component="img" src={url} alt={`${projectName}, page ${page.number}`}
             onError={() => setError(`Page ${page.number} is not a readable PNG image.`)}
             sx={{
                 display: 'block',
                 maxWidth: '100%',
                 maxHeight: 'calc(100svh - 260px)',
                 objectFit: 'contain',
                 bgcolor: 'white',
                 boxShadow: 3
             }}/>
    )
}
