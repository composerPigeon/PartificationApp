import {Chip, Tooltip} from '@mui/material';
import type {Instrument} from '../../domain';

export function InstrumentBadge({instrument, color = 'secondary'}: {
    instrument: Pick<Instrument, 'title' | 'shortcut'>;
    color?: 'primary' | 'secondary';
}) {
    return (
        <Tooltip title={instrument.title}>
            <Chip component="span" size="small" variant="outlined" color={color}
                  label={instrument.shortcut || instrument.title} aria-label={instrument.title}
                  sx={{maxWidth: '100%', fontWeight: 600}}/>
        </Tooltip>
    );
}
