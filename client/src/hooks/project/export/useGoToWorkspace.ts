import {useNavigate, useParams} from '@tanstack/react-router';

export function useGoToWorkspace() {
    const {userId, projectName} = useParams({from: '/$userId/$projectName/export'});
    const navigate = useNavigate();
    return () => navigate({to: '/$userId/$projectName', params: {userId, projectName}});
}
