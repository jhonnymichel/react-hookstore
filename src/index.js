import { useState, useEffect } from 'react';

let stores = {};

const defaultReducer = (state, payload) => payload;

class StoreInterface {
  constructor(name, store, useReducer) {
    this.name = name;
    useReducer ?
      this.dispatch = store.setState : this.setState = store.setState;
    this.getState = () => store.state;
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
    throw 'store name must be a string';
  }
  if (stores[name]) {
    throw 'store already exists'
  }

  const store = {
    state,
    reducer,
    setState(action,callback) {
      this.state = this.reducer(this.state, action);
      this.setters.forEach(setter => setter(this.state));
	  if(callback) callback(this.state)
    },
    setters: []
  };
  store.setState = store.setState.bind(store);
  store.public = new StoreInterface(name, store, reducer !== defaultReducer);

  stores = Object.assign({}, stores, { [name]: store });
  return store.public;
}

/**
 * Returns a store instance based on its name
 * @param {String} name - The name of the wanted store
 * @returns {StoreInterface} the store instance
 */
export function getStoreByName(name) {
  try {
    return stores[name].public;
  } catch(e) {
    throw 'store does not exist';
  }
}

/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String|StoreInterface} identifier - The identifier for the wanted store
 * @returns {Array} the [state, setState] pair.
 */
export function useStore(identifier) {
  const store = getStoreByIdentifier(identifier);
  if (!store) {
    throw 'store does not exist';
  }
  const [ state, set ] = useState(store.state);

  useEffect(() => () => {
    store.setters = store.setters.filter(setter => setter !== set)
  }, [])

  if (!store.setters.includes(set)) {
    store.setters.push(set);
  }

  return [ state, store.setState ];
}
