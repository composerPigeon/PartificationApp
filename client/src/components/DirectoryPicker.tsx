// Disabled until DirectoryState is available again; this component is currently unused.
/*
import {Alert, Box, Typography} from "@mui/material";
import {ActionButton} from './buttons/ActionButton';

interface DirectoryPickerProps {
    directoryBusy: boolean,
    directory: DirectoryState | null,
    supportsDirectoryPicker: boolean,
    isSubmitting: boolean,
    directoryError: string | null,

    handleDirectory(x: boolean): void
}


function DirectoryPicker({
                             directoryBusy,
                             directory,
                             supportsDirectoryPicker,
                             isSubmitting,
                             directoryError,
                             handleDirectory
                         }: DirectoryPickerProps) {
    return (
        <Box sx={{my: 2}}>
            <Typography variant="subtitle2">Project folder</Typography>
            <Typography variant="body2" color="text.secondary" sx={{overflowWrap: 'anywhere'}} aria-live="polite">
                {directoryBusy ? 'Checking folder…' : directory
                    ? `${directory.name}${directory.granted ? '' : ' — access required'}`
                    : 'Choose where your project images will be saved.'}
            </Typography>
            {supportsDirectoryPicker ? (
                <Box sx={{display: 'flex', gap: 1, mt: 1}}>
                    <ActionButton disabled={directoryBusy || isSubmitting}
                                  onClick={() => void handleDirectory(false)}>
                        {directory ? 'Change folder' : 'Choose folder'}
                    </ActionButton>
                    {directory && !directory.granted && (
                        <ActionButton disabled={directoryBusy || isSubmitting}
                                      onClick={() => void handleDirectory(true)}>
                            Allow access
                        </ActionButton>
                    )}
                </Box>
            ) : (
                <Alert severity="info" sx={{mt: 1}}>Folder selection is unavailable in this browser. Try desktop Chrome
                    or Edge.</Alert>
            )}
            {directoryError && <Alert severity="warning" sx={{mt: 1}}>{directoryError}</Alert>}
        </Box>
    )
}

export default DirectoryPicker
*/
