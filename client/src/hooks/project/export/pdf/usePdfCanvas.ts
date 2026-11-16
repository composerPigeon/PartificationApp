/* eslint-disable react-hooks/immutability -- Mode accessors delegate to React state setters. */
import {useEffect, useEffectEvent, useRef, useState} from 'react';
import type {PDFDocumentProxy, PDFPageProxy, RenderTask} from 'pdfjs-dist';
import {useExportInteractionMode} from '../useExportInteractionMode';

export function usePdfCanvas(document: PDFDocumentProxy | null, pageIndex: number) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const interactionMode = useExportInteractionMode();
    const renderedDocument = useRef<PDFDocumentProxy | null>(null);
    const onRendered = useEffectEvent((document: PDFDocumentProxy) => {
        if (renderedDocument.current === document) return;
        renderedDocument.current = document;
        interactionMode.mode = 'settings';
    });
    const [result, setResult] = useState<{document: PDFDocumentProxy; pageIndex: number; rendering: boolean; error: string | null} | null>(null);
    useEffect(() => {
        if (!document) return;
        let active = true;
        let task: RenderTask | undefined;
        let page: PDFPageProxy | undefined;
        async function render() {
            setResult({document: document!, pageIndex, rendering: true, error: null});
            try {
                page = await document!.getPage(pageIndex + 1);
                if (!active) return;
                const canvas = canvasRef.current!;
                const original = page.getViewport({scale: 1});
                const viewport = page.getViewport({scale: 800 / original.width * Math.min(window.devicePixelRatio || 1, 2)});
                canvas.width = Math.ceil(viewport.width);
                canvas.height = Math.ceil(viewport.height);
                task = page.render({canvas, viewport});
                await task.promise;
                if (active) {
                    setResult({document: document!, pageIndex, rendering: false, error: null});
                    onRendered(document!);
                }
            } catch (error) {
                if (active) setResult({document: document!, pageIndex, rendering: false, error: error instanceof Error ? error.message : 'Unable to render PDF page.'});
            } finally {
                page?.cleanup();
            }
        }
        void render();
        return () => { active = false; task?.cancel(); };
    }, [document, pageIndex]);
    const current = result?.document === document && result?.pageIndex === pageIndex;
    return {canvasRef, rendering: !!document && (!current || result.rendering), error: current ? result.error : null};
}
