import {Alert, Button} from '@mui/material';
import {useWorkspaceSave} from '../../hooks/project/workspace';

export function ProjectSaveStatus() {
    const saveState = useWorkspaceSave();
    if (!saveState.error) return null;
    return <Alert severity="error" action={
        <Button color="inherit" onClick={() => { void saveState.save(); }} disabled={saveState.saving}>Retry save</Button>
    }>{saveState.error}</Alert>;
}
