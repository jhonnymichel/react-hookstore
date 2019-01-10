import { createStore, getStoreByName } from '..';

describe('createStore', () => {
  it('Should create an store and return its public interface', () => {
    const store = createStore({state: 0, name: '1'});
    expect(store.getState()).toBe(0);
    expect(store.name).toBe('1');
    expect(Object.keys(store)).toEqual(['name', 'setState', 'getState']);

    const store2 = createStore({state: 0});
    expect(store2.name).toBe('store');
  });

  it('Should not allow stores with the same name to be created', () => {
    const store = createStore({state: 0, name: '2'});
    expect(store).toBeTruthy();
    expect(() => {
      createStore({ name: '2' });
    }).toThrow();
  });
});

describe('getStoreByName', () => {
  it('Should return an store if it exists', () => {
    createStore({name: 'test'});

    const store = getStoreByName('test');
    expect(Object.keys(store)).toEqual(['name', 'setState', 'getState']);
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
    const store = createStore({state: 0, name: '3'});
    expect(store.getState()).toBe(0);
    store.setState(1);
    expect(store.getState()).toBe(1);
    store.setState({});
    expect(store.getState()).toEqual({});
  });

  test('store.setState must use the provided reducer to handle state update', () => {
    const reducer = jest.fn();
    const store = createStore({state: 0, name: '4', reducer});
    store.setState();
    store.setState();
    store.setState();
    expect(reducer).toHaveBeenCalledTimes(3);
  });

  test('store.setState must update state according to reducer returned value', () => {
    const reducer = (state, action) => 5 + action;
    const store = createStore({state: 0, name: '5', reducer});
    store.setState(1);
    expect(store.getState()).toBe(6);
  });

  test('store.setState must pass previous state and action parameters to reducer', () => {
    const reducer = jest.fn();
    const store = createStore({state: 0, name: '6', reducer});
    store.setState('foo');
    expect(reducer).toHaveBeenCalledWith(0, 'foo');
  });
});
