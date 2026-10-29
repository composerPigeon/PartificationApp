import {Outlet, createRootRoute, createRoute, createRouter, notFound} from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import LogInPage from './pages/auth/LogInPage.tsx'
import SignUpPage from './pages/auth/SignUpPage'
import ProfilePage from './pages/settings/ProfilePage'
import ProjectsPage from './pages/projects/ProjectsPage.tsx'
import CreateProjectPage from './pages/projects/CreateProjectPage.tsx'
import ProjectWorkspacePage from './pages/projects/ProjectWorkspacePage.tsx'
import ProjectExportPage from './pages/projects/ProjectExportPage.tsx'
import MapDirectoryPage from "./pages/settings/MapDirectoryPage.tsx";
import type {Project} from "./domain";
import {authService, projectManager} from './services';

async function loadProject({userId, projectName}: {userId: string; projectName: string}) {
    if (authService.currentAccount?.userId !== userId) throw notFound();
    const projects = await projectManager.loadProjects();
    const project = projects.find(project => project.projectName === projectName);
    if (!project) throw notFound();
    return {project};
}

const rootRoute = createRootRoute({
    component: Outlet,
})

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LogInPage,
})

const signUpRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: SignUpPage,
})

const mapDirectoryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/mapDirectory',
    component: MapDirectoryPage,
})

const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/profile',
    component: ProfilePage,
})

const projectsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/projects',
    component: ProjectsPage,
})

const createProjectRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/projects/new',
    component: CreateProjectPage,
})

const detailProjectRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/$userId/$projectName',
    loader: ({params}) => loadProject(params),
    component: ProjectWorkspacePage,
})

const exportRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/$userId/$projectName/export',
    loader: ({params}) => loadProject(params),
    component: ProjectExportPage,
})

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, signUpRoute, mapDirectoryRoute, profileRoute, projectsRoute, createProjectRoute, detailProjectRoute, exportRoute])

export const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }

    interface HistoryState {
        project?: Project
    }
}
