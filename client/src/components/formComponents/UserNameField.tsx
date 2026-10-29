import {IconButton, InputAdornment, TextField, Tooltip} from '@mui/material';

interface UserNameFieldProps {
    value: string;
    setValue: (value: string) => void;
    showHelp?: boolean;
}

export default function UserNameField({value, setValue, showHelp = false}: UserNameFieldProps) {
    return <TextField label="Username" name="userName" value={value}
                      onChange={event => setValue(event.target.value)}
                      autoComplete="username" fullWidth margin="normal" required
                      slotProps={{
                          htmlInput: {minLength: 3, maxLength: 80, pattern: '[A-Za-z0-9_.\\-]+'},
                          input: showHelp ? {
                              endAdornment: <InputAdornment position="end">
                                  <Tooltip title="3–80 letters, numbers, dots, underscores or hyphens.">
                                      <IconButton type="button" size="small" aria-label="Username requirements">
                                          ?
                                      </IconButton>
                                  </Tooltip>
                              </InputAdornment>,
                          } : undefined,
                      }}/>;
}
