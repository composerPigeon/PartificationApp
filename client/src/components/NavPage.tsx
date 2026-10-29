import {Box} from '@mui/material';
import type {PropsWithChildren} from 'react';
import MainNavBar from './MainNavBar.tsx';

type NavPageProps = Required<PropsWithChildren<{ title: string }>> & { hideProfile?: boolean };

export default function NavPage({children, title, hideProfile}: NavPageProps) {
    return (
        <Box sx={{minHeight: '100svh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default'}}>
            <MainNavBar title={title} hideProfile={hideProfile}/>
            <Box component="main" sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                {children}
            </Box>
        </Box>
    );
}
