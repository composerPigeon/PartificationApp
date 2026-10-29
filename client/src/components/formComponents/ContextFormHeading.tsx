import type {ReactNode} from 'react'
import {Typography} from '@mui/material'

interface ContextFormHeadingProps {
    children: ReactNode
}

export function ContextFormHeading({children}: ContextFormHeadingProps) {
    return (
        <Typography component="h2" variant="h6" color="primary" align="center"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        lineHeight: 1.3,
                        pt: 0.5,
                        '&::after': {
                            content: '""',
                            display: 'block',
                            width: 32,
                            height: 3,
                            bgcolor: 'primary.main',
                            borderRadius: 2,
                            mx: 'auto',
                            mt: 1,
                        },
                    }}>{children}</Typography>
    )
}
