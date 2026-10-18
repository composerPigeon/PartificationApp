
export class Instrument {
    id: string;
    title: string;
    shortcut: string;

    constructor(title: string, shortcut: string) {
        this.id = Instrument.createId(title);
        this.title = title;
        this.shortcut = shortcut;
    }

    static createId(title: string) {
        return title.toLowerCase().replace(/\s/g, '-');
    }
}