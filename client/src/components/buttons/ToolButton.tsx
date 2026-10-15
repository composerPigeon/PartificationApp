import {ToggleButton, Tooltip} from '@mui/material'
import type {ReactNode} from 'react'

interface ToolButtonProps {
    label: string
    icon: ReactNode
    selected: boolean
    onSelect(): void
    disabled?: boolean
}

/** A controlled editing-mode button; selecting the active tool keeps it active. */
export function ToolButton({label, icon, selected, onSelect, disabled = false}: ToolButtonProps) {
    return (
        <Tooltip title={label} placement="right" arrow>
            <span>
                <ToggleButton value={label} type="button" aria-label={label} selected={selected}
                              disabled={disabled} onChange={onSelect}
                              sx={{
                                  width: {xs: 36, sm: 44}, height: {xs: 36, sm: 44}, p: 0,
                                  border: 0, borderRadius: '50%', color: 'text.secondary',
                                  transition: 'background-color 160ms ease, color 160ms ease, box-shadow 160ms ease',
                                  '&:hover': {bgcolor: 'action.hover', color: 'primary.main'},
                                  '&.Mui-selected': {
                                      bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: 2,
                                      '&:hover': {bgcolor: 'primary.dark'},
                                  },
                                  '&.Mui-focusVisible': {outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2},
                                  '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
                              }}>
                    {icon}
                </ToggleButton>
            </span>
        </Tooltip>
    )
}
