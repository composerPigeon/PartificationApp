import {Divider, Paper, SvgIcon} from '@mui/material'
import {ToolActionButton} from '../buttons/ToolActionButton'
import {ToolButton} from '../buttons/ToolButton'

interface ExportToolBarProps {
    onBack(): void
    editingMode: 'select'
    onModeChange(mode: 'select'): void
    hasSelectedInstruments: boolean
    generating: boolean
    onPreview(): void
}

export function ExportToolBar({onBack, editingMode, onModeChange, hasSelectedInstruments, generating, onPreview}: ExportToolBarProps) {
    return (
        <Paper component="aside" aria-label="Export tools" elevation={5}
               sx={{
                   position: 'fixed', left: {xs: 8, sm: 16}, top: '50%', transform: 'translateY(-50%)',
                   width: {xs: 40, sm: 56}, display: 'flex', flexDirection: 'column',
                   alignItems: 'center', gap: 1, py: 1, borderRadius: 3, zIndex: 10,
               }}>
            <ToolButton label="Select" selected={editingMode === 'select'}
                        onSelect={() => onModeChange('select')}
                        icon={<SvgIcon><path d="M5 3v17l4.5-4.5 3.3 6 2.6-1.5-3.3-5.7H19L5 3z"/></SvgIcon>}/>
            <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
            <ToolActionButton label="Back to workspace" onClick={onBack}
                              icon={<SvgIcon>
                                  <path d="m10 5-7 7 7 7M3 12h18" fill="none" stroke="currentColor"
                                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </SvgIcon>}/>
            <ToolActionButton label={generating ? 'Generating preview…' : 'Preview'} disabled={!hasSelectedInstruments || generating} onClick={onPreview}
                              icon={<SvgIcon>
                                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                                        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                                  <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                              </SvgIcon>}/>
            <ToolActionButton label="Print" disabled
                              icon={<SvgIcon>
                                  <path d="M7 8V3h10v5M7 17H3v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7h-4M7 14h10v7H7v-7Zm10-3h1"
                                        fill="none" stroke="currentColor" strokeWidth="1.8"
                                        strokeLinecap="round" strokeLinejoin="round"/>
                              </SvgIcon>}/>
        </Paper>
    )
}
