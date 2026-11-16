import {Box, Checkbox, CircularProgress, Divider, IconButton, List, ListItem, ListItemButton, Paper, Slider, Switch, Tooltip, Typography} from '@mui/material';
import {ButtonIcon} from '../buttons/ButtonIcon';
import {useExport, useExportInteractionMode, useExportPreview, useInstrumentSelection} from '../../hooks/project/export';
import {useProject} from '../../hooks/project';
import {useState} from 'react';
import {InstrumentBadge} from './InstrumentBadge';
import {ExportSettingsItem} from './ExportSettingsItem';
import {useExportDownloads} from '../../hooks/project/export/useExportDownloads';

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
    const {exportContext, setSpacing, maxSpacing, setShortcutsVisible} = useExportPreview();
    const {project} = useProject();
    const selection = useInstrumentSelection();
    const {deleteExport, deletingExport} = useExport();
    const [checkedExports, setCheckedExports] = useState<ReadonlySet<string>>(() => new Set());
    const {downloading, download} = useExportDownloads();
    const hasCheckedExports = project.exports.some(context => checkedExports.has(context.id));
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
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                <ButtonIcon name={mode === 'settings' ? 'settings' : 'export'} fontSize="small" color="secondary"/>
                <Typography id="export-tool-popup-title" component="h2" variant="subtitle1"
                            sx={{fontWeight: 800, flex: 1}}>
                    {mode === 'settings' ? 'Settings' : 'Exports'}
                </Typography>
                {mode === 'exports' && project.exports.length > 0 && (
                    <Box sx={{display: 'flex', gap: 1, ml: 'auto'}}>
                        <Tooltip title="Select all">
                        <IconButton size="small" color="secondary" aria-label="Select all exports"
                                onClick={() => setCheckedExports(new Set(project.exports.map(context => context.id)))}>
                            <ButtonIcon name="select-all" fontSize="small"/>
                        </IconButton>
                        </Tooltip>
                        <Tooltip title={downloading ? 'Preparing downloads…' : 'Download selected exports'}>
                        <span>
                            <IconButton size="small" color="secondary" aria-label="Download selected exports"
                                        disabled={!hasCheckedExports || downloading || deletingExport}
                                        onClick={() => { void download(checkedExports); }}>
                                {downloading ? <CircularProgress size={18} color="inherit" aria-label="Preparing downloads"/>
                                    : <ButtonIcon name="download" fontSize="small"/>}
                            </IconButton>
                        </span>
                        </Tooltip>
                    </Box>
                )}
            </Box>
            <Divider/>
            <Box sx={{flex: 1, minHeight: 0, display: 'grid', alignContent: 'center', overflowY: 'auto', py: 1}}>
                {mode === 'settings' && exportContext ? (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                    <ExportSettingsItem title="Shortcuts"
                                        action={<Switch size="small" color="secondary" checked={exportContext.isShortcutsVisible}
                                                        slotProps={{input: {'aria-label': 'Show shortcuts'}}}
                                                        onChange={(_, checked) => setShortcutsVisible(checked)}/>}/>
                    <ExportSettingsItem title="Spacing">
                        {([
                            ['withinSystemSpacing', 'Within period'],
                            ['betweenSystemSpacing', 'Between periods'],
                        ] as const).filter(([setting]) => setting !== 'withinSystemSpacing' || exportContext.instrumentIds.length > 1)
                            .map(([setting, label]) => (
                            <SpacingSlider key={`${exportContext.id}:${setting}`} label={label}
                                           value={exportContext[setting]} maximum={maxSpacing}
                                           onCommit={value => setSpacing(setting, value)}/>
                        ))}
                    </ExportSettingsItem>
                    </Box>
                ) : mode === 'exports' && project.exports.length > 0 ? (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                    <List dense disablePadding aria-label="Project exports"
                          sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                        {project.exports.map(context => {
                            const selected = context.instrumentIds.length === selection.selectedIds.size
                                && context.instrumentIds.every(id => selection.selectedIds.has(id));
                            return (
                                <ListItem key={context.id} disablePadding
                                          sx={{border: 1, borderColor: selected ? 'secondary.main' : 'divider', borderRadius: 1.5}}
                                          secondaryAction={
                                              <Tooltip title="Delete export">
                                                  <span>
                                                      <IconButton edge="end" size="small" aria-label={`Delete export ${context.id}`}
                                                                  sx={{color: 'text.secondary', '&:hover': {color: 'error.main'}}}
                                                                  disabled={deletingExport || downloading}
                                                                  onClick={() => { void deleteExport(context.id); }}>
                                                          <ButtonIcon name="delete" fontSize="small"/>
                                                      </IconButton>
                                                  </span>
                                              </Tooltip>
                                          }>
                                <Checkbox color="secondary" size="small" checked={checkedExports.has(context.id)}
                                          slotProps={{input: {'aria-label': `Select export ${context.id}`}}}
                                          onChange={(_, checked) => setCheckedExports(current => {
                                              const next = new Set(current);
                                              if (checked) next.add(context.id);
                                              else next.delete(context.id);
                                              return next;
                                          })}/>
                                <ListItemButton selected={selected} disabled={deletingExport}
                                                onClick={() => selection.select(context.instrumentIds)}
                                                sx={{
                                                    borderRadius: 1.5, pl: 0, pr: 5, py: 1,
                                                    '&.Mui-selected': {
                                                        bgcolor: 'transparent',
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
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center'}}>
                        {mode === 'settings' ? 'Select instruments to edit export settings.' : 'No exports yet.'}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}
