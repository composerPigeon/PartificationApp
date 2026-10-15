import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class MusicorpusMetadata {
    @JsonProperty({path: "musicorpus_version"})
    version: string;

    @JsonProperty({path: "full_institution_name"})
    fullInstitutionName: string;

    @JsonProperty({path: "short_institution_name"})
    shortInstitutionName: string;

    @JsonProperty({path: "institution_url"})
    institutionUrl: string | null;

    @JsonProperty({path: "full_dataset_name"})
    fullDatasetName: string;

    @JsonProperty({path: "short_dataset_name"})
    shortDatasetName: string;

    @JsonProperty({path: "dataset_url"})
    datasetUrl: string | null;

    @JsonProperty({path: "dataset_version"})
    datasetVersion: string;

    @JsonProperty({path: "created_at"})
    createdAt: string;

    @JsonProperty({path: "author_emails"})
    authorEmails: string[]

    constructor(version: string, fullInstitutionName: string, shortInstitutionName: string, institutionUrl: string | null,
        fullDatasetName: string, shortDatasetName: string, datasetUrl: string | null, datasetVersion: string,
        createdAt: string, authorEmails: string[]
    ) {
        this.version = version;
        this.fullInstitutionName = fullInstitutionName;
        this.shortInstitutionName = shortInstitutionName;
        this.institutionUrl = institutionUrl;
        this.fullDatasetName = fullDatasetName;
        this.shortDatasetName = shortDatasetName;
        this.datasetUrl = datasetUrl;
        this.datasetVersion = datasetVersion;
        this.createdAt = createdAt;
        this.authorEmails = authorEmails;
    }

    static createNew(projectName: string): MusicorpusMetadata {
        return new MusicorpusMetadata(
            "1.0",
            "partification-app",
            "partification-app",
            null, //TODO: after app publication add url
            projectName,
            projectName,
            null,
            "1.0",
            "Now_xD",
            []
        )
    }
}