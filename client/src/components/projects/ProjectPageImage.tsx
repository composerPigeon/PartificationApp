import {useLayoutEffect, useRef, useState} from 'react'
import {Alert, Box, Button} from '@mui/material'
import type {ProjectPage} from '../../domain'

export function ProjectPageImage({projectName, page}: { projectName: string, page: ProjectPage }) {
    const imageRef = useRef<HTMLImageElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [attempt, setAttempt] = useState(0)
    const aspectRatio = page.width > 0 && page.height > 0 ? `${page.width} / ${page.height}` : '1 / 1.4142'

    useLayoutEffect(() => {
        const objectUrl = URL.createObjectURL(page.blob)
        if (imageRef.current) imageRef.current.src = objectUrl

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [page.blob, attempt])

    if (error) return (
        <Alert severity="error" action={<Button color="inherit" onClick={() => {
            setError(null)
            setAttempt(value => value + 1)
        }}>Retry</Button>}>{error}</Alert>
    )
    return (
        <Box component="img" ref={imageRef} alt={`${projectName}, page ${page.number}`}
             width={page.width > 0 ? page.width : undefined} height={page.height > 0 ? page.height : undefined}
             onError={() => setError(`Page ${page.number} is not a readable PNG image.`)}
             sx={{
                 display: 'block',
                 width: '800px',
                 maxWidth: '100%',
                 height: 'auto',
                 aspectRatio,
                 alignSelf: 'flex-start',
                 objectFit: 'contain',
                 bgcolor: 'white',
                 boxShadow: 3
             }}/>
    )
}
