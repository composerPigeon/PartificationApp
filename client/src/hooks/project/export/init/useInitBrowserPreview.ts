import {useEffect, useState} from 'react';

export function useInitBrowserPreview(pdf: Blob | null) {
    const [preview, setPreview] = useState<{pdf: Blob; url: string} | null>(null);
    const url = preview?.pdf === pdf ? preview?.url : undefined;
    useEffect(() => {
        if (!pdf) return;
        const url = URL.createObjectURL(pdf);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Publish the browser URL created for this PDF.
        setPreview({pdf, url});
        return () => URL.revokeObjectURL(url);
    }, [pdf]);
    return {
        available: !!url,
        open() { if (url) window.open(url, '_blank', 'noopener,noreferrer'); },
    };
}
export type BrowserPreviewState = ReturnType<typeof useInitBrowserPreview>;
