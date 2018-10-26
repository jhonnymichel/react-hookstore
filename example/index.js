import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, useStore } from '../src/index';

const defaultStyles = {
  padding: 10, backgroundColor: 'navy', marginTop: 10, color: 'white'
}

// Creating a nameless store, do that if you do not wish to have multiple stores in your app
createStore({ state: 1 });

function StatefullHello() {
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

function AnotherComponent() {
  // you can name the state whateve you want
  const [ value ] = useStore();
  return (
    <div style={{ ...defaultStyles, backgroundColor: 'lightgray', color: 'black' }}>
      <h1>Hello, this is a second component, with no relation to the one on the top</h1>
      <h2>But it is still aware of how many times the button was clicked: {value} </h2>
    </div>
  )
}

// this one is more complex, it has a name and a reducer function
createStore({
  name: 'todoList',
  state: ['buy milk'],
  reducer(prevState, value) {
    return [ ...prevState, value ];
  }
});

function AddTodo() {
  // Grab the correct store by specifying its namespace
  const [ todos, createTodo ] = useStore('todoList');

  const onSubmit = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const todo = input.value;
    input.value = '';
    createTodo(todo);
  }

  return (
    <form onSubmit={onSubmit} style={{ ...defaultStyles, backgroundColor: 'darkblue' }}>
      <input></input>
      <button>Create TODO</button>
    </form>
  )
}

function TodoList() {
  // Grab the correct store by specifying its namespace
  const [ todos ] = useStore('todoList');

  return (
    <ul style={{ ...defaultStyles, backgroundColor: 'gold' }}>
      <h2>TODOLIST</h2>
      { todos.map(todo => <li>{ todo }</li>) }
    </ul>
  )
}

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <React.Fragment>
      <StatefullHello />
      <AnotherComponent/>
      <hr/>
      <AddTodo />
      <TodoList />
    </React.Fragment>,
    document.querySelector('#app')
  );
});
