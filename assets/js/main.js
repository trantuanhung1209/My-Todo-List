import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


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
const updateQuantityTask = () => {
    // Checked
    const checkMark = document.querySelectorAll(".inner-checkbox .checkmark");
    const inputCheck = document.querySelectorAll(".inner-checkbox input");
    const taskNumberComplete = document.querySelector(".task-number-complete");

    let quantityOfTask = inputCheck.length;

    // Check if the elements exist before modifying their text content
    const innerNumberTag = document.querySelector(".inner-number-tag");
    const quantityOfTaskElement = document.querySelector(".quantity-of-task");

    if (innerNumberTag) {
        innerNumberTag.textContent = `${quantityOfTask}`;
    }

    if (quantityOfTaskElement) {
        quantityOfTaskElement.textContent = `${quantityOfTask}`;
    }

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
    if(taskNumberComplete) {
        taskNumberComplete.textContent = `${count}`;
    }
}
//End update task complete

// show alert
const showAlert = (content = null, time = 3000) => {
    if (content) {
        const newAlert = document.createElement("div");
        newAlert.setAttribute("class", "alert alert--success");
        newAlert.innerHTML = `
            <span class="alert-content">
                ${content}
            </span>
            <span class="alert-close">
                <i class="fa-solid fa-xmark"></i>
            </span>
        `;

        const alertList = document.querySelector(".alert-list")
        alertList.appendChild(newAlert);

        const alertClose = newAlert.querySelector(".alert-close");

        alertClose.addEventListener("click", () => {
            alertList.removeChild(newAlert);
        })
        setTimeout(() => {
            alertList.removeChild(newAlert);
        }, `${time}`);
    }
}
// End show alert

const closeModal = (element) => {
    const body = document.querySelector("body");
    const modalClose = element.querySelector(".modal-close");
    const modalOverlay = element.querySelector(".modal-overlay");

    modalClose.addEventListener("click", () => {
        body.removeChild(element);
    });

    modalOverlay.addEventListener("click", () => {
        body.removeChild(element);
    });

    const buttonClose = element.querySelector(".button-close");
    buttonClose.addEventListener("click", () => {
        body.removeChild(element);
    })
}

// show comfirm
const showConfirmRemove = (id, items) => {
    const body = document.querySelector("body");
    const elementConfirm = document.createElement("div");
    elementConfirm.classList.add("modal");

    elementConfirm.innerHTML = `
    <div class="modal-main">
        <button class="modal-close">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="modal-content">
        "Are you sure you want to delete this task?"
        </div>
        <div class="inner-button-modal">
            <button class="button-close">No</button>
            <button class="button-agree">Yes</button>
        </div>
    </div>
    <div class="modal-overlay"></div>
    `;

    body.appendChild(elementConfirm);

    closeModal(elementConfirm);

    const buttonAgree = elementConfirm.querySelector(".button-agree");
    buttonAgree.addEventListener("click", () => {
        remove(ref(db, '/todos/' + id)).then(() => {
            showAlert("Successfully removed", 3000);
            const data = items.val()[id]; // Check if the task was completed
            if (data.complete) {
                countTaskComplete--;
            }
        });
        body.removeChild(elementConfirm);
    })

}
// End show comfirm

// show confirm edit
const showFormEdit = (id) => {

    const body = document.querySelector("body");
    const elementEdit = document.createElement("div");
    elementEdit.classList.add("modal");

    elementEdit.innerHTML = `
        <div class="modal-main">
            <button class="modal-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="modal-content">
                Edit task...
            </div>
            <input name="content"/>
            <div class="inner-button-modal">
                <button class="button-close">No</button>
                <button class="button-agree">Update</button>
            </div>
        </div>
        <div class="modal-overlay"></div>
        `;

    body.appendChild(elementEdit);

    closeModal(elementEdit);

    const buttonAgree = elementEdit.querySelector(".button-agree");
    buttonAgree.addEventListener("click", () => {
        const content = elementEdit.querySelector("input[name='content']").value;
        if (content) {
            const dataUpdate = {
                content: content
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                showAlert("Update task success!", 3000);
                body.removeChild(elementEdit);
            });
        }

    })

    onValue(ref(db, '/todos/' + id), (item) => {
        const data = item.val();

        elementEdit.querySelector("input[name='content']").value = data.content;
    })

}
// end show confirm edit

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
            set(newTodosRef, data).then(() => {
                if(contentTask != "") {
                    showAlert("Create success!", 3000);
                }
            });

            innerForm.content.value = "";
        }
    })
}
//End Create task

//get task list
const innerTodoList = document.querySelector(".inner-todo-list");
if (innerTodoList) {
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
                    showAlert("Update task success!", 3000);
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
                    showAlert("Successfully undo!", 3000);
                });
            });
        });
        //end task undo

        //task remove
        const listButtonRemove = document.querySelectorAll("[button-remove]");
        listButtonRemove.forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("button-remove");
                showConfirmRemove(id, items);
            });
        });
        //end task remove

        // Update task complete count display
        UpdateQuantityTaskComplete(countTaskComplete);
        //End Update task complete count display

        // edit task
        const listButtonEdit = document.querySelectorAll("[button-edit]");
        listButtonEdit.forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("button-edit");
                showFormEdit(id);
            });
        });
        // end edit task
    });
}
//End get task list
