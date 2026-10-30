import type {Project} from "../../domain";
import type {StoredScorePage} from '../projects/StoredScorePage.ts';
import type {StoredStaffImage} from '../projects/StoredStaffImage.ts';
import type {MusicorpusMetadata} from "../../domain/metadata/MusicorpusMetadata.ts";
import type {RootMetadata} from "../../domain/metadata/RootMetadata.ts";


export interface StorageService {
    createProjectDir(projectId: string): Promise<void>;

    saveProject(project: Project): Promise<void>;
    saveMusicorpus(projectId: string, musicorpus: MusicorpusMetadata): Promise<void>;
    /** Saves metadata; pass true to also create the page folder and image. */
    savePage(page: StoredScorePage, create?: boolean): Promise<void>;
    saveStaffImage(projectId: string, pageNumber: number, image: StoredStaffImage): Promise<void>;
    saveRootMetadata(metadata: RootMetadata): Promise<void>;

    loadProjects(): Promise<Project[]>;
    loadPages(projectId: string): Promise<StoredScorePage[]>;
    loadStaffImage(projectId: string, pageNumber: number, order: number): Promise<Blob>;
    loadRootMetadata(): Promise<RootMetadata>;

    deleteProject(projectId: string): Promise<void>;
}
