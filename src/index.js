import { useState, useEffect, useRef } from 'react';

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
      throw new TypeError(`[React Hookstore] store.subscribe callback argument must be a function. got '${typeof callback}' instead.`);
    }
    if (subscriptions[this.name].find(c => c === callback)) {
      console.warn('[React Hookstore] This callback is already subscribed to this store. skipping subscription');
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
    throw new Error(`[React Hookstore] Store with name ${name} does not exist`);
  }
  return stores[name];
}

/**
 * Creates a new store
 * @param {String} name - The store namespace.
 * @param {*} state [{}] - The store initial state. It can be of any type.
 * @callback reducer [null]
 * @param {Boolean} overrideIfExists - It'll override an existent store with the same name. useful for SSR.
 * @returns {StoreInterface} The store instance.
 */

 /**
  *
  * @param {reducer} prevState, action - The reducer handler. Optional.
  */
export function createStore(name, state = {}, reducer=defaultReducer) {
  if (typeof name !== 'string') {
    throw new TypeError('[React Hookstore] Store name must be a string');
  }

  if (stores[name]) {
    console.warn(`[React Hookstore] Store with name ${name} already exists. Overriding`);
  }

  const store = {
    state,
    reducer,
    setState(action, callback) {
      this.state = this.reducer(this.state, action);
      this.setters.forEach(set => {
        try {
          set(this.state)
        } catch(e) {
          console.error(e)
          console.error('[React Hookstore] The error above was caused while React Hookstore was trying to call setState on a component. If you think this is a bug with React Hookstore, please file an issue https://github.com/jhonnymichel/react-hookstore/issues/new')
        }
      });
      if (subscriptions[name].length) {
        subscriptions[name].forEach(c => c(this.state, action));
      }
      if (typeof callback === 'function') callback(this.state)
    },
    setters: []
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
    console.warn(`[React Hookstore] Store with name ${name} does not exist`);
    return null;
  }
}

/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String|StoreInterface} identifier - The identifier for the wanted store
 * @returns {Array} the [state, setState] pair.
 */
export function useStore(identifier) {
  const store = getStoreByIdentifier(identifier);

  const [ state, set ] = useState(store.state);

  if (!store.setters.includes(set)) {
    store.setters.push(set);
  }

  useEffect(() => {
    return () => {
      store.setters = store.setters.filter(setter => setter !== set)
    }
  }, [])

  return [ state, store.setState ];
}
