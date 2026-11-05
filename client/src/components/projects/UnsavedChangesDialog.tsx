import {useId} from 'react'
import {useBlocker} from '@tanstack/react-router'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'

interface UnsavedChangesDialogProps {
    hasChanges: boolean
}

export function UnsavedChangesDialog({hasChanges}: UnsavedChangesDialogProps) {
    const titleId = useId()
    const descriptionId = useId()
    const blocker = useBlocker({
        shouldBlockFn: ({current, next}) => hasChanges && current.pathname !== next.pathname,
        enableBeforeUnload: hasChanges,
        disabled: !hasChanges,
        withResolver: true,
    })

    const onStay = () => blocker.reset?.()
    const onLeave = () => blocker.proceed?.()

    return (
        <Dialog open={blocker.status === 'blocked'} onClose={onStay} maxWidth="xs" fullWidth
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
