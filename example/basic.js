import React from 'react';
import { createStore, useStore } from '../src';

const defaultStyles = {
  padding: 10, backgroundColor: 'navy', marginTop: 10, color: 'white'
}

// Creating a nameless store, do that if you do not wish to have multiple stores in your app
createStore({ state: 1 });

export function StatefulHello() {
  // just use the useStore method to grab the state and the setState methods
  const [ state, setState ] = useStore();

  return (
    <div style={{ ...defaultStyles }}>
      <h1>Hello, component!</h1>
      <h2>The button inside this component was clicked {state} times</h2>
      <button type="button" onClick={() => setState(state+1)}>Update</button>
    </div>
  );
}

export function AnotherComponent() {
  // you can name the state whatever you want
  const [ value ] = useStore();
  return (
    <div style={{ ...defaultStyles, backgroundColor: 'lightgray', color: 'black' }}>
      <h1>Hello, this is a second component, with no relation to the one on the top</h1>
      <h2>But it is still aware of how many times the button was clicked: {value} </h2>
    </div>
  )
}
