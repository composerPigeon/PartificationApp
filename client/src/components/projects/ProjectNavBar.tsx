import {alpha, Box, Typography, useScrollTrigger} from '@mui/material'
import {Link} from '@tanstack/react-router'
import {PageNavigation} from './PageNavigation'
import type {PageNavigationProps} from './PageNavigation'

export interface PreviewInsets {
    left: {xs: string; sm: string; md?: string}
    right: {xs: string; sm: string; md?: string}
}

interface ProjectNavBarProps {
    title: string
    pagination: PageNavigationProps
    previewInsets?: PreviewInsets
}

export function ProjectNavBar({title, pagination, previewInsets}: ProjectNavBarProps) {
    const scrolled = useScrollTrigger({disableHysteresis: true, threshold: 80})
    return (
        <Box component="section" aria-label="Project navigation" sx={theme => ({
            position: 'sticky', top: scrolled ? 12 : 0, zIndex: theme.zIndex.appBar,
            alignSelf: 'center', width: scrolled ? 'calc(100% - 24px)' : '100%',
            borderRadius: scrolled ? '24px' : 0,
            boxShadow: scrolled ? theme.shadows[4] : 'none',
            transition: theme.transitions.create(['top', 'width', 'border-radius', 'box-shadow'], {
                duration: 240, easing: theme.transitions.easing.easeInOut,
            }),
            '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
            display: 'grid', alignItems: 'center', gap: {xs: 1, sm: 0}, py: 1.5,
            bgcolor: 'background.paper',
            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.08)})`,
            borderBottom: '1px solid', borderColor: alpha(theme.palette.secondary.main, 0.2),
        })}>
            <Box sx={{
                gridArea: '1 / 1', justifySelf: 'start', mx: 3,
                maxWidth: {xs: 'calc(100% - 48px)', sm: 'calc(50% - 120px)'},
                display: 'flex', alignItems: 'center', minWidth: 0,
            }}>
                <Box component={Link} to="/projects" aria-label="Partification projects"
                     tabIndex={scrolled ? 0 : -1} aria-hidden={!scrolled}
                     sx={theme => ({
                         display: 'inline-flex', flexShrink: 0, overflow: 'hidden',
                         width: scrolled ? 40 : 0, mr: scrolled ? 1.5 : 0,
                         opacity: scrolled ? 1 : 0, visibility: scrolled ? 'visible' : 'hidden',
                         transition: theme.transitions.create(['width', 'margin-right', 'opacity'], {duration: 240}),
                         '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
                     })}>
                    <Box component="img" src={`${import.meta.env.BASE_URL}favicon.svg`} alt=""
                         sx={{width: 40, height: 40}}/>
                </Box>
            <Typography component="h1" variant="h6" sx={{
                minWidth: 0,
                color: 'secondary.dark', fontWeight: 800, overflowWrap: 'anywhere', textAlign: 'left',
            }}>
                {title}
            </Typography>
            </Box>
            <Box sx={{
                gridArea: {xs: '2 / 1', sm: '1 / 1'}, minWidth: 0,
                ml: previewInsets?.left ?? 0, mr: previewInsets?.right ?? 0,
                display: 'flex', justifyContent: 'center', pointerEvents: 'none',
                '& > nav': {pointerEvents: 'auto'},
            }}>
                <PageNavigation {...pagination} color="secondary"/>
            </Box>
        </Box>
    )
}
