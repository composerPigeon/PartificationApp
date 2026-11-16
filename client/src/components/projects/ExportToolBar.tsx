/* eslint-disable react-hooks/immutability -- interactionMode.mode delegates to React state setters. */
import {ButtonIcon} from '../buttons/ButtonIcon'
import {Box, Divider, Paper} from '@mui/material'
import {ToolButton} from '../buttons/ToolButton'
import {ExportToolPopup} from './ExportToolPopup';
import {ToolActionButton} from '../buttons/ToolActionButton';
import {useBrowserPreview, useExportPreview, useExportInteractionMode} from '../../hooks/project/export';

export function ExportToolBar() {
    const {generating} = useExportPreview();
    const {available, open} = useBrowserPreview();
    const interactionMode = useExportInteractionMode();
    return (
        <Box sx={{
            position: 'fixed', left: {xs: 8, sm: 16}, top: '50%', transform: 'translateY(-50%)',
            width: {xs: 40, sm: 56}, zIndex: 11,
        }}>
            <ExportToolPopup/>
            <Paper component="aside" aria-label="Export tools" elevation={5}
                   sx={{
                       position: 'relative', width: '100%', display: 'flex', flexDirection: 'column',
                       alignItems: 'center', gap: 1, py: 1, borderRadius: 3, zIndex: 1,
                   }}>
                <ToolButton label="Select" selected={interactionMode.isSelected('select')}
                            onSelect={() => {interactionMode.mode = 'select';}}
                            icon={<ButtonIcon name="select"/>}/>
                <Box sx={{display: 'flex'}}>
                    <ToolButton label="Settings" selected={interactionMode.isSelected('settings')}
                                onSelect={() => {interactionMode.mode = 'settings';}}
                                icon={<ButtonIcon name="settings"/>}/>
                </Box>
                <Box sx={{display: 'flex'}}>
                    <ToolButton label="Exports" selected={interactionMode.isSelected('exports')}
                                onSelect={() => {interactionMode.mode = 'exports';}}
                                icon={<ButtonIcon name="export"/>}/>
                </Box>
                <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
                <ToolActionButton label={generating ? 'Generating preview…' : 'Browser preview'}
                                  disabled={!available || generating} onClick={open}
                                  icon={<ButtonIcon name="preview"/>}/>
            </Paper>
        </Box>
    )
}
