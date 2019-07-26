import React, { useState } from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { createStore, useStore } from '..';

describe('useStore', () => {
  const store = createStore('store', 0);

  beforeEach(() => {
    act(() => {
      store.setState(0);
    })
  });

  it('Should throw an error if an inexistent store is referenced', () => {
    const Component = (props) => {
      useStore('Unreal Store');

      return <div>Hi</div>;
    }

    expect(() => {
      shallow(<Component />);
    }).toThrow();
  });

  it('Should provide the component with a functional state and setState pair', (done) => {
    const Component = (props) => {
      const [state, setState] = useStore('store');

      return (
        <button onClick={() => setState(state+1)}>
          This button has been clicked {state} times
        </button>
      );
    }

    const rendered = mount(<Component />);

    requestAnimationFrame(() => {
      expect(rendered.text()).toBe('This button has been clicked 0 times');
      rendered.find('button').simulate('click');
      expect(rendered.text()).toBe('This button has been clicked 1 times');
      rendered.find('button').simulate('click');
      expect(rendered.text()).toBe('This button has been clicked 2 times');
      done();
    });
  });

  it('Should provide the component with correct store based on class identifier', (done) => {
    const Component = (props) => {
      const [state, setState] = useStore(store);

      return (
        <button onClick={() => setState(state+1)}>
          This button has been clicked {state} times
        </button>
      );
    }

    const rendered = mount(<Component />);

    requestAnimationFrame(() => {
      expect(rendered.text()).toBe('This button has been clicked 0 times');
      rendered.find('button').simulate('click');
      expect(rendered.text()).toBe('This button has been clicked 1 times');
      rendered.find('button').simulate('click');
      expect(rendered.text()).toBe('This button has been clicked 2 times');
      done();
    });
  });

  it('Should update all components if setState is called from anywhere', (done) => {
    const Component = (props) => {
      const [state, setState] = useStore('store');

      return (
        <button onClick={() => setState(state+1)}>
          This button has been clicked {state} times
        </button>
      );
    }

    const AnotherComponent = (props) => {
      const [state] = useStore('store');

      return (
        <div>
          {state}
        </div>
      );
    }

    const renderedComponent = mount(<Component />);
    const renderedAnotherComponent = mount(<AnotherComponent />);

    requestAnimationFrame(() => {
      expect(renderedComponent.text()).toBe('This button has been clicked 0 times');
      expect(renderedAnotherComponent.text()).toBe('0');
      renderedComponent.find('button').simulate('click');
      expect(renderedComponent.text()).toBe('This button has been clicked 1 times');
      expect(renderedAnotherComponent.text()).toBe('1');
      act(() => store.setState('Hello'));
      expect(renderedComponent.text()).toBe('This button has been clicked Hello times');
      expect(renderedAnotherComponent.text()).toBe('Hello');
      done();
    })
  });

  test('Different stores work in hamorny', (done) => {
    const countStore = createStore('countStore', 0);
    const nameStore = createStore('nameStore', '');

    const HelloWorld = (props) => {
      const [name] = useStore(nameStore);
      const [count] = useStore(countStore);

      return (
        <div>Hello, {name}! you have been here {count} times!</div>
      )
    };

    const rendered = mount(<HelloWorld />);
    
    requestAnimationFrame(() => {
      expect(rendered.text()).toBe('Hello, ! you have been here 0 times!');

      act(() => {
        countStore.setState(1);
      })
      expect(rendered.text()).toBe('Hello, ! you have been here 1 times!');
  
      act(() => {
        nameStore.setState('Richard');
      })
      expect(rendered.text()).toBe('Hello, Richard! you have been here 1 times!');
      done();
    })
  });

  test('When a component unmounts, the store removes its reference', (done) => {
    const store = createStore('unmountTestStore', 0);
    const consoleError = jest.spyOn(global.console, 'error');

    const Component = (props) => {
      const [state] = useStore(store);

      return <div>{state}</div>
    };

    const rendered = mount(<Component />);

    
    requestAnimationFrame(() => {
      expect(rendered.text()).toBe('0');

      act(() => {
        store.setState(1);
      });
      expect(rendered.text()).toBe('1');
      rendered.unmount();
      act(() => {
        store.setState(3);
      })
  
      // react throws a console error when trying to call setState on unmounted components
      expect(consoleError).not.toHaveBeenCalled();
      done();
    })
  });
});
