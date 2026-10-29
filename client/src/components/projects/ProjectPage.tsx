import type {PropsWithChildren} from 'react'
import {Box} from '@mui/material'
import {ProjectNavBar} from './ProjectNavBar'
import type {PreviewInsets} from './ProjectNavBar'
import type {PageNavigationProps} from './PageNavigation'

type ProjectPageProps = PropsWithChildren<{
    title: string
    projectTitle: string
    pagination: PageNavigationProps
    previewInsets?: PreviewInsets
}>

export function ProjectPage({title, projectTitle, pagination, previewInsets, children}: ProjectPageProps) {
    return (
        <Box sx={{minHeight: '100svh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default'}}>
            <ProjectNavBar title={projectTitle} pagination={pagination} previewInsets={previewInsets}/>
            <Box component="main" aria-label={title} sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                {children}
            </Box>
        </Box>
    )
}
