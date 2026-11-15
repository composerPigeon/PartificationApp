import {Box, Tooltip} from '@mui/material';
import {Link, useParams} from '@tanstack/react-router';
import type {MouseEvent} from 'react';
import {ButtonIcon} from '../buttons/ButtonIcon';
import {useGoToExport} from '../../hooks/project/workspace/useGoToExport';
import {useGoToWorkspace} from '../../hooks/project/export';

export function WorkspaceSectionNavigation() {
    const onExport = useGoToExport();
    return <ProjectSectionNavigation onExport={onExport}/>;
}

export function ExportSectionNavigation() {
    const onWorkspace = useGoToWorkspace();
    return <ProjectSectionNavigation onWorkspace={onWorkspace}/>;
}

function follow(action: (() => Promise<void>) | undefined, event: MouseEvent<HTMLElement>) {
    if (!action || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void action();
}

function ProjectSectionNavigation({onWorkspace, onExport}: {
    onWorkspace?(): Promise<void>;
    onExport?(): Promise<void>;
}) {
    const {userId, projectName} = useParams({from: '/$userId/$projectName'});
    const params = {userId, projectName};
    const linkSx = {
        width: 40, height: 40, borderRadius: '9px', color: 'secondary.dark',
        bgcolor: 'action.selected', border: '1px solid', borderColor: 'divider', boxSizing: 'border-box',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
        transition: 'background-color 150ms, color 150ms',
        '&:hover': {bgcolor: 'action.hover'},
        '&:focus-visible': {outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2},
        '&[data-status="active"]': {
            color: 'secondary.contrastText', bgcolor: 'secondary.main', borderColor: 'secondary.main',
            boxShadow: '0 2px 8px #0002',
            '&:hover': {bgcolor: 'secondary.dark'},
        },
    };
    return <Box component="nav" aria-label="Project sections" sx={{display: 'flex', gap: 0.5, '& a': linkSx}}>
        <Tooltip title="Workspace">
            <Link to="/$userId/$projectName" params={params}
                        activeOptions={{exact: true}} aria-label="Workspace"
                        onClick={event => follow(onWorkspace, event)}>
                <ButtonIcon name="workspace"/>
            </Link>
        </Tooltip>
        <Tooltip title="Export">
            <Link to="/$userId/$projectName/export" params={params}
                        activeOptions={{exact: true}} aria-label="Export"
                        onClick={event => follow(onExport, event)}>
                <ButtonIcon name="export-score"/>
            </Link>
        </Tooltip>
    </Box>;
}
