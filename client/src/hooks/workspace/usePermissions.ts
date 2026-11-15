import {useWorkspacePage} from './useWorkspacePage';

export function usePermissions() {
    return useWorkspacePage().permissions;
}
