import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class Project {
    @JsonProperty()
    id: string;

    @JsonProperty({path: "project_name"})
    projectName: string;

    @JsonProperty({path: "directory_name"})
    directoryName: string;

    @JsonProperty({path: "page_count"})
    pageCount: number;

    constructor(projectId: string = "", projectName: string = "", directoryName: string = "", pageCount: number = 0) {
        this.id = projectId;
        this.projectName = projectName;
        this.directoryName = directoryName;
        this.pageCount = pageCount;
    }
}
