import {Box} from '@mui/material';
import type {PropsWithChildren, ReactNode} from 'react';
import NavBar from './NavBar';

type NavPageProps = Required<PropsWithChildren<{ title: string }>> & { navigation?: ReactNode };

export default function NavPage({children, title, navigation}: NavPageProps) {
    return (
        <Box sx={{minHeight: '100svh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default'}}>
            <NavBar title={title} navigation={navigation}/>
            <Box component="main" sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                {children}
            </Box>
        </Box>
    );
}
