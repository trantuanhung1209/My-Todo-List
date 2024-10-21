import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyD0qxbz7YrVKF5m7QFCY4gnB94D8FcBKIw",
    authDomain: "learn-firebase-front-end.firebaseapp.com",
    databaseURL: "https://learn-firebase-front-end-default-rtdb.firebaseio.com",
    projectId: "learn-firebase-front-end",
    storageBucket: "learn-firebase-front-end.appspot.com",
    messagingSenderId: "4726513351",
    appId: "1:4726513351:web:cd2c034f80df2b597aa8e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const todosRef = ref(db, 'todos');

let countTaskComplete = 0;

function updateQuantityTask() {
    // Checked
    const checkMark = document.querySelectorAll(".inner-checkbox .checkmark");
    const inputCheck = document.querySelectorAll(".inner-checkbox input");
    const taskNumberNcomplete = document.querySelector(".task-number-complete");

    let quantityOfTask = inputCheck.length;
    document.querySelector(".inner-number-tag").textContent = `${quantityOfTask}`;
    document.querySelector(".quantity-of-task").textContent = `${quantityOfTask}`;

    checkMark.forEach((item) => {
        item.addEventListener("click", () => {
            // Get the corresponding input element
            const inputItem = inputCheck[Array.from(checkMark).indexOf(item)];

            // Toggle the "checked" attribute
            if (inputItem.hasAttribute("checked")) {
                inputItem.removeAttribute("checked");
            } else {
                inputItem.setAttribute("checked", "");
            }
        });
    });
    // End Checked
}

//update task complete
function UpdateQuantityTaskComplete(count) {
    const taskNumberComplete = document.querySelector(".task-number-complete");
    taskNumberComplete.textContent = `${count}`;
}

//Create task
const innerForm = document.querySelector(".inner-form");
if (innerForm) {
    innerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const contentTask = innerForm.content.value;
        if (contentTask) {
            const data = {
                content: contentTask,
                complete: false
            };

            const newTodosRef = push(todosRef);
            set(newTodosRef, data);

            innerForm.content.value = "";
        }
    })
}
//End Create task

//get task list
onValue(todosRef, (items) => {
    const htmls = [];
    countTaskComplete = 0; // Reset countTaskComplete to count only completed tasks

    items.forEach((item) => {
        const key = item.key;
        const data = item.val();
        let checkComplete = "";
        if (!data.complete) {
            checkComplete = `<span class="checkmark" button-complete = "${key}"></span>`;
        } else {
            checkComplete = `<span class="item-list--undo" button-undo = "${key}">
            <i class="fa-solid fa-rotate-left"></i></span>`;
            countTaskComplete++; // Increment count if task is complete
        }

        let html = `<div class="inner-todo-list-item ${data.complete ? 'todo-item--complete' : ''}">
        <div class="inner-checkbox">
            <input type="checkbox" ${data.complete ? 'checked' : ''} name="" id="">
            ${checkComplete}
        </div>
        <div class="inner-content">
            ${data.content}
        </div>
        <div class="inner-task-action">
        <div class="inner-edit" button-edit = "${key}">
            <i class="fa-solid fa-pen-to-square"></i>
        </div>
        <div class="inner-delete" button-remove = "${key}" >
            <i class="fa-solid fa-trash"></i>
        </div>
        </div>
    </div>`;
        htmls.push(html);
    });

    const innerTodoList = document.querySelector(".inner-todo-list");
    innerTodoList.innerHTML = htmls.reverse().join("");  // Tái tạo lại toàn bộ danh sách DOM

    //update quantity and check task
    updateQuantityTask();

    //task complete
    const listButtonComplete = document.querySelectorAll("[button-complete]");
    listButtonComplete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-complete");
            const dataUpdate = {
                complete: true
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                countTaskComplete++;
            });
        });
    });
    //end task complete

    //task undo
    const listButtonUndo = document.querySelectorAll("[button-undo]");
    listButtonUndo.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-undo");
            const dataUpdate = {
                complete: false
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                countTaskComplete--;
            });
        });
    });
    //end task undo

    //task remove
    const listButtonRemove = document.querySelectorAll("[button-remove]");
    listButtonRemove.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-remove");
            remove(ref(db, '/todos/' + id)).then(() => {
                const data = items.val()[id]; // Check if the task was completed
                if (data.complete) {
                    countTaskComplete--; 
                }
            });
        });
    });
    //end task remove

    // Update task complete count display
    UpdateQuantityTaskComplete(countTaskComplete);

    console.log(countTaskComplete);
});
//End get task list
