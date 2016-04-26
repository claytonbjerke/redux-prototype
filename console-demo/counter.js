import {
    createStore
} from 'redux';
import expect from 'expect';
import colors from 'colors';

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};


const store = createStore(counter);

const mericaPrint = () => {
    var state = 'Current Count: ' + store.getState();
    console.log(state.america);
};

store.subscribe(mericaPrint);
mericaPrint();

store.dispatch({
    type: 'INCREMENT'
});
store.dispatch({
    type: 'DECREMENT'
});
store.dispatch({
    type: 'INCREMENT'
});
