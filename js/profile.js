import {getUsernameAvailability, postNewUser, logIn, getUser, updateUser} from './fetch.js';

import { } from './display.js';

const createUserDiv = document.getElementById("createDiv");
const logInDiv = document.getElementById("logInDiv");
const createUserForm = document.getElementById("createUserForm");
const logInForm = document.getElementById("logInForm");
const userCreatedDiv = document.getElementById("userCreated");
let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("psswrd");
let userInput = document.getElementById("username2");
let psswrdInput = document.getElementById("psswrd2");
const userError = document.getElementById("userError");
const userError2 = document.getElementById("userError2");
const userError3 = document.getElementById("userError3");
const a = document.getElementById("activationLink");
const logInBtn = document.getElementById("logInBtn");
const createBtn = document.getElementById("createBtn");
const profileDiv = document.getElementById("profileDiv");
let token = '';
const sendNewInfo = document.getElementById("sendNewInfo");
const modifyDiv = document.getElementById("modifyDiv");



usernameInput.addEventListener ("keydown", async event => {
    emptyErrorMsg()
    let user = usernameInput.value;
    let isAvailable = await getUsernameAvailability(user);
    console.log(isAvailable);
    if (isAvailable.available) {
        userError.textContent = '';
    }
    else {
        userError.textContent = 'Käyttäjänimi varattu';
    }
    
})

createUserForm.addEventListener ("submit", async event => {
    event.preventDefault();

    let user = usernameInput.value;
    let emailValue = emailInput.value;
    let psswrd = passwordInput.value;

    if(user.length < 1 || psswrd.length < 1 || emailValue.length < 1) {
        userError.textContent = 'Täytä kaikki kentät';
        return;
    }
    else if(user.length < 3) {
        userError2.textContent = 'Käyttäjänimen pitää olla vähintään 3 merkkiä pitkä';
        return;
    }else if (psswrd.length < 5) {
        userError3.textContent = 'Salasanan pitää olla vähintään 5 merkkiä';
        return;
    }

    let res = await postNewUser(user, psswrd, emailValue);
    localStorage.setItem("password", psswrd);

    if(!res) {
        userError.textContent = 'Käyttäjänimi tai sähköposti jo käytössä';
        return;
    }
    await displayCreatedUserStatus(res);
}
)

logInBtn.addEventListener("click", event => {
    createUserDiv.style.display = "none";
    logInDiv.style.display = "block";
    emptyErrorMsg()
})

createBtn.addEventListener("click", event => {
    createUserDiv.style.display = "block";
    logInDiv.style.display = "none";
    emptyErrorMsg()
})

async function displayCreatedUserStatus(res) {
    const p = document.getElementById("welcomeMsg");
    p.textContent = `Tervetuloa ${res.data.username}! Aktivoi käyttäjä linkistä: `
    a.textContent = `${res.activationUrl}`;
    a.href = `${res.activationUrl}`;
    a.title = "This is a link";
    a.target = "_blank";

    a.addEventListener("click", event => {
        userCreatedDiv.style.display = "none";
        logInDiv.style.display = "block";
    })

    createUserDiv.style.display = "none";
    userCreatedDiv.style.display = "flex";
}

logInForm.addEventListener("submit", async event => {
    event.preventDefault();

    let username = userInput.value;
    let password = psswrdInput.value;


    if(username.length < 1 || password.length < 1) {
        userError.textContent = 'Täytä kaikki kentät';
        return;
    }
    else if(username.length < 3) {
        userError2.textContent = 'Käyttäjänimen pitää olla vähintään 3 merkkiä pitkä';
        return;
    }else if (password.length < 5) {
        userError3.textContent = 'Salasanan pitää olla vähintään 5 merkkiä';
        return;
    }

    let res = await logIn(username, password);
    token = res.token;
    

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("token", token);
    displayUser(token);
    emptyErrorMsg();



    if(!res) {
        userError.textContent = 'Väärä käyttäjänimi tai salasana';
        return;
    }
})

async function displayUser() {
    if(localStorage.getItem("loggedIn") === "false") {
        logInDiv.style.display = "block";
        profileDiv.style.display = "none";
        return;
    }
    let data = await getUser();

    logInDiv.style.display = "none";
    profileDiv.style.display = "block";
    document.getElementById("placeForName").textContent = `Käyttäjätunnus: ${data.username}`;
    document.getElementById("placeForMail").textContent = `Sähköposti: ${data.email}`;
    document.getElementById("placeForRole").textContent = `Rooli: ${data.role}`;

    localStorage.setItem("email", data.email);
    localStorage.setItem("username", data.username);

    let updateMode = document.getElementById("updateMode");

    updateMode.addEventListener("click", event => {
        profileDiv.style.display = "none";
        modifyDiv.style.display = "block";

    })
}

const logOutBtn = document.getElementById("logOutBtn");
const goBackBtn = document.getElementById("goBackBtn");


logOutBtn.addEventListener("click", async event => {
    logOut();
})

goBackBtn.addEventListener("click", async event => {
    displayUser();
    profileDiv.style.display = "block";
    modifyDiv.style.display = "none";
    emptyErrorMsg();
})

async function logOut() {
    logInDiv.style.display = "block";
    profileDiv.style.display = "none";
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("token");
    localStorage.setItem("loggedIn", "false");
    console.log("Logged out...");
    window.alert("User logged out succesfully");
}





sendNewInfo.addEventListener("click",async event => {
    let newUser = document.getElementById("newUser").value;
    newUser = newUser.value;
    let newMail = document.getElementById("newEmail").value;
    let newPsswrd = document.getElementById("newPsswrd").value;

    console.log(newUser);
    if(!newUser && !newMail && !newPsswrd) {
        userError.textContent = 'Kentät on tyhjät';
        return;
    }else if(newUser) {
        localStorage.setItem("username", newUser);
    }else if(newPsswrd) {
        localStorage.setItem("password", newPsswrd);
    }else if(newMail) {
        localStorage.setItem("email", newMail);
    }

    console.log(newMail, newPsswrd, newUser);

    await updateUser();
    emptyErrorMsg()
})

export async function displayError(message){
    errorMsg.textContent = message;
}

function emptyErrorMsg() {
    userError.textContent = '';
    userError3.textContent = '';
    userError2.textContent = '';
}


token = localStorage.getItem("token");
displayUser(token);