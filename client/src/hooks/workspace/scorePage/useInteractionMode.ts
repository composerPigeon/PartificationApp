import {useWorkspacePage} from '../useWorkspacePage';

export function useInteractionMode() {
    return useWorkspacePage().interactionMode;
}
