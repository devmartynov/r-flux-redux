(function() {
    class Store {
        _state = {todos: []};
        _listeners = [];
        _reducer = null;

        constructor(reducer) {
           this._reducer = reducer;
           this.dispatch = this.dispatch.bind(this);
        }

        subscribe(listener) {
            this._listeners.push(listener);
        }

        dispatch(action) {
            const nextState = this._reducer(this._state, action);

            if (nextState !== this._state) {
                this._state = nextState;
                this._listeners.forEach((listener) => {
                    listener(this._state);
                });
            }
        };

        getState() {
            return this._state;
        }
    }

    function reducer(state, action) {
        if (action.type === 'ADD_TODO') {
            return { ...state, todos: [...state.todos, action.title] };
        }
        return state;
    }

    function addTodo(title) {
        return {
            type: 'ADD_TODO',
            title,
        };
    }

    let store = new Store(reducer);
    applyMiddlewares(store, [logger]);

    function logger(store) {
        const dispatch = store.dispatch;

        return (action) => {
            console.log(1, {action, state: store.getState()});
            dispatch(action);
            console.log(2, {action, state: store.getState()});
        }
    }

    function applyMiddlewares(store, middlewares) {
        middlewares = middlewares.slice().reverse();

        middlewares.forEach(middleware => {
            store.dispatch = middleware(store);
        });
    }

    function TodoView(todoInfo) {
        return `<li>${todoInfo}</li>`;
    }

    class Todos {
        itemView = null;
        todoListElement = null;

        constructor(itemView) {
            this.itemView = itemView;
            this.todoListElement  = document.querySelector('#todo_list');
            this.render = this.render.bind(this);
        }

        render(state) {
            this.todoListElement.innerHTML = state.todos.map((todo) => this.itemView(todo)).join('');
        }
    }

    const todosComponent = new Todos(TodoView);

    const form = document.querySelector('#todo_form');
    const input = document.querySelector('#form_input_title');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        store.dispatch(addTodo(input.value || 'no value'));
        input.value = "";
    });

    store.subscribe(todosComponent.render);
})()
