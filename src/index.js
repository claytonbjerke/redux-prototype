import React from 'react';
import ReactDOM from 'react-dom';
import {
    combineReducers,
    createStore
} from 'redux';
import {Provider, connect} from 'react-redux';
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

let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBLITY_FILTER',
        filter
    };
};

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};

const {
    Component
} = React;

const Link = ({
    active,
    children,
    onClick
}) => {
    if(active) {
        return <span>{children}</span>
    }
    return (
        <a href='#'
           onClick={e => {
               e.preventDefault();
               onClick();
           }}
        >
            {children}
        </a>
    );
};

const mapStateToLinkProps = (
    state,
    ownProps
) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
}

const mapDispatchToLinkProps = (
    dispatch,
    ownProps
) => {
    return {
        onClick: () => {
            dispatch(
                setVisibilityFilter(ownProps.filter)
            );
        }
    }
};

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

const Footer = () => {
    return (
        <p>
            Show:
            {' '}
            <FilterLink
                filter={'SHOW_ALL'}
            >
                All
            </FilterLink>
            {' '}
            <FilterLink
                filter={'SHOW_ACTIVE'}
            >
                Active
            </FilterLink>
            {' '}
            <FilterLink
                filter={'SHOW_COMPLETED'}
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

let AddTodo = ({dispatch}) => {
    let input;
    return (
        <div>
            <input autoFocus ref={node => {
                input = node;
            }}/>
            <button
                onClick={() => {
                    dispatch(addTodo(input.value));
                    input.value = '';
                }}>
                add todo
            </button>
        </div>
    );
};
AddTodo = connect()(AddTodo); // default behavior is to not subscribe to store and dispatch in second arg

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

const mapStateToTodoListProps = (
    state
) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
        )
    };
};
const mapDispatchToTodoListProps = (
    dispatch
) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id));
        }
    };
};
const TodoList = ({
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
const VisibleTodoList = connect(
    mapStateToTodoListProps, // tells how to calculate the props through inject from current redux state
    mapDispatchToTodoListProps // the callbacks props to inject from the dispatch func on redux store
)(TodoList);

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);

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
