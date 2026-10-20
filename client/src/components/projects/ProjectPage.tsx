import type {PropsWithChildren} from 'react'
import NavPage from '../NavPage'
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
        <NavPage title={title}>
            <ProjectNavBar title={projectTitle} pagination={pagination} previewInsets={previewInsets}/>
            {children}
        </NavPage>
    )
}
