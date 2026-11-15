import {Box, ButtonBase, IconButton, Tooltip, Typography} from '@mui/material'
import {ButtonIcon} from '../../buttons/ButtonIcon'
import type {Staff} from '../../../domain';
import {useInstrumentEditing, useStaffDragging, useStaffSelection} from '../../../hooks/workspace/scorePage';
import {useDeleteStaff, usePermissions} from '../../../hooks/workspace';

interface InstrumentTagProps {
    staff: Staff
    scale: number
}

export function InstrumentTag({staff, scale}: InstrumentTagProps) {
    const instrumentEditing = useInstrumentEditing()
    const deleteStaff = useDeleteStaff()
    const permissions = usePermissions()
    const dragging = useStaffDragging()
    const selection = useStaffSelection()
    const selected = selection.isSelected(staff.id)
    const preview = dragging.dragPreview?.id === staff.id ? dragging.dragPreview : null
    const y = preview?.y ?? staff.y
    const height = preview?.height ?? staff.height
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            top: (y + height / 2) * scale,
            transform: 'translateY(-50%)',
            width: '100%',
            boxSizing: 'border-box',
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            borderRadius: '4px 12px 12px 4px',
            borderLeft: '4px solid',
            borderColor: 'secondary.dark',
            boxShadow: 1,
            outline: selected ? '2px solid' : undefined,
            outlineColor: 'primary.main',
            outlineOffset: 2,
        }}>
            <ButtonBase aria-label={`Edit instrument ${staff.instrument.title}`}
                        disabled={!permissions.canChangeTool}
                        onClick={event => {
                            const bounds = event.currentTarget.getBoundingClientRect()
                            instrumentEditing.editInstrument(staff, {top: bounds.top, left: bounds.left})
                        }}
                        sx={{flex: 1, minWidth: 0, justifyContent: 'flex-start', px: 1.5, py: 0.75,
                            '&.Mui-focusVisible': {outline: '2px solid currentColor'}}}>
                <Typography variant="body2" sx={{fontWeight: 600}} noWrap title={staff.instrument.title}>
                    {staff.instrument.title}
                </Typography>
            </ButtonBase>
            <Tooltip title="Delete staff">
                <IconButton size="small" aria-label={`Delete staff ${staff.instrument.title}`}
                            disabled={!permissions.canChangeTool}
                            onClick={() => {
                                deleteStaff(staff.id)
                            }} sx={{color: 'inherit', mr: 0.5}}>
                    <ButtonIcon name="delete" fontSize="small"/>
                </IconButton>
            </Tooltip>
        </Box>
    )
}
