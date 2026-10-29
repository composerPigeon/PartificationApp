import type {Project} from "../../domain";
import type {StoredScorePage} from './StoredScorePage.ts';
import type {StoredStaffImage} from './StoredStaffImage.ts';
import type {MusicorpusMetadata} from "../../domain/metadata/MusicorpusMetadata.ts";


export interface StorageService {
    createProjectDir(projectId: string): Promise<void>;

    saveProject(project: Project): Promise<void>;
    saveMusicorpus(projectId: string, musicorpus: MusicorpusMetadata): Promise<void>;
    /** Saves metadata; pass true to also create the page folder and image. */
    savePage(page: StoredScorePage, create?: boolean): Promise<void>;
    saveStaffImages(projectId: string, pageNumber: number, images: AsyncIterable<StoredStaffImage>): Promise<void>;

    loadProjects(): Promise<Project[]>;
    loadPages(projectId: string): Promise<StoredScorePage[]>;
    loadStaffImage(projectId: string, pageNumber: number, order: number): Promise<Blob>;

    deleteProject(projectId: string): Promise<void>;
}
