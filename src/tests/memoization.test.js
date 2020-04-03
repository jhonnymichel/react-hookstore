import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { createStore, useStore } from '..';

describe('store memoization', () => {
  it('Should not update components if setState is called with the same previous state', (done) => {
    const store = createStore('store', 0);
    const componentRenderCount = jest.fn();
    const anotherComponentRenderCount = jest.fn();

    const Component = (props) => {
      const [state, setState] = useStore(store);

      componentRenderCount();

      return (
        <button onClick={() => setState(state+1)}>
          This button has been clicked {state} times
        </button>
      );
    }

    const AnotherComponent = (props) => {
      const [state] = useStore(store);

      anotherComponentRenderCount();

      return (
        <div>
          {state}
        </div>
      );
    }

    const renderedComponent = mount(<Component />);
    const renderedAnotherComponent = mount(<AnotherComponent />);

    requestAnimationFrame(() => {
      expect(componentRenderCount).toHaveBeenCalledTimes(1);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(1);

      renderedComponent.find('button').simulate('click');
      expect(componentRenderCount).toHaveBeenCalledTimes(2);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.setState(3));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      act(() => store.setState(3));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      act(() => store.setState(3));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      act(() => store.setState(1));
      expect(componentRenderCount).toHaveBeenCalledTimes(4);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(4);

      act(() => store.setState(1));
      expect(componentRenderCount).toHaveBeenCalledTimes(4);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(4);

      expect(renderedComponent.text()).toBe('This button has been clicked 1 times')
      expect(renderedAnotherComponent.text()).toBe('1')

      done();
    })
  });

  it('Should always update components if state is complex and no mapDeps is provided', (done) => {
    const store = createStore('complexState', { number: 0 });
    const componentRenderCount = jest.fn();
    const anotherComponentRenderCount = jest.fn();

    const Component = (props) => {
      const [state, setState] = useStore(store);

      componentRenderCount();

      return (
        <button onClick={() => setState({ number: state.number + 1})}>
          This button has been clicked {state.number} times
        </button>
      );
    }

    const AnotherComponent = (props) => {
      const [state] = useStore(store);

      anotherComponentRenderCount();

      return (
        <div>
          {state.number}
        </div>
      );
    }

    const renderedComponent = mount(<Component />);
    const renderedAnotherComponent = mount(<AnotherComponent />);

    requestAnimationFrame(() => {
      expect(componentRenderCount).toHaveBeenCalledTimes(1);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(1);

      renderedComponent.find('button').simulate('click');
      expect(componentRenderCount).toHaveBeenCalledTimes(2);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.setState({ number: 3 }));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      act(() => store.setState({ number: 3 }));
      expect(componentRenderCount).toHaveBeenCalledTimes(4);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(4);

      act(() => store.setState({ number: 3 }));
      expect(componentRenderCount).toHaveBeenCalledTimes(5);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(5);

      act(() => store.setState({ number: 1 }));
      expect(componentRenderCount).toHaveBeenCalledTimes(6);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(6);

      act(() => store.setState({ number: 1 }));
      expect(componentRenderCount).toHaveBeenCalledTimes(7);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(7);

      expect(renderedComponent.text()).toBe('This button has been clicked 1 times')
      expect(renderedAnotherComponent.text()).toBe('1')

      done();
    })
  });

  it('Should only update component if the field it wants is updated', (done) => {
    const store = createStore('complexStore2', {foo: { bar: 2 }, baz: 3});

    const componentRenderCount = jest.fn();
    const anotherComponentRenderCount = jest.fn();

    const memoBar = (state) => state.foo && state.foo.bar;
    const memoBaz = (state) => state.baz;

    const Component = (props) => {
      const [state] = useStore(store, memoBar);

      componentRenderCount();

      return (
        <div>
          {state.foo && state.foo.bar}
        </div>
      );
    }

    const AnotherComponent = (props) => {
      const [state] = useStore(store, memoBaz);

      anotherComponentRenderCount();

      return (
        <div>
          {state.baz}
        </div>
      );
    }

    const renderedComponent = mount(<Component />);
    const renderedAnotherComponent = mount(<AnotherComponent />);

    requestAnimationFrame(() => {
      expect(componentRenderCount).toHaveBeenCalledTimes(1);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(1);

      act(() => store.setState({...store.getState(), baz: 2}));
      expect(componentRenderCount).toHaveBeenCalledTimes(1);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.setState({...store.getState(), foo: {bar: 2}}));
      expect(componentRenderCount).toHaveBeenCalledTimes(1);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.setState({...store.getState(), foo: {bar: 3}}));
      expect(componentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.setState({...store.getState()}));
      expect(componentRenderCount).toHaveBeenCalledTimes(2);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.setState({...store.getState(), foo: {}}));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.setState({ foo: { bar: 3 }, baz: 10 }));
      expect(componentRenderCount).toHaveBeenCalledTimes(4);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      done();
    })
  });
});

describe('store memoization with dispatch', () => {
  it('Should not update components if setState is called with the same previous state', (done) => {
    const store = createStore('reduceredStore', 0, (state, payload) => payload);
    const componentRenderCount = jest.fn();
    const anotherComponentRenderCount = jest.fn();

    const Component = (props) => {
      const [state, dispatch] = useStore(store);

      componentRenderCount();

      return (
        <button onClick={() => dispatch(state + 1)}>
          This button has been clicked {state} times
        </button>
      );
    }

    const AnotherComponent = (props) => {
      const [state] = useStore(store, );

      anotherComponentRenderCount();

      return (
        <div>
          {state}
        </div>
      );
    }

    const renderedComponent = mount(<Component />);
    const renderedAnotherComponent = mount(<AnotherComponent />);

    requestAnimationFrame(() => {
      expect(componentRenderCount).toHaveBeenCalledTimes(1);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(1);

      renderedComponent.find('button').simulate('click');
      expect(componentRenderCount).toHaveBeenCalledTimes(2);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(2);

      act(() => store.dispatch(3));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      act(() => store.dispatch(3));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      act(() => store.dispatch(3));
      expect(componentRenderCount).toHaveBeenCalledTimes(3);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(3);

      act(() => store.dispatch(1));
      expect(componentRenderCount).toHaveBeenCalledTimes(4);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(4);

      act(() => store.dispatch(1));
      expect(componentRenderCount).toHaveBeenCalledTimes(4);
      expect(anotherComponentRenderCount).toHaveBeenCalledTimes(4);

      expect(renderedComponent.text()).toBe('This button has been clicked 1 times')
      expect(renderedAnotherComponent.text()).toBe('1')

      done();
    })
  });
});
