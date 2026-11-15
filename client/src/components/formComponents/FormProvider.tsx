import type {PropsWithChildren} from 'react';
import {ViewContext} from '../../hooks/useView';
import {SubmittingContext, useInitForm} from '../../hooks/form';

export function FormProvider({children}: PropsWithChildren) {
    const {viewState, submitting} = useInitForm();
    return <ViewContext.Provider value={viewState}>
        <SubmittingContext.Provider value={submitting}>{children}</SubmittingContext.Provider>
    </ViewContext.Provider>;
}
