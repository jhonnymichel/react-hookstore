declare module 'react-hookstore' {
  type StateCallback<TState> = (state: TState) => void;

  type ReducerType<TState, TData = any> = (state: TState, data: TData) => TState;

  type SetStateType<TState> = (state: TState, callback?: StateCallback<TState>) => void;

  type DispatchType<TState, TData = any> = (data: TData, callback?: StateCallback<TState>) => void;

  type StoreStateHookType<TState> = [TState, SetStateType<TState>];

  type StoreDispatchHookType<TState, TData = any> = [TState, DispatchType<TState, TData>];

  const defaultReducer: ReducerType<any>;

  export interface StoreSpec<TState, TData = any> {
      state: TState;
      reducer: ReducerType<TState, TData>;
      setState: SetStateType<TState> | DispatchType<TState, TData>;
      setters: StateCallback<TState>[]
  }

  export interface StateStoreInterface<TState> {
      readonly name: string;
      getState(): TState;
      setState(state: TState, callback?: StateCallback<TState>): void;
  }

  export interface ReducerStoreInterface<TState, TData = any> {
      readonly name: string;
      getState(): TState;
      dispatch<TData>(data: TData, callback?: StateCallback<TState>): void;
  }

  export function createStore<TState, TData = any>(name: string, state: TState, reducer: ReducerType<TState, TData>): ReducerStoreInterface<TState, TData>;

  export function createStore<TState>(name: string, state: TState): StateStoreInterface<TState>;

  export function createStore<TState>(name: string, state: TState, reducer: ReducerType<TState>): ReducerStoreInterface<TState>;

  export function getStoreByName<TState, TData = any>(name: string): StateStoreInterface<TState> | ReducerStoreInterface<TState>;

  export function getStoreByName<TState>(name: string): StateStoreInterface<TState> | ReducerStoreInterface<TState>;

  export function useStore<TState>(identifier: string): StoreStateHookType<TState> | StoreDispatchHookType<TState>;

  export function useStore<TState, TData = any>(identifier: string): StoreDispatchHookType<TState, TData>;

  export function useStore<TState>(store: StateStoreInterface<TState>): StoreStateHookType<TState>;

  export function useStore<TState, TData = any>(store: ReducerStoreInterface<TState, TData>): StoreDispatchHookType<TState, TData>;
}
