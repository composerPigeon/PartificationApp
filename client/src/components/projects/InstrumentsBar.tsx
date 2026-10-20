import {alpha, Box, Checkbox, FormControlLabel, List, ListItem, Paper, Typography} from '@mui/material'
import type {Instrument} from '../../domain/Instrument.ts'

interface InstrumentsBarProps {
    instruments: readonly Instrument[]
    selectedIds: ReadonlySet<string>
    onToggle(id: string, selected: boolean): void
    disabled?: boolean
}

export function InstrumentsBar({instruments, selectedIds, onToggle, disabled = false}: InstrumentsBarProps) {
    return (
        <Paper component="aside" aria-label="Project instruments" elevation={5}
               sx={theme => ({
                   position: 'fixed', left: {xs: 64, sm: 88}, top: '50%', transform: 'translateY(-50%)',
                   width: {xs: 160, sm: 208, md: 240}, maxHeight: 'calc(100svh - 160px)',
                   display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 10,
                   borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.15),
               })}>
            <Box sx={theme => ({
                p: {xs: 1.5, sm: 2}, borderBottom: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.12),
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
            })}>
                <Typography component="h2" variant="subtitle1" sx={{fontWeight: 800, color: 'primary.main'}}>
                    Instruments
                </Typography>
            </Box>
            {instruments.length ? (
                <List disablePadding sx={{p: 1, overflowY: 'auto', minHeight: 0, scrollbarWidth: 'thin'}}>
                    {instruments.map(instrument => {
                        const selected = selectedIds.has(instrument.id)
                        return (
                            <ListItem key={instrument.id} disablePadding sx={{'&:not(:last-child)': {mb: 0.75}}}>
                                <FormControlLabel disableTypography disabled={disabled}
                                    control={<Checkbox color="primary" checked={selected}
                                                       slotProps={{input: {'aria-label': instrument.title}}}
                                                       onChange={(_, checked) => onToggle(instrument.id, checked)}/>}
                                    label={<Box component="span" sx={{display: 'flex', flexDirection: 'column', minWidth: 0, py: 1}}>
                                        <Typography component="span" variant="body2" sx={{fontWeight: 700, overflowWrap: 'anywhere'}}>
                                            {instrument.title}
                                        </Typography>
                                        {instrument.shortcut && (
                                            <Typography component="span" variant="caption" sx={{color: selected ? 'primary.dark' : 'text.secondary'}}>
                                                {instrument.shortcut}
                                            </Typography>
                                        )}
                                    </Box>}
                                    sx={theme => ({
                                        m: 0, width: '100%', pr: 1, borderRadius: 2, border: '1px solid',
                                        borderColor: selected ? alpha(theme.palette.primary.main, 0.5) : 'transparent',
                                        bgcolor: alpha(theme.palette.primary.main, selected ? 0.1 : 0.025),
                                        transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow'], {duration: 150}),
                                        '&:hover': {bgcolor: alpha(theme.palette.primary.main, 0.15)},
                                        '&:focus-within': {outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2},
                                        '@media (prefers-reduced-motion: reduce)': {transition: 'none'},
                                    })}/>
                            </ListItem>
                        )
                    })}
                </List>
            ) : (
                <Typography variant="body2" sx={{p: 2, color: 'text.secondary'}}>No instruments in this project yet.</Typography>
            )}
        </Paper>
    )
}
