import React from 'react';
import { createStore, useStore } from '../src';

const defaultStyles = {
  padding: 10, backgroundColor: 'navy', marginTop: 10, color: 'white'
}

const mapStateToProps = (state) => state.number;

// Creating a nameless store, do that if you do not wish to have multiple stores in your app
const store = createStore('clickCounter', { number: 0 }, (state, number) => {
  return { number }
});

let delay = 0;
function setDelay() {
  delay += 0.5;
  if (delay > 1) {
    delay = 0;
  }
  return delay;
}

export function StatefulHello() {
  // just use the useStore method to grab the state and the setState methods
  const [ state, setState ] = useStore('clickCounter', mapStateToProps);

  return (
    <div style={{ ...defaultStyles }}>
      <h1>Hello, component!</h1>
      <h2>The button inside this component was clicked {state.number} times</h2>
      <button type="button" onClick={() => setState(Math.floor(state.number + setDelay()))}>Update</button>
    </div>
  );
}

export function AnotherComponent() {
  // you can name the state whatever you want
  const [ value ] = useStore('clickCounter');
  return (
    <div style={{ ...defaultStyles, backgroundColor: 'lightgray', color: 'black' }}>
      <h1>Hello, this is a second component, with no relation to the one on the top</h1>
      <h2>But it is still aware of how many times the button was clicked: {value.number} </h2>
    </div>
  )
}
