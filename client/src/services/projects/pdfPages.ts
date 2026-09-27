import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

export async function* pdfPages(file: File, onProgress: (page: number, total: number) => void): AsyncGenerator<Blob> {
  const assets = `${import.meta.env.BASE_URL}pdfjs/`
  const task = getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    cMapUrl: `${assets}cmaps/`, cMapPacked: true,
    standardFontDataUrl: `${assets}standard_fonts/`,
    wasmUrl: `${assets}wasm/`, iccUrl: `${assets}iccs/`,
  })
  try {
    const pdf = await task.promise
    for (let number = 1; number <= pdf.numPages; number++) {
      onProgress(number, pdf.numPages)
      const page = await pdf.getPage(number)
      const original = page.getViewport({ scale: 2 })
      // Bound canvas allocation for unusually large page dimensions.
      const scale = Math.min(1, 4096 / Math.max(original.width, original.height))
      const viewport = page.getViewport({ scale: 2 * scale })
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      try {
        await page.render({ canvas, viewport }).promise
        const png = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Unable to convert PDF page to PNG.')), 'image/png')
        })
        yield png
      } finally {
        canvas.width = 0
        canvas.height = 0
        page.cleanup()
      }
    }
  } finally {
    await task.destroy()
  }
}
