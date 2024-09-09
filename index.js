window.onload = displaylocalStorage; //call this function when the page finishes to load

let todoArray = []; //if stored data assign it to todoArray else to an empty one


function displaylocalStorage() {
    //Load todos from localStorage
    if (localStorage.getItem('todoList') !== null) {
        todoArray = JSON.parse(localStorage.getItem('todoList'));
        renderTodoList();
    }
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
        renderUsername(storedUserName);
    }
}

function renderUsername(userName) {
    fieldSetElem.classList.add('fieldset');
    fieldSetElem.innerHTML = `Welcome back! ${userName}`;
}

let usernameInputElem = document.querySelector('.js-username-input');
const fieldSetElem = document.querySelector('fieldset');

usernameInputElem.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        const userName = usernameInputElem.value;

        if (userName !== '') {
            fieldSetElem.classList.add('fieldset');
            fieldSetElem.innerHTML = `Welcome ${userName}!`;
        }
        localStorage.setItem('username', userName);
    }
});

function renderTodoList() {
    let todoArrayHTML = '';

    for (let i = 0; i < todoArray.length; i++) {
        const todoObject = todoArray[i]; // storing array elements
        //const name = todoObject.name;
        //const dueDate = todoObject.dueDate;
        const { name, dueDate, description, completed } = todoObject; //destructuring to store the value in the objects
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
        `; // putting each in a paragraph
        todoArrayHTML += html;
    }

    // displaying in the DOM
    document.querySelector('.js-todo-list')
        .innerHTML = todoArrayHTML;

    toggleCompletion();

}

function toggleCompletion() {  // attach event listeners to each checkbox
    const checkboxes = document.querySelectorAll('.js-checkbox');
    const labelElem = document.querySelectorAll('.js-todo-label');
    const descriptionElem = document.querySelectorAll('.js-description');
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                labelElem[index].classList.add('habit-done');
                const descriptionSpan = descriptionElem[index].querySelector('span'); // only add class to the span element
                if (descriptionSpan) {
                    descriptionSpan.classList.add('habit-done');
                }
                todoArray[index].completed = true;
            } else {
                labelElem[index].classList.remove('habit-done');
                const descriptionSpan = descriptionElem[index].querySelector('span'); // only add class to the span element
                if (descriptionSpan) {
                    descriptionSpan.classList.remove('habit-done');
                }
                todoArray[index].completed = false;
            }
            localStorage.setItem('todoList', JSON.stringify(todoArray));
        });
    });
}

function addTodo() {
    const inputElem = document.querySelector('.js-input');
    const dueDateInputElem = document.querySelector('.js-date');
    const descriptionElem = document.querySelector('.js-description');

    const name = inputElem.value;
    const dueDate = dueDateInputElem.value;
    const description = descriptionElem.value;


    if (inputElem.value.trim() !== '') {
        todoArray.push({
            //name: name,
            //dueDate: dueDate,
            //if the property name and the variable name are the same this works too. Kind of like destructuring
            name,
            dueDate,
            description,
            completed: false
        });
        //console.log(todoArray);

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
            //todoArray = [];
            todoArray.splice(0, todoArray.length); //removes all elements from array this is better than re-initialising the whole array.
            renderTodoList();
            localStorage.setItem('todoList', JSON.stringify(todoArray));
        }
    }
});

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
        stylesheetElem.href = 'styles/light-mode.css'; //switching style sheets
    } else {
        element.add('dark-mode');
        toggleButtonElem.innerHTML = `
        <img src="images/light-mode.png" title="light mode">
        `;
        stylesheetElem.href = 'styles/dark-mode.css';
    }
});
