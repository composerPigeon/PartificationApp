import {ButtonIcon} from '../buttons/ButtonIcon'
import {Box, CircularProgress, IconButton, Paper, Typography} from '@mui/material';
import {Link} from '@tanstack/react-router';
import type {Project} from '../../domain/Project';
import {useAuth} from '../../hooks/auth/useAuth';

interface ProjectCardProps {
    project: Project;
    deleting: boolean;
    onDelete: (project: Project) => void;
}

export default function ProjectCard({project, deleting, onDelete}: ProjectCardProps) {
    const {currentAccount} = useAuth();
    if (!currentAccount) return null;
    return (
        <Paper component="li" variant="outlined" sx={{display: 'flex', alignItems: 'center', pr: 2}}>
            <Link to="/$userId/$projectName" params={{userId: currentAccount.userId, projectName: project.projectName}} state={{project}}
                  style={{flex: 1, minWidth: 0, color: 'inherit', textDecoration: 'none'}}>
                <Box sx={{
                    p: 3,
                    color: 'inherit',
                    textDecoration: 'none',
                    borderRadius: 3,
                    '&:hover': {bgcolor: 'action.hover'},
                }}>
                    <Typography variant="h6" sx={{color: 'primary.main', overflowWrap: 'anywhere'}}>
                        {project.projectName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {project.pageCount} {project.pageCount === 1 ? 'page' : 'pages'}
                    </Typography>
                </Box>
            </Link>
            <IconButton color="primary" aria-label={`Delete ${project.projectName}`} disabled={deleting}
                        onClick={() => onDelete(project)}>
                {deleting ? <CircularProgress size={24} color="inherit"/> : (
                    <ButtonIcon name="delete" aria-hidden="true"/>
                )}
            </IconButton>
        </Paper>
    );
}
