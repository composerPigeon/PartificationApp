import {alpha, Box, Checkbox, FormControlLabel, IconButton, List, ListItem, Paper, Tooltip, Typography} from '@mui/material'
import {useProject} from '../../hooks/project';
import {useInstrumentSelection} from '../../hooks/project/export';
import {InstrumentsToolBar} from './InstrumentsToolBar';
import {InstrumentBadge} from './InstrumentBadge';
import {InstrumentForm} from './InstrumentForm';
import {ButtonIcon} from '../buttons/ButtonIcon';
import {useInstrumentActions} from '../../hooks/project/export/useInstrumentActions';

export function InstrumentsBar() {
    const {project} = useProject();
    const instruments = project.instruments;
    const {isSelected, toggle} = useInstrumentSelection();
    const actions = useInstrumentActions();
    return (
        <Box sx={{
            position: 'fixed', right: {xs: 8, sm: 16}, top: '50%', transform: 'translateY(-50%)',
            width: 'min(280px, 24vw)', maxHeight: 'calc(100svh - 160px)',
            display: 'flex', flexDirection: 'column', gap: 1.5, zIndex: 10,
        }}>
        {instruments.length > 0 && <InstrumentsToolBar/>}
        <Paper component="aside" aria-label="Project instruments" elevation={5}
               sx={theme => ({
                   width: '100%', minWidth: 0, minHeight: 0,
                   display: 'flex', flexDirection: 'column', overflow: 'hidden',
                   borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.15),
               })}>
            <Box sx={theme => ({
                p: {xs: 1.5, sm: 2}, borderBottom: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.12),
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
            })}>
                <Typography component="h2" variant="subtitle1" sx={{fontWeight: 800, color: 'primary.main', textAlign: 'center'}}>
                    Instruments
                </Typography>
            </Box>
            {instruments.length ? (
                <List disablePadding sx={{p: 1, overflowY: 'auto', overscrollBehaviorY: 'contain', minHeight: 0, scrollbarWidth: 'thin'}}>
                    {instruments.map(instrument => {
                        const selected = isSelected(instrument.id)
                        return (
                            <ListItem key={instrument.id} disablePadding sx={{'&:not(:last-child)': {mb: 0.75}}}
                                      secondaryAction={
                                          <Box sx={{display: 'flex'}}>
                                              <Tooltip title="Edit instrument">
                                                  <span><IconButton size="small" color="primary" aria-label={`Edit ${instrument.title}`} disabled={actions.saving}
                                                                    onClick={event => {
                                                                        const bounds = event.currentTarget.getBoundingClientRect();
                                                                        actions.edit(instrument, {top: bounds.bottom, left: bounds.left});
                                                                    }}>
                                                      <ButtonIcon name="edit" fontSize="small"/>
                                                  </IconButton></span>
                                              </Tooltip>
                                              <Tooltip title="Delete instrument">
                                                  <span><IconButton size="small" color="primary" aria-label={`Delete ${instrument.title}`} disabled={actions.saving}
                                                                    onClick={() => { void actions.deleteInstrument(instrument); }}>
                                                      <ButtonIcon name="delete" fontSize="small"/>
                                                  </IconButton></span>
                                              </Tooltip>
                                          </Box>
                                      }>
                                <FormControlLabel disableTypography
                                    control={<Checkbox color="primary" checked={selected}
                                                       sx={{mx: 0.5, borderRadius: '50%',
                                                           '&.Mui-checked': {outline: '1px solid', outlineColor: 'primary.main', outlineOffset: -2}}}
                                                       slotProps={{input: {'aria-label': instrument.title}}}
                                                       onChange={(_, checked) => toggle(instrument.id, checked)}/>}
                                    label={<Box component="span" sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, minWidth: 0, py: 1}}>
                                        <InstrumentBadge instrument={instrument} color="primary"/>
                                        <Typography component="span" variant="body2" sx={{fontWeight: 700, overflowWrap: 'anywhere'}}>
                                            {instrument.title}
                                        </Typography>
                                    </Box>}
                                    sx={{m: 0, width: '100%', pr: 9}}/>
                            </ListItem>
                        )
                    })}
                </List>
            ) : (
                <Typography variant="body2" sx={{p: 2, color: 'text.secondary'}}>No instruments in this project yet.</Typography>
            )}

        </Paper>
        {actions.editing && <InstrumentForm key={actions.editing.instrument.id}
                                           position={actions.editing.position} instrument={actions.editing.instrument}
                                           instruments={project.instruments.filter(instrument => instrument === actions.editing?.instrument)}
                                           onCancel={actions.cancel}
                                           onSubmit={(title, shortcut) => { void actions.submit(title, shortcut); }}/>}
        </Box>
    )
}
