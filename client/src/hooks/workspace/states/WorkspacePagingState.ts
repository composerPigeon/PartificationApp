import type {ScorePage} from '../../../domain';

export interface WorkspacePagingState {
    get pageIndex(): number;
    get pageCount(): number;
    get currentPage(): ScorePage | undefined;

    previous(): void;
    next(): void;
    reset(): void;
}
