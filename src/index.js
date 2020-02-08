import { useState, useEffect } from 'react';

let stores = {};
let subscriptions = {};

const defaultReducer = (state, payload) => payload;
const defaultMemoFn = (state) => state;

/** The public interface of a store */
class StoreInterface {
  constructor(name, store, useReducer) {
    this.name = name;
    useReducer ?
      this.dispatch = store.setState : this.setState = store.setState;
    this.getState = () => store.state;
    this.subscribe = this.subscribe.bind(this);
  }

  /**
   * Subscribe to store changes
   * @callback callback - The function to be invoked everytime the store is updated
   * @return {Function} - Call the function returned by the method to cancel the subscription
   */

  /**
  *
  * @param {callback} state, action
  */
  subscribe(callback) {
    if (!callback || typeof callback !== 'function') {
      throw `store.subscribe callback argument must be a function. got '${typeof callback}' instead.`;
    }
    if (subscriptions[this.name].find(c => c === callback)) {
      console.warn('This callback is already subscribed to this store. skipping subscription');
      return;
    }
    subscriptions[this.name].push(callback);
    return () => {
      subscriptions[this.name] = subscriptions[this.name].filter(c => c !== callback);
    }
  }

  setState() {
    console.warn(`[React Hookstore] Store ${this.name} uses a reducer to handle its state updates. use dispatch instead of setState`)
  }

  dispatch() {
    console.warn(`[React Hookstore] Store ${this.name} does not use a reducer to handle state updates. use setState instead of dispatch`)
  }
}

function getStoreByIdentifier(identifier) {
  const name = identifier instanceof StoreInterface ? identifier.name : identifier;
  if (!stores[name]) {
    throw `Store with name ${name} does not exist`;
  }
  return stores[name];
}

/**
 * Creates a new store
 * @param {String} name - The store namespace.
 * @param {*} state [{}] - The store initial state. It can be of any type.
 * @callback reducer [null]
 * @returns {StoreInterface} The store instance.
 */

 /**
  *
  * @param {reducer} prevState, action - The reducer handler. Optional.
  */
export function createStore(name, state = {}, reducer=defaultReducer) {
  if (typeof name !== 'string') {
    throw 'Store name must be a string';
  }
  if (stores[name]) {
    throw `Store with name ${name} already exists`;
  }

  const store = {
    state,
    reducer,
    setState(action, callback) {
      const isPrimitiveStateWithoutReducerAndIsPreviousState =
        this.reducer === defaultReducer
          && action === this.state
          && typeof action !== 'object';

      if (isPrimitiveStateWithoutReducerAndIsPreviousState) {
        if (typeof callback === 'function') callback(this.state)
        return;
      }

      const currentState = this.state;
      const newState = this.reducer(this.state, action);
      this.state = newState;

      this.updatersPerMemoFunction.forEach((updaters, memoFn) => {
        const prevResult = memoFn(currentState);
        const newResult = memoFn(newState);
        if (prevResult === newResult) {
          return;
        }
        for (let updateComponent of updaters) {
          updateComponent(this.state);
        }
      });

      if (subscriptions[name].length) {
        subscriptions[name].forEach(c => c(this.state, action));
      }

      if (typeof callback === 'function') callback(this.state)
    },
    updatersPerMemoFunction: new Map(),
  };

  store.setState = store.setState.bind(store);
  store.updatersPerMemoFunction.set(defaultMemoFn, new Set())
  stores = Object.assign({}, stores, { [name]: store });
  subscriptions[name] = [];

  store.public = new StoreInterface(name, store, reducer !== defaultReducer);
  return store.public;
}

/**
 * Returns a store instance based on its name
 * @callback {String} name - The name of the wanted store
 * @returns {StoreInterface} the store instance
 */

export function getStoreByName(name) {
  try {
    return stores[name].public;
  } catch(e) {
    throw `Store with name ${name} does not exist`;
  }
}

/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String|StoreInterface} identifier - The identifier for the wanted store
 * @callback memoFn [state => state] - A memoization function to optimize component rerender. Receive the store state and return a subset of it. The component will only rerender when the subset changes.
 * @returns {Array} the [state, setState] pair.
 */

/**
  *
  * @param {memoFn} state
  */
export function useStore(identifier, memoFn=defaultMemoFn) {
  const store = getStoreByIdentifier(identifier);
  if (!store) {
    throw 'store does not exist';
  }
  if (typeof memoFn !== 'function') {
    throw 'memoFn must be a function';
  }

  const [ state, set ] = useState(store.state);

  useEffect(() => {
    if (!store.updatersPerMemoFunction.has(memoFn)) {
      store.updatersPerMemoFunction.set(memoFn, new Set());
    }
  
    const updatersPerMemoFunction = store.updatersPerMemoFunction.get(memoFn);

    if (!updatersPerMemoFunction.has(set)) {
      updatersPerMemoFunction.add(set);
    }

    return () => {
      updatersPerMemoFunction.delete(set);
      if (!updatersPerMemoFunction.size) {
        store.updatersPerMemoFunction.delete(memoFn);
      }
    }
  }, [])

  return [ state, store.setState];
}
