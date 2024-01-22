(function() {

    class TodoStore {
        _attachedComponents = [];
        _todos = [];

        constructor(dispatcher) {
            dispatcher.register(this);
        }

        attachComponent(component) {
            this._attachedComponents.push(component);
        }

         update(action) {
            if (action.type === ActionTypes.ADD_TODO) {
                this._todos.push(action.title);
            }
            this._attachedComponents.forEach(component => {
                component.render(this._todos);
            });
        }

        getTodos() {
            return this._todos;
        }
    }

    class Dispatcher {
        _stores = [];

        register(store) {
            this._stores.push(store);
        }

        dispatch(action) {
            this._stores.forEach((store) => {
                store.update(action);
            });
        }
    }

    class Todos {
        itemView = null;
        todoListElement = null;

        constructor(itemView) {
            this.itemView = itemView;
            this.todoListElement  = document.querySelector('#todo_list');
        }

        render(todos) {
            this.todoListElement.innerHTML = todos.map((todo) => this.itemView(todo)).join('');
        }
    }

    function TodoView(todoInfo) {
        return `<li>${todoInfo}</li>`;
    }

    const todosComponent = new Todos(TodoView);

    const dispatcher = new Dispatcher();
    const store = new TodoStore(dispatcher);
    store.attachComponent(todosComponent);

    const ActionTypes = {
      ADD_TODO: 'ADD_TODO',
    };
    const Actions = {
      addTodo(title) {
        dispatcher.dispatch({
          type: ActionTypes.ADD_TODO,
          title,
        });
      },
    }

    const form = document.querySelector('#todo_form');
    const input = document.querySelector('#form_input_title');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        Actions.addTodo(input.value || 'no value')
        input.value = "";
    });
})();
