declare module 'react-hookstore' {
  type StateCallback<TState> = (state: TState) => void;

  type ReducerType<TState, TPayload = any> = (state: TState, payload: TPayload) => TState;

  type SetStateType<TState> = (state: TState, callback?: StateCallback<TState>) => void;

  type DispatchType<TState, TPayload = any> = (payload: TPayload, callback?: StateCallback<TState>) => void;

  type StoreStateHookType<TState> = [TState, SetStateType<TState>];

  type StoreDispatchHookType<TState, TPayload = any> = [TState, DispatchType<TState, TPayload>];

  const defaultReducer: ReducerType<any>;

  export interface StoreSpec<TState, TPayload = any> {
      state: TState;
      reducer: ReducerType<TState, TPayload>;
      setState: SetStateType<TState> | DispatchType<TState, TPayload>;
      setters: StateCallback<TState>[]
  }

  export interface StateStoreInterface<TState> {
      readonly name: string;
      getState(): TState;
      setState(state: TState, callback?: StateCallback<TState>): void;
  }

  export interface ReducerStoreInterface<TState, TPayload = any> {
      readonly name: string;
      getState(): TState;
      dispatch<TPayload>(payload: TPayload, callback?: StateCallback<TState>): void;
  }

  export function createStore<TState, TPayload = any>(name: string, state: TState, reducer: ReducerType<TState, TPayload>): ReducerStoreInterface<TState, TPayload>;

  export function createStore<TState>(name: string, state: TState): StateStoreInterface<TState>;

  export function createStore<TState>(name: string, state: TState, reducer: ReducerType<TState>): ReducerStoreInterface<TState>;

  export function getStoreByName<TState, TPayload = any>(name: string): StateStoreInterface<TState> | ReducerStoreInterface<TState>;

  export function getStoreByName<TState>(name: string): StateStoreInterface<TState> | ReducerStoreInterface<TState>;

  export function useStore<TState>(identifier: string): StoreStateHookType<TState> | StoreDispatchHookType<TState>;

  export function useStore<TState, TPayload = any>(identifier: string): StoreDispatchHookType<TState, TPayload>;

  export function useStore<TState>(store: StateStoreInterface<TState>): StoreStateHookType<TState>;

  export function useStore<TState, TPayload = any>(store: ReducerStoreInterface<TState, TPayload>): StoreDispatchHookType<TState, TPayload>;
}
