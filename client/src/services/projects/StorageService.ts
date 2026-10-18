import type {Project} from "../../domain";
import type {ScorePage} from "../../domain";
import type {MusicorpusMetadata} from "../../domain/metadata/MusicorpusMetadata.ts";


export interface StorageService {
    createProjectDir(projectId: string): Promise<void>;

    saveProject(project: Project): Promise<void>;
    saveMusicorpus(projectId: string, musicorpus: MusicorpusMetadata): Promise<void>;
    savePage(page: ScorePage): Promise<void>;

    loadProjects(): Promise<Project[]>;
    loadPages(projectId: string): Promise<ScorePage[]>;

    deleteProject(projectId: string): Promise<void>;
}