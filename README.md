# React Hook Store
[![npm version](https://badge.fury.io/js/react-hookstore.svg)](https://badge.fury.io/js/react-hookstore) [![Build Status](https://travis-ci.org/jhonnymichel/react-hookstore.svg?branch=master)](https://travis-ci.org/jhonnymichel/react-hookstore) [![Coverage Status](https://coveralls.io/repos/github/jhonnymichel/react-hookstore/badge.svg?branch=master)](https://coveralls.io/github/jhonnymichel/react-hookstore?branch=master)

A very simple and small (less than 2k gzipped!) state management lib for React using hooks.

Try it on [Codesandbox!](https://codesandbox.io/s/r58pqonkop)

# Table of Contents
- [Installation](#installation)
- Usage
  - [Basic](#usage_basic)
  - [Referencing stores](#usage_namespace)
  - [Using reducers to update state](#usage_reducer)
  - [Optimizing performance](#optimizing_performance)
  - [More examples](https://codesandbox.io/s/r58pqonkop)
- API
  - [createStore](#api_createStore)
  - [getStoreByName](#api_getStoreByName)
  - [StoreInterface](#api_storeInterface)
  - [useStore](#api_useStore)
- [Migrating from v1.0 to v1.1](#migration)

> ⚠️ BREAKING CHANGES: in version 1.4+, `store.subscribe` was simplified. check the [Store Interface API](#api_storeInterface)

## <a name="installation">Installation</a>
You can install the lib through NPM or grab the files in the `dist` folder of this repository.

`npm install --save react-hookstore`

## <a name="usage">Usage</a>
### <a name="usage_basic">Basic</a>

This is the most basic implementation of the library:

```javascript
import React from 'react';
import { createStore, useStore } from 'react-hookstore';

createStore('clickStore', 0);

function StatefullHello() {
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
  const [ timesClicked ] = useStore('clickStore');
  return (
    <div>
      <h1>Hello, this is a second component, with no relation to the one on the top</h1>
      <h2>But it is still aware of how many times the button was clicked: {timesClicked} </h2>
    </div>
  )
}
```
Steps to reproduce:

- Create a store with its initial state.
- Later, call `useStore` inside components to retrieve its state and setState method, that we called timesClicked and setClicks.
- The value passed as the first argument to the setClicks method will be the new state.

### <a name="usage_namespace">Referencing stores</a>
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
Both methods can be used and mixed according to the needs, but it is recomended to use the instance identifiers.

### <a name="usage_reducer">Using reducers to update state</a>
We can delegate the state management to reducers (just like redux!) if we want:
```javascript
import React from 'react';
import { createStore, useStore } from 'react-hookstore';

const todoListStore = createStore(
  'todoList',
  {
    idCount: 0,
    todos: [{ id: 0, text: 'buy milk' }]
  },
  (state, action) => {
    // when a reducer is being used, you must return a new state value
    switch (action.type) {
      case 'add':
        const id = ++state.idCount;
        return {
          ...state,
          todos: [...state.todos, { id, text: action.payload }]
        };
      case 'delete':
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload)
        };
      default:
        return state;
    }
  }
);

function AddTodo() {
  const [state, dispatch] = useStore('todoList');
  const inputRef = React.useRef(null);

  const onSubmit = e => {
    e.preventDefault();
    const todo = inputRef.current.value;
    inputRef.current.value = '';
    dispatch({ type: 'add', payload: todo });
  };

  return (
    <form onSubmit={onSubmit}>
      <input ref={inputRef} />
      <button>Create TODO</button>
    </form>
  );
}

function TodoList() {
  const [{ todos }, dispatch] = useStore(todoListStore);
  const deleteTodo = id => dispatch({ type: 'delete', payload: id });
  return (
    <ul>
      <h2>TODOLIST</h2>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}{' '}
          <button onClick={() => deleteTodo(todo.id)} type="button">
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

export { TodoList, AddTodo };
```

Steps to reproduce:

- Create a store with an aditional third parameter: a reducer function.
- Later, call `useStore` inside components to retrieve its state and dispatch method.
- call dispatch and provide data as the first argument. Although data can be anything, we are using the pattern of `{ type, payload }`, made popular by redux.

### Optimizing performance

### More examples
Check out the [Codesandbox demo!](https://codesandbox.io/s/r58pqonkop)

## Methods API
### <a name="api_createStore">`createStore(name, state?, reducer?) -> StoreInterface`</a>
Creates a store to be used across the entire application. Returns a StoreInterface object.
### Arguments
#### `name: String`
The namespace for your store, it can be used to identify the store across the application.
#### `state: any = {}`
The store's initial state. it can be any data type. defaults to an empty object. Optional
#### `reducer: (state:any, data:any) -> any`
You can specify a reducer function to take care of state changes. the reducer functions receives two arguments, the previous state and the data dispatched. the function must return a new state, if not, the new state will be `null`. Optional

### <a name="api_getStoreByName">`getStoreByName(name) -> StoreInterface`</a>
Finds a store by its name and returns its instance.
### Arguments
#### `name: String`
The name of the store.

## Objects API
### <a name="api_storeInterface">`StoreInterface`</a>
The store instance that is returned by the createStore and getStoreByName methods.
### Interface
#### `name: String`
The name of the store;
#### `getState: () -> state`
A method that returns the store's current state
#### `setState: (state: any, callback?: (state: any) -> void)`
Sets the state of the store. works if the store does not use a reducer state handler. Otherwise, use `dispatch`. callback is optional and will be invoked once the state is updated, receiving the updated state as argument.
#### `dispatch(data: any, callback?: (state: any) -> void)`
Dispatches data to update the state. works if the store uses a reducer state handler. Otherwise, use `setState`. callback is optional and will be invoked once the state is updated, receiving the updated state as argument.
#### `subscribe(callback: (state: any, data?: any) -> void) -> unsubscribe: () -> void`
The callback function will be invoked everytime the store state changes. If the store is reducer-based, the callback function will be called with the state and the dispatched data as arguments. otherwise, it'll be called with state as the only argument.

the subscribe method returns a function that can be called in order to cancel the subscription for the callback function.

## React API
### <a name="api_useStore">`useStore(identifier, memoFn?) -> [state, setState|dispatch]`</a>
A function that returns a pair with the current state and a function to trigger state updates for the specified store.
### Arguments
#### `Identifier: String|StoreInterface`
The store identifier. It can be either its string name or its StoreInterface instance returned by a createStore or getStoreByName method.
#### `memoFn: (state) -> any`
A function to optimize performance. return the subset of the state the component is dependent on. The component will only be updated when the subset changes. Optional.

# <a name="migration">Migrating from v1.0 to v1.1</a>
- createStore now receives 3 arguments instead of an object with 3 properties.
- the name argument is now required even if only one store is being used.
```javascript
// v1.0
createStore({state: 0});
createStore({
  name: 'store',
  state: 0,
  reducer(state, data) {
    return state + data;
  }
})
// v1.1
createStore('myStore', 0);
createStore('store', 0, (state, data) => state + data);
```
