import {type IServerProxy, ServerProxy} from "./server/ServerProxy.ts";
import {type IProjectManager, ProjectManager} from "./projects/ProjectManager.ts";
import {ExportPdfService, type IExportPdfService} from './pdf/export/ExportPdfService.ts';
import {AuthorisationService, type IAuthorisationService} from "./auth/AuthorisationService.ts";
export {browserStorage} from './dataAccess';

export const authService: IAuthorisationService = new AuthorisationService();
export const serverProxy: IServerProxy = new ServerProxy();
export const projectManager: IProjectManager = new ProjectManager();
export const exportPdfService: IExportPdfService = new ExportPdfService(projectManager);
