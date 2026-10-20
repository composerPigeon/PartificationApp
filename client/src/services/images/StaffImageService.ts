import type {StaffBounds} from '../../domain/Staff.ts';
import Konva from 'konva';

export interface IStaffImageService {
    crop(pageImage: Blob, bounds: Iterable<StaffBounds>): AsyncIterable<Blob>;
}

export class StaffImageService implements IStaffImageService {
    /** Decode the original once and yield PNG crops in the supplied staff order. */
    async *crop(pageImage: Blob, bounds: Iterable<StaffBounds>): AsyncIterableIterator<Blob> {
        const regions = [...bounds];
        if (!regions.length) return;

        const image = await createImageBitmap(pageImage);
        let original: Konva.Image | undefined;
        try {
            // Export this image node alone; editor layers and zoom are never involved.
            original = new Konva.Image({image, width: image.width, height: image.height, listening: false});
            for (const {x, y, width, height} of regions) {
                if (![x, y, width, height].every(Number.isFinite) || x < 0 || y < 0
                    || width <= 0 || height <= 0 || x + width > image.width || y + height > image.height) {
                    throw new RangeError('Staff crop must fit inside the original page image.');
                }
                const blob = await original.toBlob({
                    x, y,
                    width: Math.ceil(width),
                    height: Math.ceil(height),
                    pixelRatio: 1,
                    mimeType: 'image/png',
                });
                if (!blob) throw new Error('Unable to encode staff image.');
                yield blob;
            }
        } finally {
            original?.destroy();
            image.close();
        }
    }
}
