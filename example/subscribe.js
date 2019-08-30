import React from 'react';
import { createStore, useStore } from '../src';

const defaultStyles = {
  padding: 10, backgroundColor: 'turquoise', marginTop: 10, color: 'black'
}

const store = createStore('clickCounter2', 0);

// this will execute everytime the state is updated
const unsubscribe = store.subscribe((state) => {
  alert('You increased the counter!');
  if (state >= 3) {
    //after three executions, let's unsubscribe to get rid of the alert!
    unsubscribe();
  }
})

export default function SubscriptionExample() {
  const [ state, setState ] = useStore(store);

  return (
    <div style={{ ...defaultStyles }}>
      <h1>Hello, component!</h1>
      <h2>The button inside this component was clicked {state} times</h2>
      <p> After 3 clicks, you won't receive anymore alerts! </p>
      <button type="button" onClick={() => setState(state+1)}>Update</button>
    </div>
  );
}

