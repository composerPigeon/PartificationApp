import type {Project} from "../../domain/Project.ts";
import type {ProjectPage} from "../../domain";


export interface StorageService {
    createProjectDir(projectId: string): Promise<void>;

    saveProject(project: Project): Promise<void>;
    savePage(page: ProjectPage): Promise<void>;

    loadProjects(): Promise<Project[]>;
    loadPages(projectId: string): Promise<ProjectPage[]>;

    deleteProject(projectId: string): Promise<void>;
}