import {getRestaurants, getRestaurantById, getDailyMenu, getWeeklyMenu} from './fetch.js';

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
    displayError('');
    console.log(data);
    while(container.firstChild){
    container.removeChild(container.firstChild);
    }
    try {
        if(data.length < 1) {
            displayError("Could not find match. Try again");
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
    } catch(error) {
        console.error(error);
    }

}

export async function filterRestaurants(cityValue, companyValue) {
    let data = await getRestaurants();
    cityValue = cityValue.toLowerCase();
    companyValue = companyValue.toLowerCase();

    const filteredCompArray = data.filter(item =>
        (item.company.toLowerCase() == companyValue && cityValue == '')
    );
    const filteredCityArray = data.filter(item =>
        (item.city.toLowerCase() == cityValue && companyValue == ''));
        
    const filteredArray = data.filter(item => 
        (item.city.toLowerCase() == cityValue && item.company.toLowerCase() == companyValue));

    if(filteredArray.length > 0)
        display(filteredArray);
        
    else if(filteredCityArray.length > 0) {
        display(filteredCityArray);
    }        
    else if(filteredCompArray.length > 0) {
        display(filteredCompArray);
    }
    else {
        display(filteredArray);
    }
        
}

export async function displayRestaurants(){ 
    let data = await getRestaurants();
    try {
        data.sort((a, b) => {              //aakkoset
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
        await display(data);
        }

    catch(error) {
        console.log(error);
    }
    return data;

}

export async function displayCard(menu) {
    const menudiv = document.getElementById("menudiv");
    const selectDay = document.getElementById("selectDay");
    while (menudiv.firstChild) {
        menudiv.removeChild(menudiv.firstChild);
    }
    const title = document.createElement('h1');
    title.textContent = 'RUOKALISTA';
    menudiv.appendChild(title);

    if (!menu) return;
    let days = [];
    days = menu.days; 
    let dayId = 0;

    days.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('menucard');

        const h3 = document.createElement('h3');
        h3.setAttribute("id", `day${dayId}`);
        dayId++;
        h3.textContent = day.date;
        dayCard.appendChild(h3);
        

        const courses = day.courses;
        courses.forEach(course => {
            const pName = document.createElement('h4');
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
    console.log('id: ' + id);
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