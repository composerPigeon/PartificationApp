import {useEffect, useRef, useState} from 'react'
import {Alert, Box, CircularProgress} from '@mui/material'
import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist'
import type {PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy, RenderTask} from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

interface ExportPdfViewerProps {
    pdf: Blob
    pageIndex: number
    onPageCount(count: number): void
}

export function ExportPdfViewer({pdf, pageIndex, onPageCount}: ExportPdfViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [document, setDocument] = useState<PDFDocumentProxy | null>(null)
    const [rendering, setRendering] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        let task: PDFDocumentLoadingTask | undefined
        async function load() {
            try {
                const data = new Uint8Array(await pdf.arrayBuffer())
                if (!active) return
                const assets = `${import.meta.env.BASE_URL}pdfjs/`
                task = getDocument({data, cMapUrl: `${assets}cmaps/`, cMapPacked: true,
                    standardFontDataUrl: `${assets}standard_fonts/`, wasmUrl: `${assets}wasm/`, iccUrl: `${assets}iccs/`})
                const loaded = await task.promise
                if (active) {
                    onPageCount(loaded.numPages)
                    setDocument(loaded)
                }
            } catch (error) {
                if (active) {
                    onPageCount(0)
                    setError(error instanceof Error ? error.message : 'Unable to display PDF preview.')
                    setRendering(false)
                }
            }
        }
        void load()
        return () => {
            active = false
            void task?.destroy().catch(() => {})
        }
    }, [pdf, onPageCount])

    useEffect(() => {
        if (!document) return
        let active = true
        let task: RenderTask | undefined
        let page: PDFPageProxy | undefined
        async function render() {
            try {
                page = await document!.getPage(pageIndex + 1)
                if (!active) return
                setRendering(true)
                setError(null)
                const canvas = canvasRef.current!
                const original = page.getViewport({scale: 1})
                const viewport = page.getViewport({scale: 800 / original.width * Math.min(window.devicePixelRatio || 1, 2)})
                canvas.width = Math.ceil(viewport.width)
                canvas.height = Math.ceil(viewport.height)
                task = page.render({canvas, viewport})
                await task.promise
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : 'Unable to render PDF page.')
            } finally {
                page?.cleanup()
                if (active) setRendering(false)
            }
        }
        void render()
        return () => {
            active = false
            task?.cancel()
        }
    }, [document, pageIndex])

    return (
        <Box sx={{width: '100%', display: 'grid', justifyItems: 'center', gap: 2}}>
            {rendering && <CircularProgress aria-label="Rendering PDF preview"/>}
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="canvas" ref={canvasRef} role="img" aria-label={`PDF preview, page ${pageIndex + 1}`}
                 sx={{display: rendering || error ? 'none' : 'block', width: '100%', maxWidth: 800, height: 'auto',
                     bgcolor: 'white', boxShadow: '0 3px 12px #0003'}}/>
        </Box>
    )
}
