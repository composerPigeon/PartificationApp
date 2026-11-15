import type {ScorePage} from '../../../domain';

export interface PermissionsState {
    readonly canvasError: boolean;
    readonly canInteract: boolean;
    readonly canChangeTool: boolean;
    readonly canManipulateStaff: boolean;
    readonly canFinishCreation: boolean;
    reportCanvasError(page: ScorePage): void;
}
