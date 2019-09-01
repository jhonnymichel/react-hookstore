import { useState, useEffect } from 'react';

let stores = {};
let subscriptions = {};

const defaultReducer = (state, payload) => payload;

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
    setState(mapDependency, action, callback) {
      if (this.reducer === defaultReducer && action === this.state && typeof action !== 'object') {
        if (typeof callback === 'function') callback(this.state)
        return;
      }
      const currentState = this.state;
      const newState = this.reducer(this.state, action);
      const prevResult = mapDependency(currentState);
      const newResult = mapDependency(newState);
      if (prevResult === newResult) {
        if (typeof callback === 'function') callback(this.state);
        return;
      }
      this.state = newState;
      for (let setter of this.setters.get(mapDependency)) {
        setter(this.state);
      }
      if (subscriptions[name].length) {
        subscriptions[name].forEach(c => c(this.state, action));
      }
      if (typeof callback === 'function') callback(this.state)
    },
    setters: new Map(),
  };
  store.setState = store.setState.bind(store);
  subscriptions[name] = [];
  store.public = new StoreInterface(name, store, reducer !== defaultReducer);

  stores = Object.assign({}, stores, { [name]: store });
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

const defaultMapDependencies = (state) => state;

/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String|StoreInterface} identifier - The identifier for the wanted store
 * @returns {Array} the [state, setState] pair.
 */
export function useStore(identifier, mapDependency=defaultMapDependencies) {
  const store = getStoreByIdentifier(identifier);
  if (!store) {
    throw 'store does not exist';
  }
  if (typeof mapDependency !== 'function') {
    throw 'dependencyMap must be a function';
  }

  const [ state, set ] = useState(store.state);

  if (!store.setters.get(mapDependency)) {
    store.setters.set(mapDependency, new Set());
  }

  const setters = store.setters.get(mapDependency);

  useEffect(() => {
    if (!setters.has(set)) {
      setters.add(set);
    }

    return () => {
      setters.remove(set);
    }
  }, [])

  return [ state, (...args) => store.setState(mapDependency, ...args) ];
}
