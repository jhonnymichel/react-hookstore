# React Hook Store
A very simple and small (1k gzipped!) state management lib for React that uses the bleeding edge React's `useState` hook.
Which basically means no magic behind the curtains, only pure react APIs being used to share state across components.

Try it on [Codesandbox!](https://codesandbox.io/s/r58pqonkop)

# Table of Contents
- [Installation](#installation)
- Usage
  - [Basic](#usage_basic)
  - [Namespacing and referencing stores](#usage_namespace)
  - [Reducer powered stores](#usage_reducer)
- API
  - [createStore](#api_createStore)
  - [getStoreByName](#api_getStoreByName)
  - [StoreInterface](#api_storeInterface)
  - [usStore](#api_useStore)
- [Migrating from v1.0 to v1.1](#migration)

> ⚠️ BREAKING CHANGES: Version 1.1 is not compatible with previous versions. It is easy to update your previous versions' code to work with it, though. [Click here](#migration) to know how.

> ⚠️ Warning: hooks are not part of a stable React release yet, so use this library only for experiments

## <a name="installation">Installation</a>
You can install the lib through NPM or grab the files in the `dist` folder of this repository.
`npm install --save react-hookstore`

## <a name="usage">Usage</a>
### <a name="usage_basic">Basic</a>

This is the most basic implementation of the library. create a store with its initial state.
Later, call `useStore` inside components to retrieve its state and setState method.
The value passed as the first argument to the setState method will be the new state. no reducer required (but you can use a reducer, see the advanced example down below).

```javascript
import React from 'react';
import { createStore, useStore } from 'react-hookstore';

createStore('clickStore', 0);

function StatefullHello() {
  // just use the useStore method to grab the state and the setState methods
  const [ timesClicked, setClicks ] = useStore('clickStore');

  return (
    <div>
      <h1>Hello, component!</h1>
      <h2>The button inside this component was clicked {timesClicked} times</h2>
      <button type="button" onClick={() => setClicks(timesClicked+1)}>Update</button>
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

### <a name="usage_namespace">Namespacing and referencing stores</a>
It is possible to create multiple stores in an app.
Stores can be referenced by using their instance that is returned by the createStore method, as well as using their name.

```javascript
import React from 'react';
import { createStore, useStore } from 'react-hookstore';

const clickCount = createStore('clickCountStore', 0);
createStore('nameStore', 'John Doe');

// counter will start at 2
clickCount.setState(2);

function StatefullHello() {

  // this line will reference a store by its instance
  const [ clicks, setClicks ] = useStore(clickCount);
  // this line will reference a store by its name
  const [ name ] = useStore('nameStore');

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h2>The button inside this component was clicked {clicks} times</h2>
      <button type="button" onClick={() => setClicks(clicks+1)}>Update</button>
    </div>
  );
}
```
Both methods can be used and mixed according to the needs, but we recomend using the instance identifiers.

### <a name="usage_reducer">Reducer powered stores</a>
We can delegate the state management to reducers (just like redux!) if we want.
```javascript
import React from 'react';
import { createStore, useStore } from 'react-hookstore';

// this one is more complex, it has a name and a reducer function
const todoListStore = createStore(
  'todoList',
  {
    idCount: 0,
    todos: [{ id: 0, text: 'buy milk' }],
  },
  (state, action) => {
    // when a reducer is being used, you must return a new state object
    switch action.type {
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
  }
};

function AddTodo() {
  const [ { todos }, dispatch ] = useStore(todoListStore);

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
  const [ { todos }, dispatch ] = useStore(todoListStore);
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
## Methods API
### <a name="api_createStore">`createStore(name:String, state:*, reducer:Function):StoreInterface`</a>
Creates a store to be used across the entire application. Returns a StoreInterface object.
### Arguments
#### `name:String`
The namespace for your store, it can be used to identify the store across the application.
#### `state:* = {}`
The store's initial state. it can be any data type. defaults to an empty object. Optional
#### `reducer:Function = null`
You can specify a reducer function to take care of state changes. the reducer functions receives two arguments, the previous state and the action that triggered the state update. the function must return a new state, if not, the new state will be `null`. Optional

### <a name="api_getStoreByName">`getStoreByName(name:String):StoreInterface`</a>
Finds a store by its name and return its instance.
### Arguments
#### `name:String = 'store'`
The name of the store.

## Objects API
### <a name="api_storeInterface">`StoreInterface`</a>
The store instance that is returned by the createStore and getStoreByName methods.
### Interface
#### `name:String`
The name of the store;
#### `getState:Function():*`
A method that returns the store's current state
#### `setState:Function(*)`
Sets the state of the store. works if the store does not use a reducer state handler. Otherwise, use `dispatch`
#### `dispatch:Function(*)`
Dispatchs whatever is passed into this function to the store. works if the store uses a reducer state handler. Otherwise, use `setState`

## React API
### <a name="api_useStore">`useStore(identifier:String|StoreInterface)`</a>
A function that returns a pair with the current state and the handler method for the specified store.
### Arguments
#### Identifier:String|StoreInterface
The store identifier. It can be either its string name or its StoreInterface instance returned by a createStore or getStoreByName method.

# <a name="migration">Migrating from v1.0 to v1.1</a>
- createStore now receives 3 arguments instead of an object with 3 properties.
- the name argument is now required even if only one store is being used.
```javascript
// v0.1
createStore({state: 0});
createStore({
  name: 'store',
  state: 0,
  reducer(state, action) {
    return state + action;
  }
})
// v0.2
createStore('myStore', 0);
createStore('store', 0, (state, value) => state + action);
```
