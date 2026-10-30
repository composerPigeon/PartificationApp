import {ButtonIcon} from '../buttons/ButtonIcon'
import {Divider, Paper} from '@mui/material'
import {ToolButton} from '../buttons/ToolButton'
import {ToolActionButton} from '../buttons/ToolActionButton'

export type EditingMode = 'select' | 'add-staff' | 'edit-staff'

interface ToolBarProps {
    editingMode: EditingMode
    onModeChange(mode: EditingMode): void
    disabled?: boolean
    modeLocked?: boolean
    saving: boolean
    onExport(): void
}

export function ToolBar({editingMode, onModeChange, disabled = false, modeLocked = false, saving, onExport}: ToolBarProps) {
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
            <ToolButton label="Select" selected={editingMode === 'select'}
                        onSelect={() => onModeChange('select')} disabled={disabled}
                        icon={<ButtonIcon name="select"/>}/>
            <ToolButton label="Add staff" selected={editingMode === 'add-staff'}
                        onSelect={() => onModeChange('add-staff')} disabled={disabled || modeLocked}
                        icon={<ButtonIcon name="add-staff" viewBox="0 0 24 24" fill="none"/>}/>
            <ToolButton label="Edit staff" selected={editingMode === 'edit-staff'}
                        onSelect={() => onModeChange('edit-staff')} disabled={disabled || modeLocked}
                        icon={<ButtonIcon name="edit-staff" viewBox="0 0 24 24"/>}/>
            <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
            <ToolActionButton label="Export" disabled={disabled || saving} onClick={onExport}
                              icon={<ButtonIcon name="export" viewBox="0 0 24 24"/>}/>
        </Paper>
    )
}
