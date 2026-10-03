import type {Project} from "../../domain";
import type {ProjectPage} from "../../domain";
import type {MusicorpusMetadata} from "../../domain/MusicorpusMetadata.ts";


export interface StorageService {
    createProjectDir(projectId: string): Promise<void>;

    saveProject(project: Project): Promise<void>;
    saveMusicorpus(projectId: string, musicorpus: MusicorpusMetadata): Promise<void>;
    savePage(page: ProjectPage): Promise<void>;

    loadProjects(): Promise<Project[]>;
    loadPages(projectId: string): Promise<ProjectPage[]>;

    deleteProject(projectId: string): Promise<void>;
}