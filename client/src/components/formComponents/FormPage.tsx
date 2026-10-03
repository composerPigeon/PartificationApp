import {Box, Container, Paper} from "@mui/material";
import type {PropsWithChildren, ReactNode} from "react";


export default function FormPage({children}: Required<PropsWithChildren>): ReactNode {
    return (
        <Box component="main" sx={{minHeight: '100svh', display: 'grid', placeItems: 'center', py: 4}}>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{p: {xs: 3, sm: 4}, borderRadius: 3}}>
                    {children}
                </Paper>
            </Container>
        </Box>
    )
}
