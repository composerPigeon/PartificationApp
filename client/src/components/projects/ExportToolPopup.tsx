import {Box, Divider, Paper, Typography} from '@mui/material';
import {ButtonIcon} from '../buttons/ButtonIcon';
import {useExportInteractionMode} from '../../hooks/project/export';

export function ExportToolPopup() {
    const {mode} = useExportInteractionMode();
    if (mode === 'select') return null;

    return (
        <Paper component="aside" aria-labelledby="export-tool-popup-title" elevation={5}
               sx={{
                   position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                   width: {xs: 'calc(min(280px, 24vw) + 40px)', sm: 'calc(min(280px, 24vw) + 56px)'},
                   minWidth: 0, minHeight: '100%',
                   maxHeight: 'calc(100svh - 160px)', display: 'flex', flexDirection: 'column',
                   overflow: 'hidden', zIndex: 0, borderRadius: 3,
                   py: {xs: 1.5, sm: 2}, pr: {xs: 1.5, sm: 2},
                   pl: {xs: '52px', sm: '72px'}, gap: 1.5,
               }}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main'}}>
                <ButtonIcon name={mode === 'settings' ? 'settings' : 'export'} fontSize="small"/>
                <Typography id="export-tool-popup-title" component="h2" variant="subtitle1"
                            sx={{fontWeight: 800}}>
                    {mode === 'settings' ? 'Settings' : 'Exports'}
                </Typography>
            </Box>
            <Divider/>
            <Box sx={{flex: 1, minHeight: 0, display: 'grid', alignContent: 'center', overflowY: 'auto', py: 1}}>
                <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center'}}>
                    {mode === 'settings' ? 'No export settings available yet.' : 'No export options available yet.'}
                </Typography>
            </Box>
        </Paper>
    );
}
