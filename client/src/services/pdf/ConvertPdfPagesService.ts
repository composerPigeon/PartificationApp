export interface IConvertPdfPagesService {
    convert(pdf: File, onProgress: (count: number, total: number) => void): Promise<AsyncIterable<Blob>>
}

export class ConvertPdfPagesService implements IConvertPdfPagesService {
    async convert(pdf: File, onProgress: (count: number, total: number) => void): Promise<AsyncIterable<Blob>> {
        const {convertPdfPages} = await import('./convertPdfPages.ts')
        return convertPdfPages(pdf, onProgress);
    }
}