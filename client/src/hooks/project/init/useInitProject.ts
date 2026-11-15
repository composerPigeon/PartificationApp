import type {Project, ScorePage} from '../../../domain';
import type {ProjectState} from '../states';

// Initializes shared state only after the project and pages have loaded.
export function useInitProject(project: Project, pages: ScorePage[]): ProjectState {
    return {
        get project() { return project; },
        get pages() { return pages; },
    };
}
