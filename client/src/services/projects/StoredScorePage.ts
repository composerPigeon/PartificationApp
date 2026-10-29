import {ScorePageMetadata} from '../../domain/metadata/ScorePageMetadata.ts';
import {SubdivisionsMetadata} from '../../domain/metadata/SubdivisionsMetadata.ts';
import {ScorePage} from "../../domain";

/**
 * Page data passed between ProjectManager and storage, combining the image and
 * metadata from separate files. ProjectManager rebuilds the domain ScorePage
 * and resolves instrument references using the project's instruments.
 * This interface does not represent an additional file on disk.
 */
export class StoredScorePage {
    projectId: string;
    number: number;
    blob: Blob;
    metadata: ScorePageMetadata;
    subdivisions: SubdivisionsMetadata;

    private constructor(projectId: string, number: number, blob: Blob,
                        metadata: ScorePageMetadata, subdivisions: SubdivisionsMetadata) {
        this.projectId = projectId;
        this.number = number;
        this.blob = blob;
        this.metadata = metadata;
        this.subdivisions = subdivisions
    }

    public asPage(): ScorePage {
        let page = new ScorePage(
            this.projectId,
            this.number,
            this.metadata.width,
            this.metadata.height,
            this.blob,
        )
        page.leftDivider.x = this.metadata.leftDivider.x ?? 0
        page.rightDivider.x = this.metadata.rightDivider.x ?? page.width;
        return page;
    }

    public static fromPage(page: ScorePage): StoredScorePage {
        return new StoredScorePage(
            page.projectId,
            page.number,
            page.blob,
            ScorePageMetadata.create(page),
            SubdivisionsMetadata.create(page)
        )
    }

    public static fromDirectory(projectId: string, number: number, blob: Blob,
                        metadata: ScorePageMetadata, subdivisions: SubdivisionsMetadata) {
        return new StoredScorePage(projectId, number, blob, metadata, subdivisions)
    }
 }
