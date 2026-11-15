export interface ProjectSaveState {
    get error(): string | null;
    get saving(): boolean;
    get hasChanges(): boolean;

    save(): Promise<boolean>;
}
