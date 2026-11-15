import type {Project, ScorePage} from '../../../domain';
export interface ProjectState {
    get project(): Project;
    get pages(): ScorePage[];
}
