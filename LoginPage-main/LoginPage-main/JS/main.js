// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const prioritySelect = document.querySelector('.priority-select');
const filterButtons = document.querySelectorAll('.filter-btn');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
filterButtons.forEach(button => button.addEventListener('click', filterTodos));
toDoList.addEventListener('dragover', dragOver);
toDoList.addEventListener('drop', drop);
toDoList.addEventListener('dragstart', dragStart);
toDoList.addEventListener('dragend', dragEnd);

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Functions
function addToDo(event) {
    event.preventDefault();

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    toDoDiv.setAttribute('draggable', true);

    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }

    newToDo.innerText = toDoInput.value;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    const priority = prioritySelect.value;
    newToDo.setAttribute('data-priority', priority);
    toDoDiv.classList.add(priority.toLowerCase() + '-todo');

    savelocal(toDoInput.value, priority);

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
    toDoInput.value = '';
}

function deletecheck(event) {
    const item = event.target;

    if (item.classList[0] === 'delete-btn') {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);
        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        });
    }

    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }
}

function savelocal(todo, priority) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({ text: todo, priority: priority });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(function (todo) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);
        toDoDiv.setAttribute('draggable', true);

        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text;
        newToDo.classList.add('todo-item');
        newToDo.setAttribute('data-priority', todo.priority);
        toDoDiv.appendChild(newToDo);
        toDoDiv.classList.add(todo.priority.toLowerCase() + '-todo');

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(t => t.text === todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}

// Filter Todos by Priority
function filterTodos(event) {
    const priority = event.target.dataset.priority;
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        if (priority === 'All' || todo.querySelector('.todo-item').dataset.priority === priority) {
            todo.style.display = 'flex';
        } else {
            todo.style.display = 'none';
        }
    });
}

// Drag and Drop Functions
// Drag and Drop Functions
let draggedItem = null;

function dragStart(event) {
    draggedItem = event.target;
    setTimeout(() => {
        event.target.style.display = 'none';
    }, 0);
}

function dragEnd(event) {
    event.target.style.display = 'flex';
    // Remove the drag-over class from all items
    const todos = document.querySelectorAll('.todo');
    todos.forEach(todo => {
        todo.classList.remove('drag-over');
    });
}

function dragOver(event) {
    event.preventDefault();
    // Add the drag-over class to the target item
    if (event.target.classList.contains('todo')) {
        event.target.classList.add('drag-over');
    }
}

function drop(event) {
    event.preventDefault();
    // Remove the drag-over class from all items
    const todos = document.querySelectorAll('.todo');
    todos.forEach(todo => {
        todo.classList.remove('drag-over');
    });

    if (event.target.classList.contains('todo')) {
        toDoList.insertBefore(draggedItem, event.target);
    } else {
        toDoList.appendChild(draggedItem);
    }
}