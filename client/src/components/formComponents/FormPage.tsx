import {Box, Container, Paper} from "@mui/material";
import type {PropsWithChildren, ReactNode} from "react";
import NavPage from "../NavPage";


export default function FormPage({children, title}: PropsWithChildren<{title: string}>): ReactNode {
    return (
        <NavPage title={title}>
            <Box sx={{flex: 1, display: 'grid', placeItems: 'center', py: 4}}>
                <Container maxWidth="xs">
                    <Paper elevation={3} sx={{p: {xs: 3, sm: 4}, borderRadius: 3}}>
                        {children}
                    </Paper>
                </Container>
            </Box>
        </NavPage>
    )
}
