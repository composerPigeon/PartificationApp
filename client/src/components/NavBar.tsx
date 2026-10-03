import {AppBar, Box, Button, IconButton, SvgIcon, Toolbar, Typography} from '@mui/material';
import {Link} from '@tanstack/react-router';

interface NavBarProps {
    title: string;
}

export default function NavBar({title}: NavBarProps) {
    return (
        <AppBar position="static" color="inherit" elevation={1}>
            <Toolbar sx={{display: 'grid', gridTemplateColumns: 'minmax(96px, 1fr) minmax(0, 2fr) minmax(96px, 1fr)', gap: {xs: 1, sm: 2}}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifySelf: 'start'}}>
                    <Box component={Link} to="/" aria-label="Partification home"
                         sx={{display: 'inline-flex', alignItems: 'center'}}>
                        <Box component="img" src={`${import.meta.env.BASE_URL}favicon.svg`} alt=""
                             sx={{width: 40, height: 40}}/>
                    </Box>
                    <IconButton type="button" aria-label="Settings" title="Settings"
                                color="primary" size="large">
                        <SvgIcon aria-hidden="true" fontSize="large">
                            <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.08-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.07-.73-1.68-.98L14.5 2.42A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.59-1.68.98l-2.49-1a.49.49 0 0 0-.61.22l-2 3.46a.49.49 0 0 0 .12.64l2.11 1.65c-.05.32-.09.66-.09.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.12.22.38.31.61.22l2.49-1c.52.4 1.07.73 1.68.98l.38 2.65c.05.24.25.42.5.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.68-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.1-1.65ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
                        </SvgIcon>
                    </IconButton>
                </Box>
                <Typography component="div" variant="h6" align="center" noWrap title={title}
                            sx={{
                                color: 'primary.main',
                                fontWeight: 800,
                                fontSize: {xs: '1.125rem', sm: '1.5rem'},
                                letterSpacing: '-0.025em',
                                lineHeight: 1.2,
                            }}>
                    {title}
                </Typography>
                <Button component={Link} to="/login" variant="outlined"
                        sx={{display: {xs: 'none', sm: 'inline-flex'}, justifySelf: 'end'}}>
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
}
