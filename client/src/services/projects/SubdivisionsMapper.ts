import type {ScorePage} from '../../domain/ScorePage.ts';
import type {SubdivisionsMetadata} from '../../domain/metadata/SubdivisionsMetadata.ts';
import {StaffCollection} from '../../domain/StaffCollection.ts';
import {Staff} from '../../domain/Staff.ts';
import {GrandStaff} from '../../domain/GrandStaff.ts';
import {StaffSystem} from '../../domain/StaffSystem.ts';
import {Instrument} from '../../domain/Instrument.ts';

function rangeMembers(key: string, staves: StaffCollection): Staff[] {
    const match = /^([1-9]\d*)(?:-([1-9]\d*))?$/.exec(key);
    if (!match) throw new Error(`Invalid subdivision range: ${key}.`);
    const first = Number(match[1]);
    const last = Number(match[2] ?? match[1]);
    const members = [...staves].filter(staff => staff.order >= first && staff.order <= last);
    if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last) || last < first || members.length !== last - first + 1) {
        throw new Error(`Subdivision ${key} references missing staves.`);
    }
    return members;
}


export class SubdivisionsMapper {
    /** Instrument references are resolved by ProjectManager from the project's instruments. */
    public static initializePage(page: ScorePage, metadata: SubdivisionsMetadata, instruments: Record<string, Instrument> = {}): void {
        const staves = new StaffCollection();
        for (const [key, entry] of Object.entries(metadata.staves)) {
            const id = Number(key);
            const box = entry.bbox;
            if (!/^[1-9]\d*$/.test(key) || !Number.isSafeInteger(id) || !Array.isArray(box)
                || box.length !== 4 || !box.every(Number.isFinite) || box[2] <= 0 || box[3] <= 0) {
                throw new Error(`Invalid staff metadata: ${key}.`);
            }
            const [x, y, width, height] = box;
            staves.add(new Staff(id, {x, y, width, height}, instruments[key] ?? new Instrument('Unassigned', '')));
        }
        const grandStaves = new Map<number, GrandStaff>();
        for (const key of Object.keys(metadata.grandStaves)) {
            const members = rangeMembers(key, staves);
            if (members.length !== 2) throw new Error(`Grand staff ${key} must reference two staves.`);
            grandStaves.set(members[0].id, new GrandStaff(members[0].id, members[0].instrument, members[0], members[1]));
        }
        const systems = new Map<number, StaffSystem>();
        for (const key of Object.keys(metadata.systems)) {
            const members = rangeMembers(key, staves);
            const system = new StaffSystem(members[0].id, members);
            system.staffCode = key;
            systems.set(system.id, system);
        }
        page.staves = staves;
        page.grandStaves = grandStaves;
        page.systems = systems;
    }
}
