import type {Project, ScorePage} from '../../../domain';
import type {BaseState} from '../../states/BaseState.ts';

export interface ProjectState extends BaseState {
    get project(): Project;
    get pages(): ScorePage[];
}
