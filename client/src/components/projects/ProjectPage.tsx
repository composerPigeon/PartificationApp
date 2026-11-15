import type {PropsWithChildren, ReactNode} from 'react'
import {Box} from '@mui/material'
import {ProjectNavBar} from './ProjectNavBar'
import type {PreviewInsets} from './ProjectNavBar'

type ProjectPageProps = PropsWithChildren<{
    title: string
    projectTitle: string
    navigation?: ReactNode
    previewInsets?: PreviewInsets
}>

export function ProjectPage({title, projectTitle, navigation, previewInsets, children}: ProjectPageProps) {
    return (
        <Box sx={{minHeight: '100svh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default'}}>
            <ProjectNavBar title={projectTitle} navigation={navigation} previewInsets={previewInsets}/>
            <Box component="main" aria-label={title} sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                {children}
            </Box>
        </Box>
    )
}
