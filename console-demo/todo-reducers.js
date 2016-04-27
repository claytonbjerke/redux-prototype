import {
    combineReducers
} from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBLITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

//combine reducers pattern
const todoApp = combineReducers({
    todos,
    visibilityFilter
});
// shortened version above
// const todoApp = (state = {}, action) => {
//     return {
//         todos: todos(state.todos, action),
//         visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//     };
// };

const testAddTodos = () => {
    const stateBefore = [];
    const action = {
        id: 0,
        type: 'ADD_TODO',
        text: 'Learn Redux'
    };
    const stateAfter = [{
        id: 0,
        text: 'Learn Redux',
        completed: false
    }];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter)

};

const testToggleTodo = () => {
    const beforeState = [{
        id: 0,
        text: 'Learn Redux',
        completed: false
    }, {
        id: 1,
        text: 'sell dog',
        completed: false
    }];
    const action = {
        id: 1,
        text: 'sell dog',
        type: 'TOGGLE_TODO'
    };
    const afterState = [{
        id: 0,
        text: 'Learn Redux',
        completed: false
    }, {
        id: 1,
        text: 'sell dog',
        completed: true
    }];

    deepFreeze(beforeState);
    deepFreeze(action);

    expect(
        todos(beforeState, action)
    ).toEqual(afterState)
};

testAddTodos();
testToggleTodo();
console.log('All Passed!');
