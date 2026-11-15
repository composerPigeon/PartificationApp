import {Alert, Box, CircularProgress} from '@mui/material';
import {useExportPdf} from '../../hooks/project/export/pdf/useExportPdf';
import {usePdfCanvas} from '../../hooks/project/export/pdf/usePdfCanvas';

export function ExportPdfViewer() {
    const {document, paging, loading, error: documentError} = useExportPdf();
    const {pageIndex} = paging;
    const {canvasRef, rendering, error: renderError} = usePdfCanvas(document, pageIndex);
    const error = documentError ?? renderError;
    const busy = loading || rendering;
    return <Box sx={{width: '100%', display: 'grid', justifyItems: 'center', gap: 2}}>
        {busy && <CircularProgress aria-label="Rendering PDF preview"/>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="canvas" ref={canvasRef} role="img" aria-label={"PDF preview, page " + (pageIndex + 1)}
             sx={{display: busy || error || !document ? 'none' : 'block', width: '100%', maxWidth: 800, height: 'auto',
                 bgcolor: 'white', boxShadow: '0 3px 12px #0003'}}/>
    </Box>;
}
