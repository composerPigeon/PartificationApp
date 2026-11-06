/* eslint-disable react-hooks/immutability -- editing.mode is a React-backed accessor that invokes setMode. */
import {ButtonIcon} from '../buttons/ButtonIcon'
import {Divider, Paper} from '@mui/material'
import {ToolActionButton} from '../buttons/ToolActionButton'
import {ToolButton} from '../buttons/ToolButton'
import type {EditingModeState} from '../../hooks/scorePage';

interface ExportToolBarProps {
    onBack(): void
    editing: EditingModeState
    hasSelectedInstruments: boolean
    generating: boolean
    onPreview(): void
    hasPreview: boolean
    onPrint(): void
}

export function ExportToolBar({onBack, editing, hasSelectedInstruments, generating, onPreview, hasPreview, onPrint}: ExportToolBarProps) {
    return (
        <Paper component="aside" aria-label="Export tools" elevation={5}
               sx={{
                   position: 'fixed', left: {xs: 8, sm: 16}, top: '50%', transform: 'translateY(-50%)',
                   width: {xs: 40, sm: 56}, display: 'flex', flexDirection: 'column',
                   alignItems: 'center', gap: 1, py: 1, borderRadius: 3, zIndex: 10,
               }}>
            <ToolButton label="Select" selected={editing.mode === 'select'}
                        onSelect={() => { editing.mode = 'select'; }}
                        icon={<ButtonIcon name="select"/>}/>
            <Divider sx={{width: '70%', borderColor: 'primary.main', borderBottomWidth: 2, my: 0.5}}/>
            <ToolActionButton label="Back to workspace" onClick={onBack}
                              icon={<ButtonIcon name="back"/>}/>
            <ToolActionButton label={generating ? 'Generating preview…' : 'Preview'} disabled={!hasSelectedInstruments || generating} onClick={onPreview}
                              icon={<ButtonIcon name="preview"/>}/>
            <ToolActionButton label="Print" disabled={!hasPreview || generating} onClick={onPrint}
                              icon={<ButtonIcon name="print"/>}/>
        </Paper>
    )
}
