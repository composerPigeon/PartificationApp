
export interface PropertyState<T> {
    value: T,
    set: (value: T) => void,
}