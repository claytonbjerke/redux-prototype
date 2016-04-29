import React from 'react';
import ReactDOM from 'react-dom';
import {
    combineReducers,
    createStore
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

let todoApp = combineReducers({
    todos,
    visibilityFilter
});
let store = createStore(todoApp);

const {
    Component
} = React;

const FilterLink = ({
    filter,
    currentFilter,
    children
}) => {
    if(currentFilter === filter) {
        return <span>{children}</span>
    }
    return (
        <a href='#'
           onClick={e => {
               e.preventDefault();
               store.dispatch({
                   type: 'SET_VISIBLITY_FILTER',
                   filter
               });
           }}
        >
            {children}
        </a>
    );
};

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
};

let nextTodoId = 0;
class TodoApp extends Component {
    render() {
        const {
            todos,
            visibilityFilter
        } = this.props;
        const visibleTodos = getVisibleTodos(
            todos,
            visibilityFilter
        );
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/>
                <button
                    onClick={() => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            text: this.input.value,
                            id: nextTodoId++
                        })
                        this.input.value = '';
                    }}>
                    add todo
                </button>
                <ul>
                    {visibleTodos.map(todo =>
                        <li key={todo.id}
                            onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                })
                            }}
                            style={{
                                textDecoration:
                                    todo.completed ?
                                        'line-through' :
                                        'none'
                            }}>
                            {todo.text}
                        </li>
                    )}
                </ul>
                <p>
                    Show:
                    {' '}
                    <FilterLink
                        filter={'SHOW_ALL'}
                        currentFilter={visibilityFilter}
                    >
                        All
                    </FilterLink>
                    {' '}
                    <FilterLink
                        filter={'SHOW_ACTIVE'}
                        currentFilter={visibilityFilter}
                    >
                        Active
                    </FilterLink>
                    {' '}
                    <FilterLink
                        filter={'SHOW_COMPLETED'}
                        currentFilter={visibilityFilter}
                    >
                        Completed
                    </FilterLink>
                </p>
            </div>
        );
    }
}


const render = () => {
    ReactDOM.render(
        <TodoApp
            {...store.getState()}/>,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();

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

//testAddTodos();
//testToggleTodo();
//console.log('All Passed!');
