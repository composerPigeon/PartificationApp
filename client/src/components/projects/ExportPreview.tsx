import {Alert, CircularProgress, Stack, Typography} from '@mui/material';
import {useExportPreview} from '../../hooks/project/export';
import {useView} from '../../hooks/useView';
import {ExportPdfViewer} from './ExportPdfViewer';

export function ExportPreview() {
    const {pdf, generating} = useExportPreview();
    const {error} = useView();
    if (generating) return <Stack spacing={2} sx={{alignItems: 'center'}}>
        <CircularProgress aria-label="Generating PDF preview"/>
        <Typography variant="body2">Building your score…</Typography>
    </Stack>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (pdf) return <ExportPdfViewer/>;
    return <Typography variant="body2" sx={{color: 'text.secondary'}}>Select instruments to preview the PDF.</Typography>;
}
