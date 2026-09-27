import {type IServerProxy, ServerProxy} from "./server/ServerProxy.ts";
import {type IProjectManager, ProjectManager} from "./projects/ProjectManager.ts";

export const serverProxy: IServerProxy = new ServerProxy();
export const projectManager: IProjectManager = new ProjectManager();