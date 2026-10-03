import {Container, Typography} from '@mui/material'
import {FloatButton} from '../components/buttons/FloatButton'
import NavPage from '../components/NavPage'

function HomePage() {
    return (
        <NavPage title="Home">
            <Container maxWidth="sm" sx={{pt: 8, pb: 'calc(112px + env(safe-area-inset-bottom, 0px))'}}>
                <Typography component="h1" variant="h2" align="center" sx={{fontWeight: 700}}>
                    Welcome to Partification App
                </Typography>
                <Typography component="p" variant="body1" align="center" color="text.secondary" sx={{mt: 3}}>
                    Partification App will help you split music scores into individual voices and export
                    different combinations of them, creating the parts you need for practice and performance.
                </Typography>
            </Container>
            <FloatButton to="/projects">
                Start
            </FloatButton>
        </NavPage>
    )
}

export default HomePage
