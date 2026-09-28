import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class Project {
    @JsonProperty()
    id: string;

    @JsonProperty()
    name: string;

    @JsonProperty({path: "page_count"})
    pageCount: number;

    constructor(id: string = "", name: string = "", pageCount: number = 0) {
        this.id = id;
        this.name = name;
        this.pageCount = pageCount;
    }
}
