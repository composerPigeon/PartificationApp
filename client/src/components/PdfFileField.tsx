import { useId, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { visuallyHidden } from '@mui/utils'

interface PdfFileFieldProps {
  onChange(file: File | null): void
  disabled?: boolean
}

export function PdfFileField({ onChange, disabled }: PdfFileFieldProps) {
  const id = useId()
  const [fileName, setFileName] = useState('')
  return (
    <Box sx={{ my: 2 }}>
      <Typography id={`${id}-label`} sx={{ display: 'block' }} gutterBottom>PDF file</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button component="label" role={undefined} tabIndex={-1} variant="outlined" disabled={disabled}
          sx={{ '&:focus-within': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
          {fileName ? 'Change PDF' : 'Choose PDF'}
          <Box component="input" id={id} name="pdf" type="file" accept=".pdf,application/pdf"
            required disabled={disabled} sx={visuallyHidden}
            aria-labelledby={`${id}-label`} aria-describedby={`${id}-help`}
            onChange={event => {
              const file = event.target.files?.[0] ?? null
              setFileName(file?.name ?? '')
              onChange(file)
            }} />
        </Button>
        <Typography variant="body2" color="text.secondary" role="status" sx={{ overflowWrap: 'anywhere', minWidth: 0 }}>
          {fileName || 'No PDF selected'}
        </Typography>
      </Box>
      <Typography id={`${id}-help`} variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        The PDF and converted pages will be saved in your selected project folder.
      </Typography>
    </Box>
  )
}
