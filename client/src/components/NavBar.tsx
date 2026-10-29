import {ButtonIcon} from './buttons/ButtonIcon'
import {alpha, AppBar, Box, Button, IconButton, Toolbar, Typography} from '@mui/material';
import {Link} from '@tanstack/react-router';
import type {ReactNode} from 'react';
import {AppIcon} from './AppIcon';
import {useAuth} from '../hooks/auth/useAuth';

interface NavBarProps {
    title: string;
    navigation?: ReactNode;
}

export default function NavBar({title, navigation}: NavBarProps) {
    const {isAuthenticated} = useAuth();
    return (
        <AppBar position="static" color="inherit" elevation={1}
                sx={theme => ({
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                    alignSelf: 'center',
                })}>
            <Toolbar sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(96px, 1fr) minmax(0, 2fr) minmax(96px, 1fr)',
                gap: {xs: 1, sm: 2}
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifySelf: 'start'}}>
                    <Box component={Link} to="/projects" aria-label="Partification projects"
                         sx={{display: 'inline-flex', alignItems: 'center'}}>
                        <AppIcon color="primary" sx={{width: 40, height: 40}}/>
                    </Box>
                    <IconButton type="button" aria-label="Settings" title="Settings"
                                color="primary" size="large">
                        <ButtonIcon name="settings" aria-hidden="true" fontSize="large"/>
                    </IconButton>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    justifySelf: 'center',
                    width: '100%',
                    minWidth: 0,
                    gap: 0.75,
                    py: navigation ? 1.5 : 1,
                    gridColumn: navigation ? {xs: '1 / -1', sm: '2'} : undefined,
                    gridRow: navigation ? {xs: 2, sm: 1} : undefined,
                }}>
                    <Typography component="div" variant="h6" align="center" noWrap title={title}
                                sx={{
                                    minWidth: 0, maxWidth: '100%',
                                    color: 'primary.main',
                                    fontWeight: 800,
                                    fontSize: {xs: '1.125rem', sm: '1.5rem'},
                                    letterSpacing: '-0.025em',
                                    lineHeight: 1.2,
                                }}>
                        {title}
                    </Typography>
                    {navigation}
                </Box>
                {!isAuthenticated && <Button component={Link} to="/login" variant="outlined" color="secondary"
                        sx={{display: {xs: 'none', sm: 'inline-flex'}, justifySelf: 'end', gridColumn: 3, gridRow: 1}}>
                    Login
                </Button>}
            </Toolbar>
        </AppBar>
    );
}
