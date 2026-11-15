/* eslint-disable react-hooks/immutability -- interactionMode.mode delegates to React state setters. */
import {useGoToExport} from '../../hooks/project/workspace/useGoToExport';
import {ButtonIcon} from '../buttons/ButtonIcon'
import {Divider, Paper} from '@mui/material'
import {ToolButton} from '../buttons/ToolButton'
import {ToolActionButton} from '../buttons/ToolActionButton'

import {useInteractionMode, useScorePageDomain} from '../../hooks/project/workspace/scorePage';
import {useWorkspaceSave, usePermissions} from '../../hooks/project/workspace';

export function ToolBar() {
    const permissions = usePermissions();
    const onExport = useGoToExport();
    const interactionMode = useInteractionMode();
    const domain = useScorePageDomain();
    const saveState = useWorkspaceSave();
    return (
        <Paper component="aside" aria-label="Project tools" elevation={5}
               sx={{
                   position: 'fixed',
                   left: {xs: 8, sm: 16},
                   top: '50%',
                   transform: 'translateY(-50%)',
                   width: {xs: 40, sm: 56},
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   gap: 1,
                   py: 1,
                   borderRadius: 3,
                   zIndex: 10
               }}>
            <ToolButton label="Select" selected={interactionMode.mode === 'select'}
                        onSelect={() => { interactionMode.mode = 'select'; }} disabled={!permissions.canChangeTool}
                        icon={<ButtonIcon name="select"/>}/>
            <ToolButton label="Add staff" selected={interactionMode.mode === 'add-staff'}
                        onSelect={() => { interactionMode.mode = 'add-staff'; }} disabled={!permissions.canChangeTool}
                        icon={<ButtonIcon name="add-staff" viewBox="0 0 24 24" fill="none"/>}/>
            <ToolButton label="Edit staff" selected={interactionMode.mode === 'edit-staff'}
                        onSelect={() => { interactionMode.mode = 'edit-staff'; }} disabled={!permissions.canChangeTool}
                        icon={<ButtonIcon name="edit-staff" viewBox="0 0 24 24"/>}/>
            <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
            <ToolActionButton label="Copy staves layout to the next page" disabled={!permissions.canChangeTool || !domain.canCopyStavesLayout}
                              onClick={() => { domain.copyStavesLayoutToNextPage(); }}
                              icon={<ButtonIcon name="copy-staves"/>}/>
            <ToolActionButton label="Export" disabled={permissions.canvasError || saveState.saving} onClick={onExport}
                              icon={<ButtonIcon name="export" viewBox="0 0 24 24"/>}/>
        </Paper>
    )
}
