import {SvgIcon} from '@mui/material'
import type {SvgIconProps} from '@mui/material'

type ButtonIconName = 'select' | 'add-staff' | 'edit-staff' | 'export' | 'save' | 'back' | 'preview' | 'print' | 'previous-page' | 'next-page' | 'settings' | 'delete' | 'add'

type ButtonIconProps = SvgIconProps & {name: ButtonIconName}

export function ButtonIcon({name, ...props}: ButtonIconProps) {
    return (
        <SvgIcon {...props}>
            <use href={`${import.meta.env.BASE_URL}icons/buttons/${name}.svg#icon`}/>
        </SvgIcon>
    )
}
