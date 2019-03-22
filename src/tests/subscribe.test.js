import { createStore } from '..';

describe('subscribe', () => {

  const reducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return { ...state, count: state.count + 1 };
        case 'decrement':
            return { ...state, count: state.count -1 };
        case 'reset':
            return { ...state, count: 1 };
        default:
        return state;
    }
  };
  const reducer2 = (state, action) => {
    switch (action.type) {
        case 'increment':
            return { ...state, count: state.count + 1 };
        case 'decrement':
            return { ...state, count: state.count -1 };
        case 'reset':
            return { ...state, count: 1 };
        default:
        return state;
    }
  };
  let store1 = createStore('store1', { count: 1 }, reducer);
  let store2 = createStore('store2', { count: 1 }, reducer2);

  afterEach(() => {
    store1.unsubscribe();
    store2.unsubscribe();
    store1.dispatch({type:'reset'});
    store2.dispatch({type:'reset'});
  })
  
  test('subscribe needs array as first argument' , () => {
    expect(() => store1.subscribe(null, () => {})).toThrow()
  });

  test('subscribe needs function as second argument' , () => {
    expect(() => store1.subscribe([], null)).toThrow()
  });

  test('subscribe callback works', () => {
    store1.subscribe(['decrement'], (action, state) => {
      expect(action.type).toBe("decrement");
      expect(state.count).toBe(0);
    });
    store1.dispatch({type:'decrement'});
  });

  test('cant update active subscription', () => {
    store1.subscribe(['decrement'], (action, state) => {});
    expect(() => store1.subscribe(['increment'], () => {})).toThrow();
  });
  
  test('unsubscribe works', () => {
    store1.subscribe(['decrement'], (action, state) => {});
    store1.unsubscribe();
    store1.subscribe([], () => {});
  });

  test('subscribe callback works with multiple actions', () => {
    store1.subscribe([ 'decrement', 'increment'], (action, state) => {
      if(action === "decrement")
        expect(state.count).toBe(0);
      if(action === "increment")
        expect(state.count).toBe(1);
    })

    store1.dispatch({type:'decrement'});
    store1.dispatch({type:'increment'});
  });

  test('multiple subscriptions works without interfering', () => {
    store1.subscribe(['decrement'], (action, state) => { 
        expect(action.type).toBe('decrement');
        expect(state.count).toBe(0);
    });
    store2.subscribe(['increment'], (action, state) => {
         expect(action.type).toBe('increment');
         expect(state.count).toBe(2);
    });
    store1.dispatch({type:'decrement'});
    store2.dispatch({type:'increment'});
  });

});
