import {getRestaurants, getRestaurantById, getDailyMenu, getWeeklyMenu, sendUserData} from './fetch.js';

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementsByClassName('search-input');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let language = 'fi';
let daily = true;
let dailyOrWeeklyBtn = document.getElementById("menu-btn");
let currentId = '';


    dailyOrWeeklyBtn.addEventListener("click", event => {
    if (daily) {
        dailyOrWeeklyBtn.style.backgroundColor = "pink";
        dailyOrWeeklyBtn.style.color = "darkgreen";
        dailyOrWeeklyBtn.textContent = "Show weekly menu";
        daily = false;
    }
    else {
        dailyOrWeeklyBtn.style.backgroundColor = "darkgreen";
        dailyOrWeeklyBtn.style.color = "pink";
        dailyOrWeeklyBtn.textContent = "Show daily menu";
        daily = true;        
    }
});


async function displayRestaurants(data){  //cleaanaappa tätä funktioo vähä
    try {
        console.log(data);
        data.sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });


        for (let i = 0; i < data.length; i++) {
            let container = document.getElementById("container");


            let box = document.createElement("div");
            box.className = "box";
            box.setAttribute("id", `${data[i]._id}`);


            box.addEventListener("click", event => {
                modal.style.display = "block";
                displayRestaurantById(event.target.id)
                currentId = (event.target.id);
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
    catch(error) {
        console.log(error);
    }
    return data;

}



async function displayRestaurantById(id) {
    
    console.log(id);
    let data = await getRestaurantById(id);
    document.getElementById("name").textContent = data.name;
    document.getElementById("address").textContent = data.address;
    document.getElementById("postal-code").textContent = data.postalCode;
    document.getElementById("phone").textContent = data.phone;
    document.getElementById("city").textContent = data.city;
    let menu = await getDailyMenu(id, language)
    console.log(menu);
    console.log(menu[0]);

    for (let i = 0; i < menu.length; i++) {

        let pName = document.createElement("p");
        pName.textContent = menu[i].name;

        let pPrice = document.createElement("p");
        pPrice.textContent = menu[i].price;

        let pDiets = document.createElement("p");
        pDiets.textContent = menu[i].diets;


        let courses = document.getElementById("menudiv");
        courses.appendChild(pName, pPrice, pDiets);
        courses.appendChild(pPrice);
        courses.appendChild(pDiets);
    }





  // while (modal.style.display = "block") {
}






span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


const restaurantData = await getRestaurants();
const data = await displayRestaurants(restaurantData);

