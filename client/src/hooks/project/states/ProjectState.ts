import type {Project, ScorePage} from '../../../domain';
import type {BaseState} from '../../states';

export interface ProjectState extends BaseState {
    get project(): Project;
    get pages(): ScorePage[];
}
