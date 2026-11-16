import {Paper, SvgIcon} from '@mui/material';
import {useInstrumentSelection} from '../../hooks/project/export';
import {ToolActionButton} from '../buttons/ToolActionButton';

export function InstrumentsToolBar() {
    const {draftIds, hasChanges, confirm, reset} = useInstrumentSelection();
    return (
        <Paper component="aside" aria-label="Instrument selection actions" elevation={5}
               sx={{
                   position: 'relative', height: {xs: 40, sm: 56},
                   display: 'flex', flexDirection: 'row', alignItems: 'center',
                   gap: 1, px: 1, borderRadius: 3, zIndex: 1,
                   alignSelf: 'center', flexShrink: 0,
               }}>
            <ToolActionButton label="Undo selection changes" disabled={!hasChanges} onClick={reset}
                              icon={<SvgIcon><path d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62C8.77 11.22 10.54 10.5 12.5 10.5c3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8Z"/></SvgIcon>}/>
            <ToolActionButton label="Confirm selection" disabled={!hasChanges || draftIds.size === 0} onClick={confirm}
                              icon={<SvgIcon><path d="m9 16.17-4.17-4.17-1.42 1.41L9 19 21 7l-1.41-1.41Z"/></SvgIcon>}/>
        </Paper>
    );
}
