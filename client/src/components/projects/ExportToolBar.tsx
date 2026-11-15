import {useBrowserPreview, useExportPreview, useGoToWorkspace} from '../../hooks/project/export';
import {ButtonIcon} from '../buttons/ButtonIcon'
import {Divider, Paper} from '@mui/material'
import {ToolActionButton} from '../buttons/ToolActionButton'
import {ToolButton} from '../buttons/ToolButton'

export function ExportToolBar() {
    const onBack = useGoToWorkspace();
    const {generating} = useExportPreview();
    const {available, open} = useBrowserPreview();
    return (
        <Paper component="aside" aria-label="Export tools" elevation={5}
               sx={{
                   position: 'fixed', left: {xs: 8, sm: 16}, top: '50%', transform: 'translateY(-50%)',
                   width: {xs: 40, sm: 56}, display: 'flex', flexDirection: 'column',
                   alignItems: 'center', gap: 1, py: 1, borderRadius: 3, zIndex: 10,
               }}>
            <ToolButton label="Select" selected
                        onSelect={() => {}}
                        icon={<ButtonIcon name="select"/>}/>
            <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
            <ToolActionButton label="Back to workspace" onClick={onBack}
                              icon={<ButtonIcon name="back"/>}/>
            <ToolActionButton label={generating ? 'Generating preview…' : 'Browser preview'} disabled={!available || generating} onClick={open}
                              icon={<ButtonIcon name="preview"/>}/>
        </Paper>
    )
}
