import type {PagingState} from '../../states';
import type {ProjectState} from '../../project';
import type {WorkspacePagingState} from '../states/WorkspacePagingState';

export function useInitWorkspacePaging(paging: PagingState, projectState: ProjectState): WorkspacePagingState {
    const {pages} = projectState;
    if (paging.pageCount !== pages.length) {
        paging.pageCount = pages.length;
    }

    return {
        get pageIndex() { return paging.pageIndex; },
        get pageCount() { return paging.pageCount; },
        get currentPage() { return pages[paging.pageIndex]; },
        previous: paging.previous,
        next: paging.next,
        reset: paging.reset,
    };
}
