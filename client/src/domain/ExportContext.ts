import {JsonProperty, Serializable} from 'ts-jackson';

@Serializable()
export class ExportContext {
    @JsonProperty()
    readonly id: string;

    @JsonProperty({path: 'instruments', type: Array, elementType: String})
    instrumentIds: string[];

    @JsonProperty({path: 'within_system_spacing', default: 5})
    withinSystemSpacing: number = 5;

    @JsonProperty({path: 'between_system_spacing', default: 18})
    betweenSystemSpacing: number = 18;

    @JsonProperty({path: 'is_shortcuts_visible', default: true})
    isShortcutsVisible: boolean = true;

    constructor(instrumentIds: string[] = []) {
        this.instrumentIds = [...new Set(instrumentIds)].sort();
        this.id = this.instrumentIds.join('_');
    }
}
