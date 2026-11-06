import type {BaseState} from '../../states';

export interface ProjectSaveState extends BaseState {
    get saving(): boolean;
    get hasChanges(): boolean;

    save(): Promise<boolean>;
}
