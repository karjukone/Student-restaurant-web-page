import {getRestaurants, getRestaurantById, getDailyMenu, getWeeklyMenu, sendUserData} from './fetch.js';

import { display, displayRestaurants, displayRestaurantById, displayCard, displayError, filterRestaurants } from './display.js';

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementsByClassName('search-input');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let language = 'fi';
let daily = true;
let dailyOrWeeklyBtn = document.getElementById("menu-btn");
let currentId = '';
const errorMsg = document.getElementById("error-msg");

searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const city = searchInput.value;

    if(city) {
        displayRestaurants(city);
    }
    else {
        displayError("Please enter a city");
    }
})


    dailyOrWeeklyBtn.addEventListener("click", event => {
    if (daily) {
        dailyOrWeeklyBtn.style.backgroundColor = "pink";
        dailyOrWeeklyBtn.style.color = "darkgreen";
        dailyOrWeeklyBtn.textContent = "Show weekly menu";
        displayRestaurantById(daily); //tähä sillee et "paljastaa" joko dailymenu tai weekly nii ei tarvi aina hakee uudestaa
        daily = !daily;
    }
    else {
        dailyOrWeeklyBtn.style.backgroundColor = "darkgreen";
        dailyOrWeeklyBtn.style.color = "pink";
        dailyOrWeeklyBtn.textContent = "Show daily menu";
        let weeklyMenu = getWeeklyMenu(currentId);
        displayCard(weeklyMenu, language);
        daily = true;        
    }
});



span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        //modal.textContent = '';
    }
}


const data = await displayRestaurants("helsinki");

