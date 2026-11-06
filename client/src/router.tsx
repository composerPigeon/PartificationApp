import {Outlet, createRootRoute, createRoute, createRouter} from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import LogInPage from './pages/auth/LogInPage.tsx'
import SignUpPage from './pages/auth/SignUpPage'
import ProfilePage from './pages/settings/ProfilePage'
import ProjectsPage from './pages/projects/ProjectsPage.tsx'
import CreateProjectPage from './pages/projects/CreateProjectPage.tsx'
import ProjectWorkspacePage from './pages/projects/ProjectWorkspacePage.tsx'
import ProjectExportPage from './pages/projects/ProjectExportPage.tsx'
import MapDirectoryPage from "./pages/settings/MapDirectoryPage.tsx";
import {ProjectRouter} from './components/projects/ProjectRouter.tsx';

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
    path: '/project',
    component: ProjectsPage,
})

const createProjectRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/project/new',
    component: CreateProjectPage,
})

const projectRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/$userId/$projectName',
    component: ProjectRouter,
})

const detailProjectRoute = createRoute({
    getParentRoute: () => projectRoute,
    path: '/',
    component: ProjectWorkspacePage,
})

const exportRoute = createRoute({
    getParentRoute: () => projectRoute,
    path: 'export',
    component: ProjectExportPage,
})

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, signUpRoute, mapDirectoryRoute, profileRoute, projectsRoute, createProjectRoute,
    projectRoute.addChildren([detailProjectRoute, exportRoute])])

export const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }

}
