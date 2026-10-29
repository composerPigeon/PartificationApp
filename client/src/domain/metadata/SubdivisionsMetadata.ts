import {JsonProperty, Serializable} from 'ts-jackson';
import type {ScorePage} from '../ScorePage.ts';
import type {StavesCollection} from '../StavesCollection.ts';
import type {Staff} from '../Staff.ts';

@Serializable()
export class StaffMetadata {
    @JsonProperty({type: Array, elementType: Number})
    bbox: [number, number, number, number];

    constructor(bbox: [number, number, number, number] = [0, 0, 0, 0]) {
        this.bbox = bbox;
    }
}

/** Staves are numbered from 1 in the collection's Y order. */
export class StavesMetadata {
    [number: string]: StaffMetadata;

    public static create(staves: StavesCollection): StavesMetadata {
        return Object.fromEntries([...staves].map(staff => [staff.order, new StaffMetadata([...staff.bbox])]));
    }
}

function boundingBox(staves: Staff[]): StaffMetadata {
    const left = Math.min(...staves.map(staff => staff.x));
    const top = Math.min(...staves.map(staff => staff.y));
    const right = Math.max(...staves.map(staff => staff.x + staff.width));
    const bottom = Math.max(...staves.map(staff => staff.y + staff.height));
    return new StaffMetadata([left, top, right - left, bottom - top]);
}


@Serializable()
export class SubdivisionsMetadata {
    @JsonProperty({path: 'Staves', type: Object, elementType: StaffMetadata})
    staves: StavesMetadata;

    @JsonProperty({path: 'Grandstaves', type: Object, elementType: StaffMetadata})
    grandStaves: Record<string, StaffMetadata>;

    @JsonProperty({path: 'Systems', type: Object, elementType: StaffMetadata})
    systems: Record<string, StaffMetadata>;

    constructor(staves: StavesMetadata = {}, grandStaves: Record<string, StaffMetadata> = {}, systems: Record<string, StaffMetadata> = {}) {
        this.staves = staves;
        this.grandStaves = grandStaves;
        this.systems = systems;
    }

    public static create(page: ScorePage): SubdivisionsMetadata {
        const metadata = new SubdivisionsMetadata(StavesMetadata.create(page.staves));

        for (const grand of page.grandStaves.values()) {
            const members = [grand.firstStaff, grand.secondStaff].sort((a, b) => a.order - b.order);
            metadata.grandStaves[`${members[0].order}-${members[1].order}`] = boundingBox(members);
        }
        for (const system of page.systems.values()) {
            const members = [...system.staves.values()].sort((a, b) => a.order - b.order);
            if (members.length) metadata.systems[`${members[0].order}-${members[members.length - 1].order}`] = boundingBox(members);
        }
        return metadata;
    }

}
