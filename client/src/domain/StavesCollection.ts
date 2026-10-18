import type {Staff} from './Staff.ts';

class StaffNode {
    staff: Staff;
    prev: StaffNode | undefined;
    next: StaffNode | undefined;

    constructor(staff: Staff) { this.staff = staff; }
}

/** Ordered by ascending Y, then ID. Move staff through move() to preserve order. */
export class StavesCollection implements Iterable<Staff> {
    private readonly nodes = new Map<number, StaffNode>();
    private head: StaffNode | undefined;
    private tail: StaffNode | undefined;

    constructor(staves: Iterable<Staff> = []) {
        for (const staff of staves) this.add(staff);
    }

    get size(): number { return this.nodes.size; }

    has(id: number): boolean { return this.nodes.has(id); }

    get(id: number): Staff | undefined { return this.nodes.get(id)?.staff; }

    /** Last staff whose top is strictly above Y. */
    getPrevious(y: number): Staff | undefined {
        for (let node = this.tail; node; node = node.prev) {
            if (node.staff.y < y) return node.staff;
        }
        return undefined;
    }

    /** First staff whose top is at or below Y, including an exact match. */
    getNext(y: number): Staff | undefined {
        for (let node = this.head; node; node = node.next) {
            if (node.staff.y >= y) return node.staff;
        }
        return undefined;
    }

    /** Duplicate IDs are ignored. */
    add(staff: Staff): void {
        if (this.has(staff.id)) return;
        if (!Number.isFinite(staff.y)) throw new RangeError('Staff Y must be finite.');
        const node = new StaffNode(staff);
        this.insert(node);
        this.nodes.set(staff.id, node);
    }

    delete(id: number): boolean {
        const node = this.nodes.get(id);
        if (!node) return false;
        this.unlink(node);
        return this.nodes.delete(id);
    }

    move(id: number, y: number): boolean {
        const node = this.nodes.get(id);
        if (!node) return false;
        if (!Number.isFinite(y)) throw new RangeError('Staff Y must be finite.');
        this.unlink(node);
        node.staff.y = y;
        this.insert(node);
        return true;
    }

    *values(): IterableIterator<Staff> {
        for (let node = this.head; node; node = node.next) yield node.staff;
    }

    *keys(): IterableIterator<number> {
        for (const staff of this) yield staff.id;
    }

    [Symbol.iterator](): IterableIterator<Staff> { return this.values(); }

    private insert(node: StaffNode): void {
        let next = this.head;
        while (next && (next.staff.y < node.staff.y
            || (next.staff.y === node.staff.y && next.staff.id < node.staff.id))) {
            next = next.next;
        }
        node.prev = next ? next.prev : this.tail;
        node.next = next;
        if (node.prev) node.prev.next = node;
        else this.head = node;
        if (next) next.prev = node;
        else this.tail = node;
    }

    private unlink(node: StaffNode): void {
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;
        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;
        node.prev = undefined;
        node.next = undefined;
    }
}
