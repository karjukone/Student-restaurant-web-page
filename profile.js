import {getUsernameAvailability, postNewUser, logIn} from './fetch.js';

import { } from './display.js';

const createUserForm = document.getElementById("createUserForm");
let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("emailInput");
let psswrdInput = document.getElementById("psswrd");
const userError = document.getElementById("userError");


usernameInput.addEventListener ("keydown", async event => {
    let user = usernameInput.value;
    let isAvailable = await getUsernameAvailability(user);
    console.log(isAvailable);
    if (isAvailable) {
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
    console.log(user, emailValue, psswrd);

    let res = postNewUser(user, psswrd, emailValue);
}
)


export async function displayError(message){
    errorMsg.textContent = message;

}