# React Hook Store
A very simple and small (1k gzipped!) state management lib for React that uses the bleeding edge React's `useState` hook.
Which basically means no magic behind the curtains, only pure react APIs being used to share state across components.

## Installation
You can install the lib through NPM or grab the files in the `dist` folder of this repository.
`npm install --save react-hookstore`

## Usage
### Basic

This is the most basic implementation of the library. create a store with its initial state.
Later, call `useStore` inside components to retrive its state and setState method.
The value passed as the first argument to the setState method will be the new state. no reducer required (but you can use a reducer, see the advanced example down below).

```javascript
import React from 'react';
import { createStore, useStore } from 'react-hookstore';

createStore({ state: 1 });

function StatefullHello() {
  // just use the useStore method to grab the state and the setState methods
  const [ state, setState ] = useStore();

  return (
    <div>
      <h1>Hello, component!</h1>
      <h2>The button inside this component was clicked {state} times</h2>
      <button type="button" onClick={() => setState(state+1)}>Update</button>
    </div>
  );
}

function AnotherComponent() {
  // you can name the state whatever you want
  const [ timesClicked ] = useStore();
  return (
    <div>
      <h1>Hello, this is a second component, with no relation to the one on the top</h1>
      <h2>But it is still aware of how many times the button was clicked: {timesClicked} </h2>
    </div>
  )
}
```

### Advanced (namespaced and reducer-powered stores)
We can delegate the state management to reducers (just like redux!) if we want, we can also namespace stores if we want to have more than one store per app.
```javascript
import React from 'react';
import { createStore, useStore } from 'react-hookstore';

// this one is more complex, it has a name and a reducer function
createStore({
  name: 'todoList',
  state: {
    idCount: 0,
    todos: [{ id: 0, text: 'buy milk' }],
  },
  reducer(state, action) {
    // when a reducer is being used, you must return a new state object
    switch action.type:
      case 'add':
        const id = ++state.idCount;
        return {
          ...state,
          todos: [
            ...todos,
            { id, text: action.payload }
          ];
        }
      case 'remove':
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload)
        }
      default:
        return todos;
  }
});

function AddTodo() {
  // Grab the correct store by specifying its namespace
  const [ state: { todos }, dispatch ] = useStore('todoList');

  const onSubmit = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const todo = input.value;
    input.value = '';
    dispatch({ type: 'add', payload: todo });
  }

  return (
    <form onSubmit={onSubmit}>
      <input></input>
      <button>Create TODO</button>
    </form>
  )
}

function TodoList() {
  // Grab the correct store by specifying its namespace
  const [ state: { todos }, dispatch ] = useStore('todoList');
  const deleteTodo = id => dispatch({ type: 'delete', payload: id })
  return (
    <ul>
      <h2>TODOLIST</h2>
      { todos.map(todo =>
        <li key={todo.id}>
          { todo } <button onClick={() => deleteTodo(id)} type="button">X</button>
        </li>)
      }
    </ul>
  )
}
```
## API
### `createStore({ state?={}, name?='store', reducer?=null })`
Creates a store to be used across the entire application.
### Arguments
#### `state:* = {}`
It can be of any data type.
#### `name:String = 'store'`
The namespace for your store, it can be used to better identify the store across the application. Optional
#### `reducer:Function = null`
You can specify a reducer function to take care of state changes. the reducer functions receives two arguments, the previous state and the payload that triggered the state update. the function must returns a new state, if not, the new state will be `null`

### `useStore(storeName?='store')`
A function that returns a pair with the current state and the handler method for the specified store.
