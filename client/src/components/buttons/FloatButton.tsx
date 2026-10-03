import {Fab} from '@mui/material';
import type {FabProps} from '@mui/material';
import {Link} from '@tanstack/react-router';
import type {LinkProps} from '@tanstack/react-router';

export type FloatButtonProps = Pick<FabProps, 'children' | 'disabled' | 'aria-label'> & {
    to: LinkProps['to'];
    icon?: boolean;
};

export function FloatButton({children, to, icon = false, ...props}: FloatButtonProps) {
    return (
        <Fab component={Link} to={to} color="primary" variant={icon ? 'circular' : 'extended'}
             {...props}
             sx={{
                 position: 'fixed',
                 bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 height: 56,
                 ...(icon ? {width: 56} : {px: 5}),
                 boxShadow: 6,
                 zIndex: theme => theme.zIndex.appBar,
             }}>
            {children}
        </Fab>
    );
}
