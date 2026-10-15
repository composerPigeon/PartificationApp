import {IconButton, Tooltip} from '@mui/material'
import type {IconButtonProps} from '@mui/material'
import type {ReactNode} from 'react'

interface ToolActionButtonProps {
    label: string
    icon: ReactNode
    onClick?: IconButtonProps['onClick']
    disabled?: boolean
}

export function ToolActionButton({label, icon, onClick, disabled = false}: ToolActionButtonProps) {
    return (
        <Tooltip title={label} placement="right" arrow>
            <span>
                <IconButton type="button" aria-label={label} onClick={onClick} disabled={disabled}
                            sx={{
                                width: {xs: 36, sm: 44}, height: {xs: 36, sm: 44}, p: 0,
                                borderRadius: '10px', color: 'primary.main', bgcolor: 'action.hover',
                                transition: 'background-color 160ms ease, color 160ms ease',
                                '&:hover': {bgcolor: 'primary.main', color: 'primary.contrastText'},
                                '&.Mui-focusVisible': {outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2},
                                '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
                            }}>
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    )
}
