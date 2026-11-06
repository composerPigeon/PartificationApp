import type {BaseState} from '../../states';

export interface ProjectSaveState extends BaseState {
    get saving(): boolean;
    get hasChanges(): boolean;

    pageChanged(): void;
    save(): Promise<boolean>;
}
