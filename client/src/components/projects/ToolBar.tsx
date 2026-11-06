/* eslint-disable react-hooks/immutability -- editing.mode is a React-backed accessor that invokes setMode. */
import {ButtonIcon} from '../buttons/ButtonIcon'
import {Divider, Paper} from '@mui/material'
import {ToolButton} from '../buttons/ToolButton'
import {ToolActionButton} from '../buttons/ToolActionButton'

import type {EditingModeState, StaffSelectionState} from '../../hooks/scorePage';
import type {ProjectSaveState} from '../../hooks/project';

interface ToolBarProps {
    editing: EditingModeState
    selection: StaffSelectionState
    disabled?: boolean
    saveState: ProjectSaveState
    onExport(): void
}

export function ToolBar({editing, selection, disabled = false, saveState, onExport}: ToolBarProps) {
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
            <ToolButton label="Select" selected={editing.mode === 'select'}
                        onSelect={() => { selection.clear(); editing.mode = 'select'; }} disabled={disabled}
                        icon={<ButtonIcon name="select"/>}/>
            <ToolButton label="Add staff" selected={editing.mode === 'add-staff'}
                        onSelect={() => { selection.clear(); editing.mode = 'add-staff'; }} disabled={disabled || editing.locked}
                        icon={<ButtonIcon name="add-staff" viewBox="0 0 24 24" fill="none"/>}/>
            <ToolButton label="Edit staff" selected={editing.mode === 'edit-staff'}
                        onSelect={() => { selection.clear(); editing.mode = 'edit-staff'; }} disabled={disabled || editing.locked}
                        icon={<ButtonIcon name="edit-staff" viewBox="0 0 24 24"/>}/>
            <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
            <ToolActionButton label="Export" disabled={disabled || saveState.saving} onClick={onExport}
                              icon={<ButtonIcon name="export" viewBox="0 0 24 24"/>}/>
        </Paper>
    )
}
