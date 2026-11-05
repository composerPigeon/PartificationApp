import {alpha, Box, Checkbox, FormControlLabel, IconButton, Stack, Tooltip, Typography} from '@mui/material';

interface LayoutTrainingPermissionFieldProps {
    state: { allowLayoutModelTraining: boolean };
    disabled?: boolean;
}

export default function LayoutTrainingPermissionField({state, disabled}: LayoutTrainingPermissionFieldProps) {
    return (
        <Stack direction="row" sx={{alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <FormControlLabel
                control={<Checkbox checked={state.allowLayoutModelTraining}
                                   onChange={(_, checked) => { state.allowLayoutModelTraining = checked; }}/>}
                disabled={disabled}
                label="Allow model training"
                slotProps={{typography: {variant: 'body2'}}}
                sx={{mr: 0.5}}
            />
            <Tooltip
                slotProps={{tooltip: {sx: {maxWidth: 360, p: 2, fontSize: '0.8125rem', lineHeight: 1.6}}}}
                title={
                    <Box>
                        <Typography component="div" variant="subtitle2" sx={{mb: 1}}>
                            Permission for model training
                        </Typography>
                        <Box component="ul" sx={{m: 0, pl: 2, '& li + li': {mt: 1}}}>
                            <li><strong>What you allow:</strong> We may use this project’s score pages and layout annotations to train music-score layout models.</li>
                            <li><strong>Why:</strong> To improve automatic detection of elements such as staves and systems.</li>
                            <li><strong>Your rights:</strong> By checking the box, you confirm that you have the right to grant this permission and that this use will not infringe anyone’s copyright or other rights.</li>
                            <li><strong>Your choice:</strong> Permission is optional. You can create the project without giving it.</li>
                        </Box>
                    </Box>
                }
            >
                <IconButton type="button" size="small" color="primary"
                            aria-label="About permission for layout model training"
                            sx={theme => ({
                                width: 28, height: 28, flexShrink: 0,
                                fontSize: '0.875rem', fontWeight: 700,
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.25),
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                transition: theme.transitions.create(['background-color', 'border-color']),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.16),
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focusVisible': {
                                    outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2,
                                },
                            })}>
                    ?
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
