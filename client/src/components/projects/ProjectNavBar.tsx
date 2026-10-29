import {alpha, Box, Typography, useScrollTrigger} from '@mui/material';
import {Link} from '@tanstack/react-router';
import {AppIcon} from '../AppIcon';
import ProfileMenu from '../ProfileMenu';
import {PageNavigation, type PageNavigationProps} from './PageNavigation';

export interface PreviewInsets {
    left: {xs: string; sm: string; md?: string};
    right: {xs: string; sm: string; md?: string};
}

interface ProjectNavBarProps {
    title: string;
    pagination: PageNavigationProps;
    previewInsets?: PreviewInsets;
}

export function ProjectNavBar({title, pagination, previewInsets}: ProjectNavBarProps) {
    const scrolled = useScrollTrigger({disableHysteresis: true, threshold: 80});

    return (
        <Box component="section" aria-label="Project navigation" sx={theme => ({
            position: 'sticky', top: scrolled ? 12 : 0, zIndex: theme.zIndex.appBar,
            alignSelf: 'center', width: scrolled ? 'calc(100% - 24px)' : '100%',
            borderRadius: scrolled ? '24px' : 0, boxShadow: scrolled ? 4 : 0,
            transition: theme.transitions.create(['top', 'width', 'border-radius', 'box-shadow'], {duration: 240}),
            '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
            display: 'grid', alignItems: 'center', gap: {xs: 1, sm: 0}, py: 1.5,
            bgcolor: 'background.paper',
            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.08)})`,
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
        })}>
            <Typography component="h1" variant="h6" sx={{
                gridArea: '1 / 1', justifySelf: 'start', mx: 3, minWidth: 0,
                maxWidth: {xs: 'calc(100% - 106px)', sm: 'calc(50% - 120px)'},
                display: 'flex', alignItems: 'center', gap: 1.5,
                color: 'secondary.dark', fontWeight: 800, overflowWrap: 'anywhere',
            }}>
                <Link to="/projects" aria-label="Partification projects" style={{display: 'flex', flexShrink: 0}}>
                    <AppIcon color="secondary" sx={{width: 40, height: 40}}/>
                </Link>
                {title}
            </Typography>
            <Box sx={{
                gridArea: {xs: '2 / 1', sm: '1 / 1'}, minWidth: 0,
                ml: previewInsets?.left ?? 0, mr: previewInsets?.right ?? 0,
                display: 'flex', justifyContent: 'center', pointerEvents: 'none',
                '& > nav': {pointerEvents: 'auto'},
            }}>
                <PageNavigation {...pagination} color="secondary"/>
            </Box>
            <Box sx={{gridArea: '1 / 1', justifySelf: 'end', mx: 3}}>
                <ProfileMenu readOnly/>
            </Box>
        </Box>
    );
}
