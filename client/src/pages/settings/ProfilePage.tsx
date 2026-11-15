import {Link} from '@tanstack/react-router'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material'
import {useProfile} from '../../hooks/profile/useProfile';

function formatCreatedAt(value?: Date | string): string {
    if (value === undefined) {
        return 'Unknown'
    }

    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
        return 'Unknown'
    }

    return Intl.DateTimeFormat(undefined, {dateStyle: 'long'}).format(date)
}

function ProfilePage() {
    const {profile, error, isLoading, retry} = useProfile()

    return (
        <Box component="main" sx={{minHeight: '100svh', py: {xs: 4, sm: 8}}}>
            <Container maxWidth="sm">
                <Stack spacing={3}>
                    <Box>
                        <Typography component="h1" variant="h3" sx={{fontWeight: 700}}>
                            Your profile
                        </Typography>
                        <Typography color="text.secondary">
                            Your Partification account details
                        </Typography>
                    </Box>

                    {isLoading && (
                        <Paper sx={{p: 6, display: 'grid', placeItems: 'center'}}>
                            <CircularProgress aria-label="Loading profile"/>
                        </Paper>
                    )}

                    {!isLoading && error && (
                        <Alert
                            severity="error"
                            action={<Button color="inherit" onClick={retry}>Retry</Button>}
                        >
                            {error}
                        </Alert>
                    )}

                    {!isLoading && profile && (
                        <Paper elevation={2} sx={{p: {xs: 3, sm: 4}, borderRadius: 3}}>
                            <Stack spacing={2.5} divider={<Divider flexItem/>}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Username
                                    </Typography>
                                    <Typography variant="h6">
                                        {profile.userName}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Email address
                                    </Typography>
                                    <Typography>{profile.email}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Member since
                                    </Typography>
                                    <Typography>{formatCreatedAt(profile.createdAt)}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    )}

                    <Button component={Link} to="/" sx={{alignSelf: 'flex-start'}}>
                        Back to home
                    </Button>
                </Stack>
            </Container>
        </Box>
    )
}

export default ProfilePage
