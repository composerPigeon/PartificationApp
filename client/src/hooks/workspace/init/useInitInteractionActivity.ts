import {useState} from 'react';
import type {Instrument} from '../../../domain';

type InstrumentForm = {position: {top: number, left: number}} & (
    {staffId: number, instrument: Instrument} | {centerY: number, height: number}
);

// Shared page-scoped data is initialized before permissions and feature handlers.
export function useInitInteractionActivity() {
    const [staffIds, setStaffIds] = useState<ReadonlySet<number>>(() => new Set());
    const [pendingStaff, setPendingStaff] = useState<{startY: number, endY: number} | null>(null);
    const [instrumentForm, setInstrumentForm] = useState<InstrumentForm | null>(null);

    return {staffIds, setStaffIds, pendingStaff, setPendingStaff, instrumentForm, setInstrumentForm};
}

export type InteractionActivityState = ReturnType<typeof useInitInteractionActivity>;
