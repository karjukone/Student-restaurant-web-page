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
    console.log(data);
    while(container.firstChild){
    container.removeChild(container.firstChild);
    }
    for (let i = 0; i <= data.length; i++) {
        let container = document.getElementById("container");


        let box = document.createElement("div");
        box.className = "box";
        box.setAttribute("id", `${data[i]._id}`); 

        box.addEventListener("click", function(event) {
            const id = event.currentTarget.id;
            currentId = id;
            modal.style.display = "block";
            displayRestaurantById(id);
        });

        let nameElement = document.createElement("h2");
        let cityElement = document.createElement("p");
        let addressElement = document.createElement("p");
        let companyElement = document.createElement("p");

        let nameText = document.createTextNode(data[i].name);
        let cityText = document.createTextNode(data[i].city);
        let addressText = document.createTextNode(data[i].address);
        let companyText = document.createTextNode(data[i].company);
    

        nameElement.appendChild(nameText);
        cityElement.appendChild(cityText);
        addressElement.appendChild(addressText);
        companyElement.appendChild(companyText);

        box.appendChild(nameElement);
        box.appendChild(cityElement);
        box.appendChild(addressElement);
        box.appendChild(companyElement);
        container.appendChild(box);
    }
    
}

export async function filterRestaurants(data, category) {
    category = category.toLowerCase();
    if (data.filter(item =>
        item.city.toLowerCase() === category)) {
        const filteredArray = data.filter(item =>
        (item.city.toLowerCase() == category));
        return filteredArray;
    }
    if(category) {
        for(let i = 0; i < 76; i++) {
            console.log(data[i].name);
            while(data[i].name.toLowerCase() != category) {
                return data[i];
            }
        }
    }
        
}

export async function displayRestaurants(category){  //cleaanaappa tätä funktioo vähä
    let data = await getRestaurants();
    try {
        data.sort((a, b) => {              //aakkoset
            let x = a.company.toLowerCase();
            let y = b.company.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
        console.log(category);

        if(category) {
            const filteredData = await filterRestaurants(data, category);  //jos filtteri
            console.log("res: "+ filteredData);
            await display(filteredData); //sitten displayaa filteröidyt ravintolat
        } else {
            await display(data); //jos ei filtterii nii näyttää kaikki
        }

        
    }
    catch(error) {
        console.log(error);
    }
    return data;

}

export async function displayCard(menu) {
    const menudiv = document.getElementById("menudiv");
    while (menudiv.firstChild) {
        menudiv.removeChild(menudiv.firstChild);
    }
    const title = document.createElement('h1');
    title.textContent = 'RUOKALISTA';
    menudiv.appendChild(title);

    if (!menu) return;
    let days = [];
    days = menu.days; 

    days.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('menucard');

        const h2 = document.createElement('h2');
        h2.textContent = day.date;
        dayCard.appendChild(h2);

        const courses = day.courses;
        courses.forEach(course => {
            const pName = document.createElement('p');
            pName.textContent = course.name;

            const pPrice = document.createElement('p');
            pPrice.textContent = course.price;

            const pDiets = document.createElement('p');
            pDiets.textContent = course.diets;

            dayCard.appendChild(pName);
            dayCard.appendChild(pPrice);
            dayCard.appendChild(pDiets);
        });

        menudiv.appendChild(dayCard);
    });
}

export async function displayRestaurantById(id) {
    if (!id) id = currentId;
    currentId = id;

    const data = await getRestaurantById(id);
    if (!data) {
        displayError('Restaurant data not available');
        return;
    }

    const { name, address, postalCode: postCode, phone, city } = data;

    const weeklyMenu = await getWeeklyMenu(id, language);

    document.getElementById("name").textContent = name;
    document.getElementById("address").textContent = address;
    document.getElementById("postal-code").textContent = postCode;
    document.getElementById("phone").textContent = phone;
    document.getElementById("city").textContent = city;

    try {
        if (weeklyMenu) {
            await displayCard(weeklyMenu);
        }
    } catch (err) {
        console.error('Failed to render menu:', err);
    }
}

export async function displayError(message){
    errorMsg.textContent = message;
}