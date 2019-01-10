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
}

function getStoreByIdentifier(identifier) {
  const name = identifier instanceof StoreInterface ? identifier.name : identifier;
  return stores[name];
}

/**
 * Creates a new store
 * @param {String} name - The store namespace. not required if you're not using multiple stores within the same app.
 * @param {*} state [{}] - The store initial state. It can be of any type.
 * @callback reducer [null]
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
    setState(action) {
      this.state = this.reducer(this.state, action);
      this.setters.forEach(setter => setter(this.state));
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
 * @param {String} name ['store'] - The name of the wanted store
 */
export function getStoreByName(name='store') {
  try {
    return stores[name].public;
  } catch(e) {
    throw 'store does not exist';
  }
}

/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String|StoreInterface} identifier ['store'] - The identifier for the wanted store
 */
export function useStore(identifier='store') {
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
