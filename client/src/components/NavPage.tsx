import {Box} from '@mui/material';
import type {PropsWithChildren} from 'react';
import NavBar from './NavBar';

type NavPageProps = Required<PropsWithChildren<{title: string}>>;

export default function NavPage({children, title}: NavPageProps) {
    return (
        <Box sx={{minHeight: '100svh', display: 'flex', flexDirection: 'column'}}>
            <NavBar title={title}/>
            <Box component="main" sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                {children}
            </Box>
        </Box>
    );
}
