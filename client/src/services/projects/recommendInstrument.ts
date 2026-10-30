import type {Project, ScorePage} from '../../domain';
import type {Instrument} from '../../domain/Instrument.ts';

export function recommendInstrument(project: Project, pages: ScorePage[], page: ScorePage, y: number): Instrument | undefined {
    if (!project.instruments.length) return undefined;
    const history = getInstrumentHistory(pages, page, y);
    const window = getHistoryWindow(history, project.instruments.length);
    return window[0] ?? project.instruments[0];
}

function getInstrumentHistory(pages: ScorePage[], page: ScorePage, y: number): Instrument[] {
    return pages
        .filter(item => item.number <= page.number)
        .sort((a, b) => a.number - b.number)
        .flatMap(item => [...item.staves]
            .filter(staff => item.number < page.number || staff.y < y)
            .map(staff => staff.instrument));
}

function getHistoryWindow(history: Instrument[], size: number): Instrument[] {
    return history.slice(-size);
}
