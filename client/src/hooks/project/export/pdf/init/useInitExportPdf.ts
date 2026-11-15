import {useEffect, useState} from 'react';
import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {usePaging} from '../../../../usePaging';

GlobalWorkerOptions.workerSrc = workerUrl;

export function useInitExportPdf(pdf: Blob | null) {
    const paging = usePaging();
    const [result, setResult] = useState<{pdf: Blob | null; document: PDFDocumentProxy | null; error: string | null}>(
        {pdf: null, document: null, error: null});
    const current = result.pdf === pdf;
    useEffect(() => {
        let active = true;
        let task: ReturnType<typeof getDocument> | undefined;
        // eslint-disable-next-line react-hooks/immutability -- Paging accessors delegate to React state setters.
        paging.pageCount = 0;
        async function load() {
            if (!pdf) return;
            try {
                const data = new Uint8Array(await pdf.arrayBuffer());
                if (!active) return;
                const assets = import.meta.env.BASE_URL + 'pdfjs/';
                task = getDocument({data, cMapUrl: assets + 'cmaps/', cMapPacked: true,
                    standardFontDataUrl: assets + 'standard_fonts/', wasmUrl: assets + 'wasm/', iccUrl: assets + 'iccs/'});
                const document = await task.promise;
                if (active) {
                    paging.pageCount = document.numPages;
                    setResult({pdf, document, error: null});
                }
            } catch (error) {
                if (active) setResult({pdf, document: null, error: error instanceof Error ? error.message : 'Unable to display PDF preview.'});
            }
        }
        void load();
        return () => {
            active = false;
            void task?.destroy().catch(() => {});
        };
        // Paging is stable in ownership; its accessor object is recreated on render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdf]);
    return {paging, document: current ? result.document : null,
        loading: !!pdf && (!current || (!result.document && !result.error)), error: current ? result.error : null};
}
export type ExportPdfState = ReturnType<typeof useInitExportPdf>;
