import {alpha, AppBar, Box, IconButton, Toolbar, Typography} from '@mui/material';
import {Link, useMatches} from '@tanstack/react-router';
import {AppIcon} from './AppIcon';
import {ButtonIcon} from './buttons/ButtonIcon';
import ProfileMenu from './ProfileMenu';

interface MainNavBarProps {
    title: string;
    hideProfile?: boolean;
}

export default function MainNavBar({title, hideProfile = false}: MainNavBarProps) {
    const readOnlyProfile = useMatches({select: matches => matches.some(match => match.routeId === '/projects/new')});

    return (
        <AppBar position="static" color="inherit" elevation={1} sx={theme => ({
            bgcolor: 'background.paper',
            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
        })}>
            <Toolbar sx={{display: 'grid', gridTemplateColumns: 'minmax(96px, 1fr) minmax(0, 2fr) minmax(96px, 1fr)', gap: {xs: 1, sm: 2}}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Link to="/projects" aria-label="Partification projects" style={{display: 'flex'}}>
                        <AppIcon color="primary" sx={{width: 40, height: 40}}/>
                    </Link>
                    <IconButton aria-label="Settings" title="Settings" color="primary" size="large">
                        <ButtonIcon name="settings" aria-hidden="true" fontSize="large"/>
                    </IconButton>
                </Box>
                <Typography component="div" variant="h6" align="center" noWrap title={title} sx={{
                    color: 'primary.main', fontWeight: 800, fontSize: {xs: '1.125rem', sm: '1.5rem'},
                    minWidth: 0, py: 1, letterSpacing: '-0.025em', lineHeight: 1.2,
                }}>
                    {title}
                </Typography>
                <Box sx={{justifySelf: 'end'}}>
                    {!hideProfile && <ProfileMenu readOnly={readOnlyProfile}/>}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
