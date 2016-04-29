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
    children,
    onClick
}) => {
    if(currentFilter === filter) {
        return <span>{children}</span>
    }
    return (
        <a href='#'
           onClick={e => {
               e.preventDefault();
               onClick(filter);
           }}
        >
            {children}
        </a>
    );
};

const Footer = ({
    visibilityFilter,
    onFilterClick
}) => {
    return (
        <p>
            Show:
            {' '}
            <FilterLink
                filter={'SHOW_ALL'}
                currentFilter={visibilityFilter}
                onClick={onFilterClick}
            >
                All
            </FilterLink>
            {' '}
            <FilterLink
                filter={'SHOW_ACTIVE'}
                currentFilter={visibilityFilter}
                onClick={onFilterClick}
            >
                Active
            </FilterLink>
            {' '}
            <FilterLink
                filter={'SHOW_COMPLETED'}
                currentFilter={visibilityFilter}
                onClick={onFilterClick}
            >
                Completed
            </FilterLink>
        </p>
    );
}

// presentational Component
const Todo = ({
    onClick,
    completed,
    text
}) => {
    return (
        <li key={todo.id}
            onClick={onClick}
            style={{
                textDecoration:
                    completed ?
                        'line-through' :
                        'none'
            }}>
            {text}
        </li>
    )
};

const Todolist = ({
    todos,
    onTodoClick
}) => {
    return (
        <ul>
            {todos.map(todo =>
                <Todo
                    key={todo.id}
                    {...todo}
                    onClick={() => onTodoClick(todo.id)}
                />
            )}
        </ul>
    )
};

const AddTodo = ({
    onAddClick
}) => {
    let input;
    return (
        <div>
            <input ref={node => {
                input = node;
            }}/>
            <button
                onClick={() => {
                    onAddClick(input.value);
                    input.value = '';
                }}>
                add todo
            </button>
        </div>
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
const TodoApp = ({
    todos,
    visibilityFilter
}) => (
    <div>
        <AddTodo
            onAddClick={text =>
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text
                })
            }
        />
        <Todolist
            todos={getVisibleTodos(
                todos,
                visibilityFilter
            )}
            onTodoClick={id =>
                store.dispatch({
                    type:'TOGGLE_TODO',
                    id
                })
            }
        />
        <Footer
            visibilityFilter={visibilityFilter}
            onFilterClick={filter =>
                store.dispatch({
                    type: 'SET_VISIBLITY_FILTER',
                    filter
                })
            }
        />
    </div>
);


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
