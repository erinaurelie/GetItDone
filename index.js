window.onload = displaylocalStorage; 

let todoArray = []; 

// Load todos from localStorage
function displaylocalStorage() {
    if (localStorage.getItem('todoList') !== null) {
        todoArray = JSON.parse(localStorage.getItem('todoList'));
        renderTodoList();
    }
    const storedUserName = localStorage.getItem('username');
    storedUserName && renderUsername(storedUserName);
    
    const storedMode = localStorage.getItem('current mode');
    
    storedMode && (stylesheetElem.href = storedMode);
   
}

function renderUsername(userName) {
    fieldSetElem.classList.add('fieldset');
    fieldSetElem.innerHTML = `Welcome back! ${userName}`;
}

let usernameInputElem = document.querySelector('.js-username-input');
const fieldSetElem = document.querySelector('fieldset');

const addNameElem = document.querySelector('.js-other-add-btn'); 
function validName() {
    const userName = usernameInputElem.value;

        if (userName !== '') {
            fieldSetElem.classList.add('fieldset');
            fieldSetElem.innerHTML = `Welcome ${userName}!`;
        } else {
            alert('Enter Name');
        }
        localStorage.setItem('username', userName);
}
usernameInputElem.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        validName();
    }
});

addNameElem.addEventListener('click', validName);

// Display array in the DOM
function renderTodoList() {
    let todoArrayHTML = '';

    for (let i = 0; i < todoArray.length; i++) {
        const todoObject = todoArray[i]; 
        const { name, dueDate, description, completed } = todoObject; 
        const html = `
        <div class="generated-todo">
            <div><input type="checkbox" id="checkbox-${i}" class="js-checkbox" ${completed ? 'checked' : ''}></div>
            <div>
                <label for="checkbox-${i}" class="js-todo-label ${completed ? 'habit-done' : ''}">
                <div class="small-grid">
                    <div>${name}</div> <div class="generated-date">${dueDate}</div>
                </div>
                <p class="description js-description ${completed ? 'habit-done' : ''}">${description}</p>
                </label>
            </div>
            <div>
                <button onclick="removeTodo(${i});" class="delete-button js-delete-button"><img src="images/delete-icon.png"></button>
            </div>
        </div>
        `; 
        todoArrayHTML += html;
    }

    document.querySelector('.js-todo-list')
        .innerHTML = todoArrayHTML;

    toggleCompletion();

}

// attach event listeners to each checkbox
function toggleCompletion() {  
    const checkboxes = document.querySelectorAll('.js-checkbox');
    const labelElem = document.querySelectorAll('.js-todo-label');
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            labelElem[index].classList.toggle('habit-done', checkbox.checked); //toggles based the boolean value
            todoArray[index].completed = checkbox.checked; //true or false
            localStorage.setItem('todoList', JSON.stringify(todoArray));
        });
    });
}

// Populate todoArray
function addTodo() {
    const inputElem = document.querySelector('.js-input');
    const dueDateInputElem = document.querySelector('.js-date');
    const descriptionElem = document.querySelector('.js-description');

    const name = inputElem.value;
    const dueDate = dueDateInputElem.value;
    const description = descriptionElem.value;


    if (inputElem.value.trim() !== '') {
        todoArray.push({
            name,
            dueDate,
            description,
            completed: false
        });

        inputElem.value = '';
        dueDateInputElem.value = '';
        descriptionElem.value = '';
        localStorage.setItem('todoList', JSON.stringify(todoArray));
    } else {
        alert('Please enter a todo item');
    }

    renderTodoList(); //every time we add a todo the list will be diplayed again
};


const inputContainerElem = document.querySelector('.js-input-container');
const inputElems = inputContainerElem.querySelectorAll('input');

inputElems.forEach(inputElem => {
    inputElem.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
});


const deleteAllElem = document.querySelector('.js-delete-all');

deleteAllElem.addEventListener('click', () => {
    if (todoArray.length === 0) {
        alert('Todo List is empty');
    } else {
        if (confirm("Are you sure you want to delete all todo's?")) {
            todoArray.splice(0, todoArray.length);
            renderTodoList();
            localStorage.setItem('todoList', JSON.stringify(todoArray));
        }
    }
});

//delete todo
function removeTodo(index) {
    todoArray.splice(index, 1);
    renderTodoList();
    localStorage.setItem('todoList', JSON.stringify(todoArray));
}

// Implement dark mode
const toggleButtonElem = document.querySelector('.js-mode-btn');
const containerElem = document.querySelector('.js-container');
const stylesheetElem = document.querySelector('.js-stylesheet');



toggleButtonElem.addEventListener('click', () => {
    const element = containerElem.classList;
    if (element.contains('dark-mode')) {
        element.remove('dark-mode');
        toggleButtonElem.innerHTML = `
        <img src="images/dark-mode.png" title="dark mode">
        `;
        stylesheetElem.href = 'styles/light-mode.css'; 
        localStorage.setItem('current mode', stylesheetElem.href)
    } else {
        element.add('dark-mode');
        toggleButtonElem.innerHTML = `
        <img src="images/light-mode.png" title="light mode">
        `;
        stylesheetElem.href = 'styles/dark-mode.css';
        localStorage.setItem('current mode', stylesheetElem.href)
    }
});
