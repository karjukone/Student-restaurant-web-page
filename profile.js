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
const userError2 = document.getElementById("userError2");
const userError3 = document.getElementById("userError3");
const a = document.getElementById("activationLink");
const logInBtn = document.getElementById("logInBtn");
const createBtn = document.getElementById("createBtn");
let user = usernameInput.value;
let emailValue = emailInput.value;
let psswrd = psswrdInput.value;


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
    let psswrd = psswrdInput.value;

    console.log(user.length, psswrd.length, emailValue.length);

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
    console.log('res: ' + res);
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
    a.title = "This is a link";
    

    console.log(res);
    createUserDiv.style.display = "none";
    userCreatedDiv.style.display = "flex";
}


export async function displayError(message){
    errorMsg.textContent = message;

}