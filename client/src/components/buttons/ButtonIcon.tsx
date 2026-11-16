import {SvgIcon} from '@mui/material'
import type {SvgIconProps} from '@mui/material'

type ButtonIconName = 'workspace' | 'export-score' | 'select' | 'add-staff' | 'edit-staff' | 'edit' | 'copy-staves' | 'export' | 'save' | 'back' | 'preview' | 'print' | 'previous-page' | 'next-page' | 'settings' | 'delete' | 'add'

type ButtonIconProps = SvgIconProps & {name: ButtonIconName}

export function ButtonIcon({name, ...props}: ButtonIconProps) {
    return (
        <SvgIcon {...props}>
            <use href={`${import.meta.env.BASE_URL}icons/buttons/${name}.svg#icon`}/>
        </SvgIcon>
    )
}
