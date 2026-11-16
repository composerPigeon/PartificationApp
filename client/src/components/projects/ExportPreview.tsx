import {Alert, Box, CircularProgress, Stack, Typography} from '@mui/material';
import {useExportPreview} from '../../hooks/project/export';
import {useView} from '../../hooks/useView';
import {ExportPdfViewer} from './ExportPdfViewer';
import {exportPreviewPlaceholderSx} from './exportPreviewStyles';

export function ExportPreview() {
    const {pdf, generating} = useExportPreview();
    const {error} = useView();
    if (error) return <Alert severity="error">{error}</Alert>;
    if (pdf && !generating) return <ExportPdfViewer/>;
    return <Box aria-label={generating ? 'Generating PDF preview' : 'Empty PDF preview'} sx={{
        ...exportPreviewPlaceholderSx, p: 3,
    }}>
        <Stack spacing={2} sx={{alignItems: 'center'}}>
            {generating && <CircularProgress aria-label="Generating PDF"/>}
            <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center'}}>
                {generating ? 'Building your score…' : 'Select instruments to preview the PDF.'}
            </Typography>
        </Stack>
    </Box>;
}
