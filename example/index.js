import React from 'react';
import ReactDOM from 'react-dom';
import { StatefulHello, AnotherComponent } from './basic';
import { AddTodo, TodoList } from './reducers';
import SubscriptionExample from './subscribe';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <React.Fragment>
      <h1>Simple example</h1>
      <p>A simple store without reducer logic</p>
      <StatefulHello />
      <AnotherComponent />
      <hr/>
      <h1>Advanced example</h1>
      <p>A reducer-powered store</p>
      <AddTodo />
      <TodoList />
      <hr/>
      <h1>Subscribe example</h1>
      <p>Get notified when the state changes!</p>
      <SubscriptionExample />
    </React.Fragment>,
    document.querySelector('#app')
  );
});
