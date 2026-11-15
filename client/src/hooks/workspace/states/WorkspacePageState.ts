import type {ScorePage} from '../../../domain';
import type {InstrumentEditingState, StaffCreationState, StaffDraggingState, InteractionModeState, ScorePageDomainState, StaffSelectionState} from '../scorePage';

import type {PermissionsState} from './PermissionsState';

export interface WorkspacePageState {
    readonly currentPage: ScorePage;
    permissions: PermissionsState;
    instrumentEditing: InstrumentEditingState;
    staffCreation: StaffCreationState;
    staffDragging: StaffDraggingState;
    selection: StaffSelectionState;
    interactionMode: InteractionModeState;
    domain: ScorePageDomainState;
    deleteStaff(id: number): boolean;
}
