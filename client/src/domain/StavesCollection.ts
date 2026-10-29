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
    getPrevious(y: number, excludedId?: number): Staff | undefined {
        for (let node = this.tail; node; node = node.prev) {
            if (node.staff.id !== excludedId && node.staff.y < y) return node.staff;
        }
        return undefined;
    }

    /** First staff whose top is at or below Y, including an exact match. */
    getNext(y: number, excludedId?: number): Staff | undefined {
        for (let node = this.head; node; node = node.next) {
            if (node.staff.id !== excludedId && node.staff.y >= y) return node.staff;
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
        this.updateOrder(node);
    }

    delete(id: number): boolean {
        const node = this.nodes.get(id);
        if (!node) return false;
        const next = node.next;
        this.unlink(node);
        this.nodes.delete(id);
        node.staff.order = 0;
        this.updateOrder(next);
        return true;
    }

    move(staffId: number, y: number): boolean {
        const node = this.nodes.get(staffId);
        if (!node) return false;
        if (!Number.isFinite(y)) throw new RangeError('Staff Y must be finite.');
        const movingUp = y < node.staff.y;
        const nextBeforeMove = node.next;

        this.unlink(node);
        node.staff.y = y;
        this.insert(node);

        // No neighbors were crossed, so the order is unchanged.
        if (node.next === nextBeforeMove) return true;

        if (movingUp) {
            // Renumber from the new position through the old position.
            this.updateOrder(node, nextBeforeMove);
        } else {
            // Renumber from the old position through the new position.
            this.updateOrder(nextBeforeMove, node.next);
        }
        return true;
    }

    moveLeftDivider(n: number): void {
        for (const staff of this) {
            staff.width = staff.x + staff.width - n;
            staff.x = n;
        }
    }

    moveRightDivider(n: number): void {
        for (const staff of this) {
            staff.width = n - staff.x;
        }
    }

    *values(): IterableIterator<Staff> {
        for (let node = this.head; node; node = node.next) yield node.staff;
    }

    *keys(): IterableIterator<number> {
        for (const staff of this) yield staff.id;
    }

    [Symbol.iterator](): IterableIterator<Staff> { return this.values(); }

    /** Renumber [start, end), leaving the rest of the collection untouched. */
    private updateOrder(start: StaffNode | undefined, end?: StaffNode): void {
        let order = (start?.prev?.staff.order ?? 0) + 1;
        for (let node = start; node && node !== end; node = node.next) {
            node.staff.order = order++;
        }
    }

    private insert(node: StaffNode): void {
        let next = this.head;
        while (next && (next.staff.y < node.staff.y
            || (next.staff.y === node.staff.y && next.staff.id < node.staff.id))) {
            next = next.next;
        }
        const prev = next ? next.prev : this.tail;
        this.connectNeighbors(prev, node);
        this.connectNeighbors(node, next);
    }

    private unlink(node: StaffNode): void {
        this.connectNeighbors(node.prev, node.next);
        node.prev = undefined;
        node.next = undefined;
    }

    private connectNeighbors(prev: StaffNode | undefined, next: StaffNode | undefined): void {
        if (prev) prev.next = next;
        else this.head = next;
        if (next) next.prev = prev;
        else this.tail = prev;
    }
}
