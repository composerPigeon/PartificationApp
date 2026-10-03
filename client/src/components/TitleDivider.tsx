import {Box} from '@mui/material';

export default function TitleDivider() {
    return (
        <Box aria-hidden="true" sx={{
            width: 48,
            height: 4,
            bgcolor: 'primary.main',
            borderRadius: 2,
            mx: 'auto',
            my: {xs: 4, sm: 5},
        }}/>
    );
}
