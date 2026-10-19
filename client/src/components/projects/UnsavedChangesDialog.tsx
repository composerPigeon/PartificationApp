import {useId} from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'

interface UnsavedChangesDialogProps {
    open: boolean
    onStay(): void
    onLeave(): void
}

export function UnsavedChangesDialog({open, onStay, onLeave}: UnsavedChangesDialogProps) {
    const titleId = useId()
    const descriptionId = useId()

    return (
        <Dialog open={open} onClose={onStay} maxWidth="xs" fullWidth
                aria-labelledby={titleId} aria-describedby={descriptionId}>
            <DialogTitle id={titleId}>Leave without saving?</DialogTitle>
            <DialogContent>
                <DialogContentText id={descriptionId}>
                    You have unsaved changes in this project. If you leave, all unsaved changes will be lost.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onLeave} color="error">Leave</Button>
                <Button onClick={onStay} variant="contained" autoFocus>Stay</Button>
            </DialogActions>
        </Dialog>
    )
}
