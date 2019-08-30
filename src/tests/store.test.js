import { createStore, getStoreByName, subscribe, unsubscribe } from '..';

describe('createStore', () => {
  it('Should create an store and return its public interface', () => {
    const store = createStore('store1', 0);
    expect(store.getState()).toBe(0);
    expect(store.name).toBe('store1');
    expect(Object.keys(store)).toEqual(['name', 'setState', 'getState', 'subscribe']);

    const store2 = createStore('store2', 0, (state, action) => action.payload);
    expect(store2.getState()).toBe(0);
    expect(store2.name).toBe('store2');
    expect(Object.keys(store2)).toEqual(['name', 'dispatch', 'getState', 'subscribe']);
  });

  it('Should not allow stores with the same name to be created', () => {
    const store = createStore('unique', 0);
    expect(store).toBeTruthy();
    expect(() => {
      createStore('unique');
    }).toThrow();
  });

  it('Should not allow store names to not be a string', () => {
    expect(() => {
      createStore(42, 0);
    }).toThrow();
  });
});

describe('getStoreByName', () => {
  it('Should return an store if it exists', () => {
    createStore('test');

    const store = getStoreByName('test');
    expect(Object.keys(store)).toEqual(['name', 'setState', 'getState', 'subscribe']);
    expect(store.name).toBe('test');
  })

  it('Should throw an error if store does not exist', () => {
    expect(() => {
      getStoreByName('Unexistent store');
    }).toThrow();
  });
});

describe('store', () => {
  test('store.setState must update store value, store.getState retrieves the value', () => {
    const store = createStore('store3', 0);
    expect(store.getState()).toBe(0);
    store.setState(1);
    expect(store.getState()).toBe(1);
    store.setState({});
    expect(store.getState()).toEqual({});
  });

  test('store.setState should not take effect when called for a reducered store', () => {
    const consoleWarn = jest.spyOn(global.console, 'warn');
    const reducer = jest.fn();
    const store = createStore('reduceredStore', 0, reducer);
    store.setState(1);
    expect(consoleWarn).toHaveBeenCalled();
    expect(reducer).not.toHaveBeenCalled();
    expect(store.getState()).toBe(0);
  });

  test('store.dispatch should not take effect when called for a non-reducered store', () => {
    const consoleWarn = jest.spyOn(global.console, 'warn');
    const store = createStore('normalStore', 0);
    const setState = jest.spyOn(store, 'setState');
    store.dispatch(1);
    expect(consoleWarn).toHaveBeenCalled();
    expect(setState).not.toHaveBeenCalled();
    expect(store.getState()).toBe(0);
  });

  test('store.dispatch must use the provided reducer to handle state update', () => {
    const reducer = jest.fn();
    const store = createStore('store4', 0, reducer);
    store.dispatch();
    store.dispatch();
    store.dispatch();
    expect(reducer).toHaveBeenCalledTimes(3);
  });

  test('store.setState must update state according to reducer returned value', () => {
    const reducer = (state, action) => 5 + action;
    const store = createStore('store5', 0, reducer);
    store.dispatch(1);
    expect(store.getState()).toBe(6);
  });

  test('store.setState must pass previous state and action parameters to reducer', () => {
    const reducer = jest.fn();
    const store = createStore('store6', 0, reducer);
    store.dispatch('foo');
    expect(reducer).toHaveBeenCalledWith(0, 'foo');
  });
	
  test('store.setState callback must be called', () => {
    const store = createStore('store7', 'foo');
    store.setState('bar', (newState) => {
      expect(newState).toBe('bar');
    });
  });

  test('store.setState callback must return new state', () => {
    const callback = jest.fn ();
    const store = createStore('store8', 0);
    store.setState(10,callback);
    expect(callback).toHaveBeenCalled();
  });
  
  test('store.dispatch callback must be called', () => {
    const reducer = jest.fn();
    const callback = jest.fn();
    const store = createStore('store9', 'foo', reducer);
    store.dispatch('bar',callback);
    expect(callback).toHaveBeenCalled();
  });

  test('store.dispatch callback must return new state', () => {
  	const reducer = (state, action) => action;
    const store = createStore('store10', 'foo', reducer);
    store.dispatch('bar', (newState) => {
      expect(newState).toBe('bar');
    });
  });

});
