import type {InteractionActivityState} from '../../init/useInitInteractionActivity';
import type {ScorePage, Staff} from '../../../../domain';
import type {ProjectState} from '../../../project';
import type {StaffSelectionState} from '../states/StaffSelectionState';
import type {InteractionModeState} from '../states/InteractionModeState';
import type {ScorePageDomainState} from '../states/ScorePageDomainState';
import type {PermissionsState} from '../../states/PermissionsState';
import {recommendInstrument} from '../../../../services/projects/recommendInstrument';

type Position = {top: number, left: number};

export function useInitInstrumentEditing(projectState: ProjectState, domain: ScorePageDomainState,
    interactionMode: InteractionModeState, selection: StaffSelectionState, permissions: PermissionsState, activity: InteractionActivityState, page: ScorePage) {
    const {project, pages} = projectState;
    const {instrumentForm, setInstrumentForm} = activity;

    return {
        instrumentForm,
        requestInstrument(centerY: number, height: number, position: Position) {
            if (permissions.canFinishCreation) setInstrumentForm({centerY, height, position});
        },
        editInstrument(staff: Staff, position: Position) {
            if (!permissions.canChangeTool || !domain.getStaff(staff.id)) return;
            interactionMode.mode = 'select';
            selection.select(staff.id);
            const instrument = recommendInstrument(project, pages, page, staff.y) ?? staff.instrument;
            setInstrumentForm({staffId: staff.id, instrument, position});
        },
        cancelInstrument(staffId?: number) {
            setInstrumentForm(current => staffId === undefined
                || (current && 'staffId' in current && current.staffId === staffId) ? null : current);
        },
        submitInstrument(name: string, shortcut: string) {
            if (!permissions.canInteract || !instrumentForm) return;
            if ('staffId' in instrumentForm && !domain.getStaff(instrumentForm.staffId)) return;
            const instrument = project.getOrCreateInstrument(name, shortcut);
            const saved = 'staffId' in instrumentForm
                ? domain.changeStaffInstrument(instrumentForm.staffId, instrument)
                : domain.createStaff(instrumentForm.centerY, instrumentForm.height, instrument);
            if (saved) setInstrumentForm(null);
        },
    };
}

export type InstrumentEditingState = ReturnType<typeof useInitInstrumentEditing>;
