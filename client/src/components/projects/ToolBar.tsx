import {Divider, Paper, SvgIcon} from '@mui/material'
import {ToolButton} from '../buttons/ToolButton'
import {ToolActionButton} from '../buttons/ToolActionButton'

export type EditingMode = 'select' | 'add-staff' | 'edit-staff'

function StaffClef() {
    return (
        <g transform="translate(-2.1 -0.8) scale(1.35 1.08)">
            <path d="M6.7 14.8c-3.8-1-3.5-4.8-.7-7.5 2.4-2.3 2.4-4.7 1-5.3-1.7 1-1.5 3.8-.9 6.6l1.7 9.6c.5 3-2.8 3.7-3.6 1.4M5.5 13.5c-1.3-1.7.1-3.6 1.7-3.1 2.9.8 2.4 4.9-.5 4.4"
                  fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    )
}

interface ToolBarProps {
    editingMode: EditingMode
    onModeChange(mode: EditingMode): void
    disabled?: boolean
    hasChanges: boolean
    saving: boolean
    onSave(): void
    onCombinePrint(): void
}

export function ToolBar({editingMode, onModeChange, disabled = false, hasChanges, saving, onSave, onCombinePrint}: ToolBarProps) {
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
                        icon={<SvgIcon><path d="M5 3v17l4.5-4.5 3.3 6 2.6-1.5-3.3-5.7H19L5 3z"/></SvgIcon>}/>
            <ToolButton label="Add staff" selected={editingMode === 'add-staff'}
                        onSelect={() => onModeChange('add-staff')} disabled={disabled}
                        icon={<SvgIcon viewBox="0 0 24 24" fill="none">
                            <path d="M3 5h18M3 8h18M3 11h11M3 14h8M3 17h7"
                                  fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            <StaffClef/>
                            <path d="M18.5 13.5v8M14.5 17.5h8"
                                  fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                        </SvgIcon>}/>
            <ToolButton label="Edit staff" selected={editingMode === 'edit-staff'}
                        onSelect={() => onModeChange('edit-staff')} disabled={disabled}
                        icon={<SvgIcon viewBox="0 0 24 24">
                            <path d="M3 5h18M3 8h14M3 11h11M3 14h8M3 17h6"
                                  fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            <StaffClef/>
                            <path d="m11 17 8-8 3 3-8 8-4 1 1-4Zm6-6 3 3"
                                  fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                        </SvgIcon>}/>
            <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
            <ToolActionButton label="Combine & Print" disabled={disabled || saving} onClick={onCombinePrint}
                              icon={<SvgIcon viewBox="0 0 24 24">
                                  <path d="M3 5h18M3 8h18M3 11h10M3 14h8M3 17h8"
                                        fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                  <StaffClef/>
                                  <path d="M15 14v-3h6v3M15 20h-2v-5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5h-2M15 18h6v5h-6v-5Zm6-2h.1M17 20.5h2"
                                        fill="none" stroke="currentColor" strokeWidth="1.3"
                                        strokeLinecap="round" strokeLinejoin="round"/>
                              </SvgIcon>}/>
            <ToolActionButton label={saving ? 'Saving…' : 'Save'} disabled={disabled || saving || !hasChanges} onClick={onSave}
                              icon={<SvgIcon>
                                  <path d="M4 3h13l4 4v14H3V3h1Zm3 0v6h10V3M7 21v-8h10v8"
                                        fill="none" stroke="currentColor" strokeWidth="1.8"
                                        strokeLinecap="round" strokeLinejoin="round"/>
                              </SvgIcon>}/>
        </Paper>
    )
}
