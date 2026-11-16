import {zip} from 'fflate';

export async function createExportArchive(files: readonly {pdf: Blob; fileName: string}[]): Promise<Blob> {
    const entries: Record<string, Uint8Array> = Object.create(null);
    for (const {pdf, fileName} of files) {
        const safeName = fileName.replace(/[<>:"/\\|?*]/g, '_');
        let name = safeName;
        let suffix = 2;
        while (name in entries) name = `${safeName.replace(/\.pdf$/i, '')}_${suffix++}.pdf`;
        entries[name] = new Uint8Array(await pdf.arrayBuffer());
    }
    return new Promise((resolve, reject) => {
        // PDFs already compress their contents; store them without recompressing.
        zip(entries, {level: 0}, (error, archive) => {
            if (error) reject(error);
            else resolve(new Blob([new Uint8Array(archive)], {type: 'application/zip'}));
        });
    });
}
