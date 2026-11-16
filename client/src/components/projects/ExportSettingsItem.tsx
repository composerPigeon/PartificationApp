import {Box, Typography} from '@mui/material';
import type {PropsWithChildren, ReactNode} from 'react';

export function ExportSettingsItem({title, action, children}: PropsWithChildren<{title: string; action?: ReactNode}>) {
    return (
        <Box role="group" aria-label={title}
             sx={{display: 'flex', flexDirection: 'column', gap: 1.5,
                 border: 1, borderColor: 'secondary.main', borderRadius: 1.5, p: 1.5}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1}}>
                <Typography variant="subtitle2" sx={{color: 'secondary.main'}}>{title}</Typography>
                {action}
            </Box>
            {children}
        </Box>
    );
}
