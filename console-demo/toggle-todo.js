import expect from 'expect';
import deepFreeze from 'deep-freeze';

const toggleTodo = (todo) => {
    /*
    stage-2 preset:
    return {
        ...todo,
        completed: !todo.completed
    };
     */
    return Object.assign({}, todo, {
        completed: !todo.completed
    });
};

const testToggleTodo = () => {
    const todoBefore = {
        id: 0,
        text: 'Learn Redux',
        completed: false
    };
    const todoAfter = {
        id: 0,
        text: 'Learn Redux',
        completed: true
    };

    expect(
        toggleTodo(todoBefore)
    ).toEqual(todoAfter)
};

testToggleTodo();
console.log('All Passed!');
