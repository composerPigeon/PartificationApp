import type {InteractionActivityState} from '../../init/useInitInteractionActivity';
import type {KonvaEventObject} from 'konva/lib/Node';
import type {ScorePage} from '../../../../domain';
import type {ProjectState} from '../../../project';
import type {PermissionsState} from '../../states/PermissionsState';
import type {InteractionModeState} from '../states/InteractionModeState';
import type {ScorePageDomainState} from '../states/ScorePageDomainState';
import type {InstrumentEditingState} from './useInitInstrumentEditing';
import {recommendInstrument} from '../../../../services/projects/recommendInstrument';

type PageEvent = KonvaEventObject<MouseEvent>;

export function useInitStaffCreation(projectState: ProjectState, domain: ScorePageDomainState,
    interactionMode: InteractionModeState, permissions: PermissionsState, instrumentEditing: InstrumentEditingState, activity: InteractionActivityState, page: ScorePage) {
    const {project, pages} = projectState;
    const {pendingStaff, setPendingStaff} = activity;

    return {
        pendingStaff,
        onMouseDown(event: PageEvent) {
            if (event.evt.button !== 0 || !permissions.canManipulateStaff
                || interactionMode.modeFor(event.target) !== 'add-staff') return;
            const pointer = event.target.getStage()?.getRelativePointerPosition();
            if (!pointer) return;
            interactionMode.mode = 'add-staff';
            setPendingStaff({startY: pointer.y, endY: pointer.y});
        },
        onMouseUp(event: PageEvent) {
            if (!pendingStaff || event.evt.button !== 0) return;
            setPendingStaff(null);
            const pointer = event.target.getStage()?.getRelativePointerPosition();
            if (!pointer || !permissions.canFinishCreation) return;
            const centerY = (pendingStaff.startY + pointer.y) / 2;
            const height = Math.abs(pointer.y - pendingStaff.startY);
            if (!domain.canPlaceStaff(centerY, height)) return;
            const instrument = recommendInstrument(project, pages, page, centerY);
            if (instrument) domain.createStaff(centerY, height, instrument);
            else instrumentEditing.requestInstrument(centerY, height, {top: event.evt.clientY, left: event.evt.clientX});
        },
        onMouseMove(event: PageEvent) {
            if (!pendingStaff || !permissions.canFinishCreation) return;
            const pointer = event.target.getStage()?.getRelativePointerPosition();
            if (pointer) setPendingStaff({...pendingStaff, endY: pointer.y});
        },
        onMouseLeave() { setPendingStaff(null); },
    };
}

export type StaffCreationState = ReturnType<typeof useInitStaffCreation>;
