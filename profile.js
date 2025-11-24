import {getUsernameAvailability, postNewUser, logIn, getUser} from './fetch.js';

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
let loggedIn = false;



usernameInput.addEventListener ("keydown", async event => {
    userError.textContent = '';
    userError3.textContent = '';
    userError2.textContent = '';
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
     else {
        
    }

    let res = await postNewUser(user, psswrd, emailValue);

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
    userError.textContent = '';
    userError3.textContent = '';
    userError2.textContent = '';
})

createBtn.addEventListener("click", event => {
    createUserDiv.style.display = "block";
    logInDiv.style.display = "none";
    userError.textContent = '';
    userError3.textContent = '';
    userError2.textContent = '';
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
    localStorage.setItem("token", token);

    localStorage.setItem("loggedIn", "true");
    displayUser(token);



    if(!res) {
        userError.textContent = 'Väärä käyttäjänimi tai salasana';
        return;
    }
})

async function displayUser(token) {
    if(localStorage.getItem("loggedIn") === "false") {
        logInDiv.style.display = "block";
        profileDiv.style.display = "none";
        return;
    }
    let data = await getUser(token);

    logInDiv.style.display = "none";
    profileDiv.style.display = "block";
    console.log(data.username);
    document.getElementById("placeForName").textContent = `${data.username}`;
    document.getElementById("placeForMail").textContent = data.email;
    document.getElementById("placeForRole").textContent = data.role;
}


export async function displayError(message){
    errorMsg.textContent = message;
}


token = localStorage.getItem("token");
displayUser(token);