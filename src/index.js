import { useState, useEffect } from 'react';

let stores = {};

const defaultReducer = (state, payload) => payload;

/**
 * Creates a new store
 * @param {Object} config - An object containing the store setup
 * @param {*} config.state [{}] - The store initial state. It can be of any type.
 * @param {String} config.name ['store'] - The store namespace. not required if you're not using multiple stores within the same app.
 * @callback confg.reducer [null]
 */

 /**
  *
  * @param {config.reducer} prevState, action - The reducer handler. Optional.
  */
export function createStore({ state = {}, name='store', reducer=defaultReducer }) {
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
  stores = Object.assign({}, stores, { [name]: store });
  return store;
}

/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String} name ['store'] - The namespace for the wanted store
 */
export function useStore(name='store') {
  const store = stores[name];
  if (!store) {
    throw 'store does not exist';
  }
  const [ state, set ] = useState(store.state);

  if (!store.setters.includes(set)) {
    store.setters.push(set);
  }

  return [ state, store.setState ];
}
