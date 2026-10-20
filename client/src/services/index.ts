import {type IServerProxy, ServerProxy} from "./server/ServerProxy.ts";
import {type IProjectManager, ProjectManager} from "./projects/ProjectManager.ts";
import {ExportPdfService, type IExportPdfService} from './pdf/export/ExportPdfService.ts';

export const serverProxy: IServerProxy = new ServerProxy();
export const projectManager: IProjectManager = new ProjectManager();
export const exportPdfService: IExportPdfService = new ExportPdfService(projectManager);
