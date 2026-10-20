export interface ConvertedPdfPage {
    blob: Blob
    width: number
    height: number
}

export interface IConvertPdfPagesService {
    convert(pdf: File, onProgress: (count: number, total: number) => void): Promise<AsyncIterable<ConvertedPdfPage>>
}

export class ConvertPdfPagesService implements IConvertPdfPagesService {
    async convert(pdf: File, onProgress: (count: number, total: number) => void): Promise<AsyncIterable<ConvertedPdfPage>> {
        const {convertPdfPages} = await import('./convertPdfPages.ts')
        return convertPdfPages(pdf, onProgress);
    }
}
