import {getRestaurants, getRestaurantById, getDailyMenu, getWeeklyMenu, sendUserData } from './fetch.js';

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementsByClassName('search-input');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let language = 'fi';
let daily = true;
let dailyOrWeeklyBtn = document.getElementById("menu-btn");
let currentId = '';
const errorMsg = document.getElementById("error-msg");

export async function display(data) { //map method boxeille?
    for (let i = 0; i < data.length; i++) {
        let container = document.getElementById("container");


        let box = document.createElement("div");
        box.className = "box";
        box.setAttribute("id", `${data[i]._id}`); 


        box.addEventListener("click", event => {
            currentId = (event.target.id);
            console.log(event.target.id);
            modal.style.display = "block";
            displayRestaurantById(event.target.id);
        });

        let nameElement = document.createElement("h2");
        let cityElement = document.createElement("p");
        let addressElement = document.createElement("p");

        let nameText = document.createTextNode(data[i].name);
        let cityText = document.createTextNode(data[i].city);
        let addressText = document.createTextNode(data[i].address);
    

        nameElement.appendChild(nameText);
        cityElement.appendChild(cityText);
        addressElement.appendChild(addressText);

        box.appendChild(nameElement);
        box.appendChild(cityElement);
        box.appendChild(addressElement);
        container.appendChild(box);
    }
    
}

export async function filterRestaurants(data, category) {  //ei varmaa tarvi jokaselle kategorialle omaa vaan tai operaatio
    const filteredArray = data.filter(item =>
        item.city === 'Helsinki');
        return filteredArray;
}

export async function displayRestaurants(category){  //cleaanaappa tätä funktioo vähä
    let data = await getRestaurants();
    try {
        data.sort((a, b) => {              //aakkoset
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        if(category) {
            const filteredData = await filterRestaurants(data, category);  //jos filtteri
            await display(filteredData); //sitten displayaa filteröidyt ravintolat
        } else {
            await display(); //jos ei filtterii nii näyttää kaikki
        }

        
    }
    catch(error) {
        console.log(error);
    }
    return data;

}

export async function displayCard(menu) {
    for (let j = 0; j < 7; j++) {
        let dayOfWeek = document.createElement("h2");
        dayOfWeek.textContent = menu[j].date;
        for (let i = 0; i < menu.courses.length; i++) {   //lisää funktioon jota voi hyöd

            let pName = document.createElement("p");
            pName.textContent = menu[j].courses.name;

            let pPrice = document.createElement("p");
            pPrice.textContent = menu[i].courses.price;

            let pDiets = document.createElement("p");
            pDiets.textContent = menu[i].courses.diets;

            const menudiv = document.getElementById("menudiv");

            let courses = document.createElement("div");
            courses.classList.add("menucard")
            
            courses.appendChild(pName);
            courses.appendChild(pPrice);
            courses.appendChild(pDiets);
            menudiv.appendChild(courses);
        }    
    }
}

export async function displayRestaurantById(daily) {
    let data = await getRestaurantById(currentId);
    let weeklyMenu = await getWeeklyMenu(currentId, language);
    console.log('weekly: ' + weeklyMenu);
    //let dailyMenu = await getDailyMenu(currentId);
    await displayCard(weeklyMenu);
    console.log('weekly: ' + weeklyMenu);
    if(data) {
        document.getElementById("name").textContent = data.name;
        document.getElementById("address").textContent = data.address;
        document.getElementById("postal-code").textContent = data.postalCode;
        document.getElementById("phone").textContent = data.phone;
        document.getElementById("city").textContent = data.city;
    }
}

export function displayError(message){
    errorMsg.textContent = message;
}