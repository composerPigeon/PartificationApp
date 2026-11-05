import type {BaseState} from '../../states/BaseState.ts';

export interface ProjectSaveState extends BaseState {
    get saving(): boolean;
    get hasChanges(): boolean;

    pageChanged(): void;
    save(): Promise<boolean>;
}
