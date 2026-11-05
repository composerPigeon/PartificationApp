import type {Project, ScorePage} from '../../../domain';
import {useBaseState} from '../../useBaseState.ts';
import type {ProjectState} from '../states/ProjectState.ts';

// Initializes shared state only after the project and pages have loaded.
export function useInitProjectState(project: Project, pages: ScorePage[]): ProjectState {
    const base = useBaseState();
    return base.extend({
        get project() { return project; },
        get pages() { return pages; },
    });
}
