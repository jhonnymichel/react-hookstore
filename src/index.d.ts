import * as React from "react";

type ReducerType<TState> = (state: TState, payload: any) => TState;

type SetStateType<TState> = (state: TState, callback: React.Dispatch<TState>) => void;

type DispatchType<TState, TPayload = any> = (payload: TPayload, callback: React.Dispatch<TState>) => void;

type StoreStateHookType<TState> = [ TState, SetStateType<TState> ];

type StoreDispatchHookType<TState, TPayload> = [ TState, DispatchType<TState, TPayload> ];

declare const defaultReducer: ReducerType<any>;

declare interface StoreSpec<TState> {
    state: TState;
    reducer: ReducerType<TState>;
    setState: SetStateType<TState> | DispatchType<TState>;
    setters: React.Dispatch<TState>[]
}

declare class StoreInterface<TState> {
    constructor(name: string, store: StoreSpec<TState>, useReducer: boolean);
    setState(state: TState, callback?: React.Dispatch<TState>): void;
    dispatch(payload: any, callback?: React.Dispatch<TState>): void;    
}

declare function createStore<TState>(name: string, state?: TState, reducer?: ReducerType<TState>): StoreInterface<TState>;

declare function getStoreByName<TState>(name: string): StoreInterface<TState>; 

declare function useStore<TState, TPayload>(identifier: string): StoreDispatchHookType<TState, TPayload>;

declare function useStore<TState>(identifier: string): StoreStateHookType<TState>;

declare function useStore<TState, TPayload>(store: StoreInterface<TState>): StoreDispatchHookType<TState, TPayload>;

declare function useStore<TState>(store: StoreInterface<TState>): StoreStateHookType<TState>;
