import {useId, useState} from 'react';
import {
    alpha, Avatar, Box, Button, Divider, ListItemText, ListSubheader,
    Menu, MenuItem, SvgIcon, Tooltip, Typography,
} from '@mui/material';
import {Link, useNavigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/auth/useAuth';

function initials(userName: string): string {
    const parts = userName.trim().split(/[\s._-]+/).filter(Boolean);
    return (parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`
        : parts[0]?.slice(0, 2) ?? '?').toUpperCase();
}

export default function ProfileMenu({readOnly = false}: {readOnly?: boolean}) {
    const {currentAccount, accounts, setCurrent} = useAuth();
    const navigate = useNavigate();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const id = useId();
    const open = Boolean(anchor);
    const userName = currentAccount?.userName ?? 'Guest';
    const avatar = <Avatar component="span" aria-hidden={readOnly ? undefined : true}
                           role={readOnly ? 'img' : undefined}
                           aria-label={readOnly ? `Current account: ${userName}` : undefined}
                           sx={theme => ({
                               width: 34, height: 34, fontSize: '0.8rem', fontWeight: 800,
                               background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                           })}>{initials(userName)}</Avatar>;

    if (readOnly) return <Tooltip title={userName}>{avatar}</Tooltip>;

    function close() {
        setAnchor(null);
    }

    function selectAccount(userId: string) {
        setCurrent(userId);
        close();
        void navigate({to: '/projects'});
    }

    return (
        <>
            <Button id={`${id}-button`} variant="outlined" color="primary"
                    aria-label={`Profile: ${userName}`} aria-haspopup="menu"
                    aria-controls={open ? id : undefined} aria-expanded={open ? 'true' : undefined}
                    onClick={event => setAnchor(event.currentTarget)}
                    sx={theme => ({
                        minWidth: 0, gap: 1, p: 0.5, pr: {xs: 0.5, sm: 1.25}, borderRadius: 8,
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        '&:hover': {bgcolor: alpha(theme.palette.primary.main, 0.08)},
                    })}>
                {avatar}
                <Box component="span" sx={{display: {xs: 'none', sm: 'inline'}, fontWeight: 700}}>Profile</Box>
                <SvgIcon aria-hidden="true" sx={{display: {xs: 'none', sm: 'block'}, fontSize: 18,
                    transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 150ms'}}>
                    <path d="m7 10 5 5 5-5z"/>
                </SvgIcon>
            </Button>
            <Menu id={id} anchorEl={anchor} open={open} onClose={close}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'right'}}
                  slotProps={{
                      list: {'aria-labelledby': `${id}-button`, sx: {py: 0.75}},
                      paper: {sx: theme => ({
                          mt: 1, width: 288, maxWidth: 'calc(100vw - 24px)', borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                          boxShadow: `0 12px 36px ${alpha(theme.palette.primary.dark, 0.16)}`,
                      })},
                  }}>
                <ListSubheader disableSticky sx={theme => ({
                    px: 2, py: 1.25, mb: 0.75, lineHeight: 1.5,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                })}>
                    <Typography variant="overline" sx={{fontWeight: 800, color: 'primary.main'}}>Your accounts</Typography>
                    <Typography variant="body2" noWrap sx={{color: 'text.primary', fontWeight: 600}}>{userName}</Typography>
                </ListSubheader>
                {accounts.map(account => {
                    const selected = account.userId === currentAccount?.userId;
                    return (
                        <MenuItem key={account.userId} selected={selected} onClick={() => selectAccount(account.userId)}
                                  sx={{mx: 0.75, my: 0.25, px: 1.25, py: 1, gap: 1.25, borderRadius: 2}}>
                            <Avatar aria-hidden="true" sx={{width: 34, height: 34, fontSize: '0.75rem', fontWeight: 700,
                                bgcolor: selected ? 'primary.main' : 'secondary.light', color: 'common.white'}}>
                                {initials(account.userName)}
                            </Avatar>
                            <ListItemText primary={account.userName}
                                          secondary={account.isAuthenticated ? 'Signed in' : 'Local workspace'}
                                          slotProps={{primary: {noWrap: true, sx: {fontWeight: 600}}, secondary: {sx: {fontSize: '0.75rem'}}}}/>
                            {selected && <Typography variant="caption" sx={{color: 'primary.main', fontWeight: 700}}>Current</Typography>}
                        </MenuItem>
                    );
                })}
                <Divider sx={{my: 1}}/>
                <MenuItem component={Link} to="/login" onClick={close}
                          sx={theme => ({
                              mx: 1.25, mb: 0.75, px: 1.75, py: 1.5, gap: 1.25, borderRadius: 2,
                              color: theme.palette.primary.contrastText, fontWeight: 800,
                              background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.22)}`,
                              transition: theme.transitions.create(['box-shadow', 'background-position']),
                              backgroundSize: '150% 100%',
                              '&:hover, &.Mui-focusVisible': {
                                  backgroundPosition: '100% 0',
                                  boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.32)}`,
                              },
                              '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
                          })}>
                    <SvgIcon aria-hidden="true" sx={{fontSize: 21}}>
                        <path d="M10 17l5-5-5-5v3H2v4h8v3zm9-14h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                    </SvgIcon>
                    Login
                </MenuItem>
            </Menu>
        </>
    );
}
