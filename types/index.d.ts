
declare module 'react-hookstore' {
    type StateCallback<TState> = (state: TState) => void;

    type ReducerType<TState, TPayload = any> = (state: TState, payload: TPayload) => TState;

    type SetStateType<TState> = (state: TState, callback?: StateCallback<TState>) => void;

    type DispatchType<TState, TPayload = any> = (payload: TPayload, callback?: StateCallback<TState>) => void;

    type StoreStateHookType<TState> = [TState, SetStateType<TState>];

    type StoreDispatchHookType<TState> = [TState, DispatchType<TState>];

    const defaultReducer: ReducerType<any>;

    export interface StoreSpec<TState> {
        state: TState;
        reducer: ReducerType<TState>;
        setState: SetStateType<TState> | DispatchType<TState>;
        setters: StateCallback<TState>[]
    }

    export interface StateStoreInterface<TState> {
        setState(state: TState, callback?: StateCallback<TState>): void;
    }

    export interface ReducerStoreInterface<TState> {
        dispatch<TPayload>(payload: TPayload, callback?: StateCallback<TState>): void;
    }

    export function createStore<TState>(name: string, state: TState): StateStoreInterface<TState>;

    export function createStore<TState>(name: string, state: TState, reducer: ReducerType<TState>): ReducerStoreInterface<TState>;

    export function getStoreByName<TState>(name: string): StateStoreInterface<TState> | ReducerStoreInterface<TState>;

    export function useStore<TState>(identifier: string): StoreStateHookType<TState> | StoreDispatchHookType<TState>;

    export function useStore<TState>(store: StateStoreInterface<TState>): StoreStateHookType<TState>;

    export function useStore<TState>(store: ReducerStoreInterface<TState>): StoreDispatchHookType<TState>;
}
