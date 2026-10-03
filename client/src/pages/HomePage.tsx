import {Box, Container, Typography} from '@mui/material'
import {FloatButton} from '../components/buttons/FloatButton'
import NavPage from '../components/NavPage'
import TitleDivider from '../components/TitleDivider'

function HomePage() {
    return (
        <NavPage title="Home">
            <Box sx={{
                flex: 1,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(25, 118, 210, 0.12), transparent 65%)',
            }}>
                <Container maxWidth="md" sx={{
                    pt: {xs: 7, sm: 12},
                    pb: 'calc(128px + env(safe-area-inset-bottom, 0px))',
                    textAlign: 'center',
                }}>
                    <Typography component="h1" sx={{
                        color: 'primary.main',
                        fontWeight: 800,
                        fontSize: {xs: 'clamp(1.75rem, 7vw, 3rem)', sm: '4rem', md: '4.5rem'},
                        letterSpacing: '-0.055em',
                        lineHeight: 1.1,
                    }}>
                        PartificationApp
                    </Typography>
                    <TitleDivider/>
                    <Box component="section" aria-labelledby="home-welcome">
                        <Typography id="home-welcome" component="h2" sx={{
                            fontWeight: 700,
                            fontSize: {xs: '1.5rem', sm: '2rem'},
                            letterSpacing: '-0.025em',
                            lineHeight: 1.3,
                        }}>
                            Welcome to your next arrangement.
                        </Typography>
                        <Typography component="p" sx={{mt: 2, fontSize: '1.125rem', color: 'primary.dark'}}>
                            Bring your score. Shape the parts you need.
                        </Typography>
                    </Box>
                    <Typography component="p" color="text.secondary" sx={{
                        mt: 4,
                        mx: 'auto',
                        maxWidth: 560,
                        fontSize: {xs: '1rem', sm: '1.125rem'},
                        lineHeight: 1.8,
                    }}>
                        PartificationApp will help you split music scores into individual voices and export
                        different combinations of them, creating the parts you need for practice and performance.
                    </Typography>
                </Container>
            </Box>
            <FloatButton to="/projects">
                Start
            </FloatButton>
        </NavPage>
    )
}

export default HomePage
