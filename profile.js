import {getUsernameAvailability, postNewUser, logIn} from './fetch.js';

import { } from './display.js';

const createUserDiv = document.getElementById("createDiv");
const logInDiv = document.getElementById("logInDiv");
const createUserForm = document.getElementById("createUserForm");
const logInForm = document.getElementById("logInForm");
const userCreatedDiv = document.getElementById("userCreated");
let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("emailInput");
let psswrdInput = document.getElementById("psswrd");
const userError = document.getElementById("userError");
const a = document.getElementById("activationLink");
const logInBtn = document.getElementById("logInBtn");
const createBtn = document.getElementById("createBtn");


usernameInput.addEventListener ("keydown", async event => {
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
    let user = usernameInput.value;
    let emailValue = emailInput.value;
    let psswrd = psswrdInput.value;

    let res = await postNewUser(user, psswrd, emailValue);
    console.log(res);
    await displayCreatedUserStatus(res);
}
)

logInBtn.addEventListener("click", event => {
    createUserDiv.style.display = "none";
    logInDiv.style.display = "block";
})

createBtn.addEventListener("click", event => {
    createUserDiv.style.display = "block";
    logInDiv.style.display = "none";
})

async function displayCreatedUserStatus(res) {
    const p = document.getElementById("welcomeMsg");
    p.textContent = `Tervetuloa ${res.data.username}! Aktivoi käyttäjä linkistä: `
    a.textContent = `${res.activationUrl} .`;
    a.href = `${res.activationUrl}`;
    a.title = "This is a link"

    console.log(res);
    createUserDiv.style.display = "none";
    userCreatedDiv.style.display = "flex";
}


export async function displayError(message){
    errorMsg.textContent = message;

}