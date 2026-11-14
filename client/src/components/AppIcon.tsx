import {SvgIcon} from '@mui/material'
import type {SvgIconProps} from '@mui/material'

export function AppIcon(props: SvgIconProps) {
    return (
        <SvgIcon viewBox="0 0 64 64" color="primary" {...props}>
            <use href={`${import.meta.env.BASE_URL}icons/app-icon.svg#app-icon`}/>
        </SvgIcon>
    )
}
