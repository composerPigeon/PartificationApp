import {useNavigate, useParams} from '@tanstack/react-router';
import {useWorkspaceSave} from './useWorkspaceSave';

export function useGoToExport() {
    const {userId, projectName} = useParams({from: '/$userId/$projectName'});
    const navigate = useNavigate();
    const saveState = useWorkspaceSave();
    return async () => {
        if (await saveState.save()) {
            await navigate({to: '/$userId/$projectName/export', params: {userId, projectName}});
        }
    };
}
