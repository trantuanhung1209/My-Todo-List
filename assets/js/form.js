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
const auth = getAuth(app);

// show alert
const showAlert = (content = null, time = 3000, typeAlert = null) => {
    if (content) {
        const newAlert = document.createElement("div");
        newAlert.setAttribute("class", `alert ${typeAlert}`);
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

const container = document.getElementById('container');
const btn_register = document.getElementById('register');
const btn_login = document.getElementById('login');

if (btn_register) {
    btn_register.addEventListener('click', () => {
        container.classList.add('active');
    });
}

if (btn_login) {
    btn_login.addEventListener('click', () => {
        container.classList.remove('active');
    });
}

// form register
const formRegister = document.querySelector("#form-register");
if (formRegister) {
    formRegister.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = formRegister.email.value;
        const password = formRegister.password.value;

        if (email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    if (user) {
                        window.location.href = "index.html";
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    showAlert("Email is existed",5000,"alert--error");
                });
        }
    })
}
//End form register

// form login
const formLogin = document.querySelector("#form-login");
if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = formLogin.email.value;
        const password = formLogin.password.value;

        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    window.location.href = "index.html"
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    showAlert("Email and password invalid!",5000,"alert--error");
                });
        }
    })
}
//End form login

// form logout
const buttonLogout = document.querySelector("[button-logout]");
if (buttonLogout) {
    buttonLogout.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "form.html";
        }).catch((error) => {
            showAlert("Logout unsuccessful!",5000,"alert--success");
        });
    })
}
// End form logout

// Get the currently signed-in user
const buttonLogin = document.querySelector("[button-login]");
const buttonRegister = document.querySelector("[button-register]");
const section2 = document.querySelector(".section-2");
const innerForm = document.querySelector(".inner-form");
if (buttonLogin && buttonRegister) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            buttonLogout.style.display = "inline-block";
            section2.style.display = "block";

        } else {
            buttonLogin.style.display = "inline-block";
            buttonRegister.style.display = "inline-block";
            section2.remove();

            if(innerForm) {
                const inputCreate = innerForm.querySelector("#input-create");
                inputCreate.disabled = true;
                innerForm.addEventListener("submit", () => {
                    showAlert("You must login to create task!" ,5000,"alert--error");
                })
            }
        }
    });
}
// End Get the currently signed-in user
