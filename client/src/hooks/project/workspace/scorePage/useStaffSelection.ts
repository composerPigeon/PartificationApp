import {useWorkspacePage} from '../useWorkspacePage';

export function useStaffSelection() {
    return useWorkspacePage().selection;
}
