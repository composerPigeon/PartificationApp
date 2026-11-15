import {useInitViewState} from '../../init/useInitViewState';
import {useInitSubmitting} from './useInitSubmitting';

export function useInitForm() {
    const viewState = useInitViewState();
    const submitting = useInitSubmitting(viewState);
    return {viewState, submitting};
}
