import type {SubmitEvent} from 'react';

export interface CreateProjectState {
    get error(): string | null;
    set error(value: string | null);
    get isSubmitting(): boolean;
    set isSubmitting(value: boolean);
    get isIncomplete(): boolean;

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
