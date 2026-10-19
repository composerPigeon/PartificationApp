import type {ScorePageMetadata} from '../../domain/metadata/ScorePageMetadata.ts';
import type {SubdivisionsMetadata} from '../../domain/metadata/SubdivisionsMetadata.ts';

/**
 * Page data passed between ProjectManager and storage, combining the image and
 * metadata from separate files. ProjectManager rebuilds the domain ScorePage
 * and resolves instrument references using the project's instruments.
 * This interface does not represent an additional file on disk.
 */
export interface StoredScorePage {
    projectId: string;
    number: number;
    blob: Blob;
    metadata: ScorePageMetadata;
    subdivisions: SubdivisionsMetadata;
}
