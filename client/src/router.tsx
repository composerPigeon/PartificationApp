import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import ProfilePage from './pages/settings/ProfilePage'
import ProjectsPage from './pages/projects/ProjectsPage.tsx'
import CreateProjectPage from './pages/projects/CreateProjectPage.tsx'
import DetailProjectPage from './pages/projects/DetailProjectPage.tsx'
import MapDirectoryPage from "./pages/settings/MapDirectoryPage.tsx";

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
  component: LoginPage,
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
  path: '/projects/$projectId',
  component: DetailProjectPage,
})

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, signUpRoute, mapDirectoryRoute, profileRoute, projectsRoute, createProjectRoute, detailProjectRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
