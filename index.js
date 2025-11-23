import {getRestaurants, getRestaurantById, getDailyMenu, getWeeklyMenu} from './fetch.js';

import { display, displayRestaurantById, displayCard, displayError, filterRestaurants } from './display.js';

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let language = 'fi';
let daily = true;
let dailyOrWeeklyBtn = document.getElementById("menu-btn");
const removeFilterBtn = document.getElementById("removeFilterBtn");
const cityBtn = document.getElementById("cityBtn");
const companyBtn = document.getElementById("companyBtn");
const filterBtn = document.getElementById("filterBtn");
let currentId = '';
const errorMsg = document.getElementById("error-msg");

searchForm.addEventListener ("submit", async event => {
    event.preventDefault();

    const category = searchInput.value;
        console.log('Search input value:', category);
    if(category) {
        try{
            await filterRestaurants(category, '');
        }
        catch(error){
            console.log(error);
        }
    }
    else {
        displayError("kirjoita kaupunki");
    }
})

removeFilterBtn.addEventListener ("click", async event => {
    event.preventDefault();
    await display();
})

filterBtn.addEventListener ("click", async event => {
    event.preventDefault();
    await filterRestaurants(cityBtn.value, companyBtn.value);
})


    dailyOrWeeklyBtn.addEventListener("click", event => {
    if (daily) {
        dailyOrWeeklyBtn.style.backgroundColor = "pink";
        dailyOrWeeklyBtn.style.color = "darkgreen";
        dailyOrWeeklyBtn.textContent = "Show weekly menu";
        displayRestaurantById(currentId); //tähä sillee et "paljastaa" joko dailymenu tai weekly nii ei tarvi aina hakee uudestaa
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


//let data = await getRestaurants();
await display();

