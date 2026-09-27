import {Typography} from "@mui/material";
import type {ReactNode} from "react";


export default function FormTitle({children}: {children: string}): ReactNode {
    return (
        <Typography component="h1" variant="h4" align="center" gutterBottom>
            {children}
        </Typography>
    )
}
