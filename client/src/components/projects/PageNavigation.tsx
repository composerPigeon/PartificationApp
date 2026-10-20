import {Box, IconButton, SvgIcon, Typography} from '@mui/material'

const arrowButtonSx = {
    width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText',
    '&:hover': {bgcolor: 'primary.dark'},
    '&.Mui-disabled': {bgcolor: 'action.disabledBackground'},
}

interface PageNavigationProps {
    pageIndex: number
    pageCount: number

    onPrevious(): void

    onNext(): void
}

export function PageNavigation({pageIndex, pageCount, onPrevious, onNext}: PageNavigationProps) {
    const currentPage = pageCount > 0 ? pageIndex + 1 : 0
    return (
        <Box component="nav" aria-label="Page navigation" sx={{
            display: 'flex', alignItems: 'center', gap: 0.5, p: 0.5, flexShrink: 0,
            border: '1px solid', borderColor: 'divider', borderRadius: 99,
            bgcolor: 'background.paper', boxShadow: '0 3px 12px rgba(0, 0, 0, 0.06)',
        }}>
            <IconButton aria-label="Previous page" title="Previous page" disabled={pageCount === 0 || pageIndex <= 0}
                        onClick={onPrevious} size="small" sx={arrowButtonSx}>
                <SvgIcon fontSize="small">
                    <path d="m14.7 6.7-1.4-1.4L6.6 12l6.7 6.7 1.4-1.4-5.3-5.3z"/>
                </SvgIcon>
            </IconButton>
            <Typography component="span" role="status" aria-live="polite"
                        aria-label={`Page ${currentPage} of ${pageCount}`}
                        sx={{px: 1, minWidth: `${String(pageCount).length * 2 + 3}ch`, textAlign: 'center', whiteSpace: 'nowrap', fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums'}}>
                <Box component="span" sx={{fontWeight: 800, color: 'primary.main'}}>{currentPage}</Box>
                <Box component="span" sx={{mx: 1, color: 'text.disabled'}}>/</Box>
                <Box component="span" sx={{color: 'text.secondary'}}>{pageCount}</Box>
            </Typography>
            <IconButton aria-label="Next page" title="Next page" disabled={pageIndex >= pageCount - 1}
                        onClick={onNext} size="small" sx={arrowButtonSx}>
                <SvgIcon fontSize="small">
                    <path d="m9.3 5.3-1.4 1.4 5.3 5.3-5.3 5.3 1.4 1.4 6.7-6.7z"/>
                </SvgIcon>
            </IconButton>
        </Box>
    )
}
