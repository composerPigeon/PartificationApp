import {useState} from 'react';
import type {ScorePage} from '../../../../domain';
import type {PermissionsState} from '../states/PermissionsState';

import type {InteractionActivityState} from './useInitInteractionActivity';

export function useInitPermissions(page: ScorePage,
    activity: InteractionActivityState): PermissionsState {
    const [canvasError, setCanvasError] = useState(false);
    const available = !canvasError;
    const idle = available && !activity.pendingStaff && !activity.instrumentForm;

    return {
        get canvasError() { return canvasError; },
        get canInteract() { return available; },
        get canChangeTool() { return idle; },
        get canManipulateStaff() { return idle && !activity.staffIds.size; },
        get canFinishCreation() {
            return available && !activity.staffIds.size && !activity.instrumentForm;
        },
        reportCanvasError(sourcePage: ScorePage) {
            if (sourcePage === page) setCanvasError(true);
        },
    };
}
