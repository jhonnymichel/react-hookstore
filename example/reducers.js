import React from 'react';
import { createStore, useStore } from '../src';

// this one is more complex, it has a name and a reducer function
createStore({
  name: 'todoList',
  state: {
    idCount: 0,
    todos: [{ id: 0, text: 'buy milk' }],
  },
  reducer(state, action) {
    // when a reducer is being used, you must return a new state object
    switch (action.type) {
      case 'create':
        const id = ++state.idCount;
        return {
          ...state,
          todos: [
            ...state.todos,
            { id, text: action.payload }
          ]
        }
      case 'delete':
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload)
        }
      default:
        return state;
    }
  }
});

export function AddTodo() {
  // Grab the correct store by specifying its namespace
  const [ state, dispatch ] = useStore('todoList');

  const onSubmit = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const todo = input.value;
    input.value = '';
    dispatch({ type: 'create', payload: todo });
  }

  return (
    <form onSubmit={onSubmit}>
      <input></input>
      <button>Create TODO</button>
    </form>
  )
}

export function TodoList() {
  // Grab the correct store by specifying its namespace
  const [ state, dispatch ] = useStore('todoList');
  const deleteTodo = id => dispatch({ type: 'delete', payload: id })
  return (
    <ul>
      <h2>TODOLIST</h2>
      { state.todos.map(todo =>
        <li key={todo.id}>
          { todo.text } <button onClick={() => deleteTodo(todo.id)} type="button">X</button>
        </li>)
      }
    </ul>
  )
}
