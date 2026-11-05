import {TextField} from '@mui/material';

type ScoreField = 'title' | 'subtitle' | 'author' | 'authorDate' | 'genre';

interface ScoreDetailFieldProps<K extends ScoreField> {
    state: Record<K, string>;
    field: K;
    label: string;
    required?: boolean;
    disabled?: boolean;
}

export default function ScoreDetailField<K extends ScoreField>({
    state, field, label, required, disabled,
}: ScoreDetailFieldProps<K>) {
    return <TextField label={label} name={field} value={state[field]}
                      onChange={event => { state[field] = event.target.value; }}
                      required={required} disabled={disabled} fullWidth margin="normal"/>;
}
