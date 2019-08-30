import { createStore } from '..';

describe('store.subscribe', () => {
  test('Subscribe needs function as argumentt' , () => {
    const store = createStore('store1', 0);
    expect(() => store.subscribe(null)).toThrow()
  });

  test('Subscribe callback works', () => {
    const store = createStore('store2', 0);
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    store.setState(1);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(1, 1);
  });

  test('Subscribe callback for reducer-based store works', () => {
    const store = createStore('store3', 0, ((state, action) => state + action.payload));
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    store.dispatch({ type: 'test', payload: 1 });
    expect(subscriber).toHaveBeenCalledWith(1, { type: 'test', payload: 1 });
  });

  test('cant resubscribe with the same function', () => {
    const store = createStore('store4', 0);
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    store.subscribe(subscriber);
    store.subscribe(subscriber);
    store.subscribe(subscriber);
    store.subscribe(subscriber);
    store.subscribe(subscriber);
    expect(subscriber).not.toHaveBeenCalled();
    store.setState(1);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
  test('unsubscribe works', () => {
    const store = createStore('store5', 0);
    const subscriber = jest.fn();
    const unsubscribe = store.subscribe(subscriber);
    expect(unsubscribe).toBeInstanceOf(Function);
    store.setState(1);
    unsubscribe();
    store.setState(2);
    expect(subscriber).toHaveBeenCalledTimes(1);
  })
});
