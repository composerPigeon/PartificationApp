import type {SubmitEvent} from 'react';
import type {FormBaseState} from '../../states';

export interface CreateProjectState extends FormBaseState {
    get name(): string;
    set name(value: string);

    get title(): string;
    set title(value: string);

    get subtitle(): string;
    set subtitle(value: string);

    get author(): string;
    set author(value: string);

    get authorDate(): string;
    set authorDate(value: string);

    get genre(): string;
    set genre(value: string);

    get allowLayoutModelTraining(): boolean;
    set allowLayoutModelTraining(value: boolean);

    get file(): File | null;
    set file(value: File | null);
    get progress(): string;

    handleCreateProject: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
}
