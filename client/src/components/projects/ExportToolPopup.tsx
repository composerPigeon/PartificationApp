import {Box, Divider, IconButton, List, ListItem, ListItemButton, Paper, Slider, Tooltip, Typography} from '@mui/material';
import {ButtonIcon} from '../buttons/ButtonIcon';
import {useExport, useExportInteractionMode, useExportPreview, useInstrumentSelection} from '../../hooks/project/export';
import {useProject} from '../../hooks/project';
import {useState} from 'react';
import {InstrumentBadge} from './InstrumentBadge';

function SpacingSlider({label, value, maximum, onCommit}: {
    label: string;
    value: number;
    maximum: number | null;
    onCommit: (value: number) => void;
}) {
    const [draft, setDraft] = useState<number | null>(null);
    const displayedValue = draft ?? value;
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 1}}>
                <Typography variant="body2">{label}</Typography>
                <Typography variant="body2" sx={{color: 'text.secondary', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
                    {displayedValue}
                </Typography>
            </Box>
            <Box sx={{px: 3, py: 1}}>
                <Slider aria-label={label} color="secondary" size="small" min={0}
                        max={maximum ?? 0} step={1} disabled={maximum === null || maximum === 0}
                        value={Math.min(displayedValue, maximum ?? 0)} valueLabelDisplay="off"
                        sx={{'& .MuiSlider-thumb': {width: 10, height: 10}}}
                        getAriaValueText={value => `${value} points`}
                        onChange={(_, nextValue) => {
                            if (typeof nextValue === 'number') setDraft(nextValue);
                        }}
                        onChangeCommitted={(_, nextValue) => {
                            if (typeof nextValue === 'number') onCommit(nextValue);
                            setDraft(null);
                        }}/>
            </Box>
        </Box>
    );
}

export function ExportToolPopup() {
    const {mode} = useExportInteractionMode();
    const {exportContext, setSpacing, maxSpacing} = useExportPreview();
    const {project} = useProject();
    const selection = useInstrumentSelection();
    const {deleteExport, deletingExport} = useExport();
    if (mode === 'select') return null;

    return (
        <Paper component="aside" aria-labelledby="export-tool-popup-title" elevation={5}
               sx={{
                   position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                   width: {xs: 'calc(min(280px, 24vw) + 40px)', sm: 'calc(min(280px, 24vw) + 56px)'},
                   minWidth: 0, minHeight: '100%',
                   maxHeight: 'calc(100svh - 160px)', display: 'flex', flexDirection: 'column',
                   overflow: 'hidden', zIndex: 0, borderRadius: 3,
                   py: {xs: 1.5, sm: 2}, pr: {xs: 1.5, sm: 2},
                   pl: {xs: '52px', sm: '72px'}, gap: 1.5,
               }}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <ButtonIcon name={mode === 'settings' ? 'settings' : 'export'} fontSize="small" color="secondary"/>
                <Typography id="export-tool-popup-title" component="h2" variant="subtitle1"
                            sx={{fontWeight: 800}}>
                    {mode === 'settings' ? 'Settings' : 'Exports'}
                </Typography>
            </Box>
            <Divider/>
            <Box sx={{flex: 1, minHeight: 0, display: 'grid', alignContent: 'center', overflowY: 'auto', py: 1}}>
                {mode === 'settings' && exportContext ? (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                        <Typography variant="subtitle2" sx={{color: 'text.secondary'}}>Spacing (pt)</Typography>
                        {([
                            ['withinSystemSpacing', 'Within root system'],
                            ['betweenSystemSpacing', 'Between root systems'],
                        ] as const).filter(([setting]) => setting !== 'withinSystemSpacing' || exportContext.instrumentIds.length > 1)
                            .map(([setting, label]) => (
                            <SpacingSlider key={`${exportContext.id}:${setting}`} label={label}
                                           value={exportContext[setting]} maximum={maxSpacing}
                                           onCommit={value => setSpacing(setting, value)}/>
                        ))}
                    </Box>
                ) : mode === 'exports' && project.exports.length > 0 ? (
                    <List dense disablePadding aria-label="Project exports"
                          sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                        {project.exports.map(context => {
                            const selected = context.instrumentIds.length === selection.selectedIds.size
                                && context.instrumentIds.every(id => selection.selectedIds.has(id));
                            return (
                                <ListItem key={context.id} disablePadding
                                          secondaryAction={
                                              <Tooltip title="Delete export">
                                                  <span>
                                                      <IconButton edge="end" size="small" aria-label={`Delete export ${context.id}`}
                                                                  sx={{color: 'text.secondary', '&:hover': {color: 'error.main'}}}
                                                                  disabled={deletingExport}
                                                                  onClick={() => { void deleteExport(context.id); }}>
                                                          <ButtonIcon name="delete" fontSize="small"/>
                                                      </IconButton>
                                                  </span>
                                              </Tooltip>
                                          }>
                                <ListItemButton selected={selected} disabled={deletingExport}
                                                onClick={() => selection.select(context.instrumentIds)}
                                                sx={{
                                                    borderRadius: 1.5, pl: 1.5, pr: 5, py: 1,
                                                    border: 1, borderColor: 'divider',
                                                    '&.Mui-selected': {
                                                        borderColor: 'secondary.main', bgcolor: 'transparent',
                                                        '&:hover': {bgcolor: 'transparent'},
                                                    },
                                                }}>
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.75, minWidth: 0}}>
                                        {context.instrumentIds.map(id => (
                                            <InstrumentBadge key={id} instrument={project.instruments.find(instrument => instrument.id === id)
                                                ?? {title: id, shortcut: ''}}/>
                                        ))}
                                    </Box>
                                </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                ) : (
                    <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center'}}>
                        {mode === 'settings' ? 'Select instruments to edit export settings.' : 'No exports yet.'}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}
