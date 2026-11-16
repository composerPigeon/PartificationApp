export function downloadFile(file: Blob, fileName: string): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/[<>:"/\\|?*]/g, '_');
    document.body.appendChild(link);
    try {
        link.click();
    } finally {
        link.remove();
        // Allow the browser to finish consuming the download URL.
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
}
