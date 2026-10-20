import {alpha, AppBar, Box, Button, IconButton, SvgIcon, Toolbar, Typography, useScrollTrigger} from '@mui/material';
import {Link} from '@tanstack/react-router';
import type {ReactNode} from 'react';

interface NavBarProps {
    title: string;
    navigation?: ReactNode;
}

export default function NavBar({title, navigation}: NavBarProps) {
    const scrolled = useScrollTrigger({disableHysteresis: true, threshold: 24});

    return (
        <AppBar position="sticky" color="inherit" elevation={scrolled ? 4 : 1}
                sx={theme => ({
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                    alignSelf: 'center',
                    top: scrolled ? 12 : 0,
                    width: scrolled ? 'calc(100% - 24px)' : '100%',
                    borderRadius: scrolled ? '24px' : 0,
                    transition: theme.transitions.create(['top', 'width', 'border-radius', 'box-shadow'], {
                        duration: 240,
                        easing: theme.transitions.easing.easeInOut,
                    }),
                    '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
                })}>
            <Toolbar sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(96px, 1fr) minmax(0, 2fr) minmax(96px, 1fr)',
                gap: {xs: 1, sm: 2}
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifySelf: 'start'}}>
                    <Box component={Link} to="/projects" aria-label="Partification projects"
                         sx={{display: 'inline-flex', alignItems: 'center'}}>
                        <Box component="img" src={`${import.meta.env.BASE_URL}favicon.svg`} alt=""
                             sx={{width: 40, height: 40}}/>
                    </Box>
                    <IconButton type="button" aria-label="Settings" title="Settings"
                                color="primary" size="large">
                        <SvgIcon aria-hidden="true" fontSize="large">
                            <path
                                d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.08-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.07-.73-1.68-.98L14.5 2.42A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.59-1.68.98l-2.49-1a.49.49 0 0 0-.61.22l-2 3.46a.49.49 0 0 0 .12.64l2.11 1.65c-.05.32-.09.66-.09.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.12.22.38.31.61.22l2.49-1c.52.4 1.07.73 1.68.98l.38 2.65c.05.24.25.42.5.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.68-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.1-1.65ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
                        </SvgIcon>
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
                <Button component={Link} to="/login" variant="outlined"
                        sx={{display: {xs: 'none', sm: 'inline-flex'}, justifySelf: 'end', gridColumn: 3, gridRow: 1}}>
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
}
