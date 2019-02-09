import React from 'react';
import ReactDOM from 'react-dom';
import { StatefulHello, AnotherComponent } from './basic';
import { AddTodo, TodoList } from './reducers';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <React.Fragment>
      <h1>Simple example</h1>
      <p>A simple store without reducer logic</p>
      <StatefulHello />
      <AnotherComponent />
      <h1>Advanced example</h1>
      <p>A namespace and reducer-powered store, using callback</p>
      <AddTodo />
      <TodoList />
    </React.Fragment>,
    document.querySelector('#app')
  );
});
