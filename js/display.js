import {getRestaurants, getRestaurantById, getDailyMenu, getWeeklyMenu, updateUser, getUser} from './fetch.js';

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementsByClassName('search-input');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let language = 'fi';
let daily = true;
let dailyOrWeeklyBtn = document.getElementById("menu-btn");
let currentId = '';
const errorMsg = document.getElementById("error-msg");
const modalErrorMsg = document.getElementById("modal-error-msg");
const favsDiv = document.getElementById("favs");


let favDivs = [];

export async function display(data) { 
    if(!data) {
        data = await getRestaurants();
    }
    displayError('');
    while(container.firstChild){
    container.removeChild(container.firstChild);
    }
    try {
        data.sort((a, b) => {              //aakkoset
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
        });

        if(data.length < 1) {
            displayError("Could not find match. Try again");
        }
        console.log(data);

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
            //let favBtn = document.createElement("button");

            //favBtn.addEventListener("click", async event => {
               // if (localStorage.getItem("token")) {
                  //  let divId = event.target.parentElement.id;
                 //   favBtn.style.color = "red";
                  //  await updateUser(divId);
                 //   document.getElementById("favH").textContent = 'Suosikki ravintolat: ';
                   // if (favDivs.includes(divId)) {
                     //   favDivs.pop(divId);
                   // }else {
                  //      favDivs.push(divId);
                  //  }
               //     await displayFavRes(divId);
              //  }else{
              //      window.location.href = 'profile.html';
              //  }
           // })
    

            let nameText = document.createTextNode(data[i].name);
            let cityText = document.createTextNode(data[i].city);
            let addressText = document.createTextNode(data[i].address);
            let companyText = document.createTextNode(data[i].company);
            //let favText = document.createTextNode('Lisää suosikkeihin');
        

            nameElement.appendChild(nameText);
            cityElement.appendChild(cityText);
            addressElement.appendChild(addressText);
            companyElement.appendChild(companyText);
            //favBtn.appendChild(favText);

            box.appendChild(nameElement);
            box.appendChild(cityElement);
            box.appendChild(addressElement);
            box.appendChild(companyElement);
           // box.appendChild(favBtn);
            container.appendChild(box);
        }
    } catch(error) {
        console.error(error);
    }

}


export async function filterRestaurants(cityValue, companyValue, resNameValue) {
    let data = await getRestaurants();
    cityValue = cityValue.toLowerCase();
    companyValue = companyValue.toLowerCase();

    let filteredNameArray = {};

    if(resNameValue){
    filteredNameArray = data.filter(item => 
        item.name.toLowerCase() == resNameValue.toLowerCase()
    );
    }


    const filteredCompArray = data.filter(item =>
        (item.company.toLowerCase() == companyValue && cityValue == '')
    );
    const filteredCityArray = data.filter(item =>
        (item.city.toLowerCase() == cityValue && companyValue == ''));
        
    const filteredArray = data.filter(item => 
        (item.city.toLowerCase() == cityValue && item.company.toLowerCase() == companyValue));


    if(cityValue == '' && companyValue == '' && resNameValue == '') {
        display(data);
    }    
    else if(filteredArray.length > 0)
        display(filteredArray);
        
    else if(filteredCityArray.length > 0) {
        display(filteredCityArray);
    }        
    else if(filteredCompArray.length > 0) {
        display(filteredCompArray);
    }
   else if(filteredNameArray.length > 0) {
        display(filteredNameArray);
    }
    else {
        display(filteredArray);
    }
        
}



export async function displayWeeklyMenu(menu) {
    const menudiv = document.getElementById("weeklyDiv");
    while (menudiv.firstChild) {
        menudiv.removeChild(menudiv.firstChild);
    }

    if (menu.days.length < 1) {
        modalErrorMsg.textContent = 'Menu ei ole saatavilla. Yritä myöhemmin uudestaan';
        return;
    }

    const title = document.createElement('h1');
    title.textContent = 'RUOKALISTA';
    menudiv.appendChild(title);

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
    modalErrorMsg.textContent = '';
    if (!id) id = currentId;
    currentId = id;

    const data = await getRestaurantById(id);
    if (!data) {
        displayError('Restaurant data not available');
        return;
    }

    const { name, address, postalCode: postCode, phone, city } = data;

    document.getElementById("name").textContent = name;
    document.getElementById("address").textContent = address;
    document.getElementById("postal-code").textContent = postCode;
    document.getElementById("phone").textContent = phone;
    document.getElementById("city").textContent = city;

    const dailyMenu = await getDailyMenu(id, language);

    if(dailyMenu.courses.length <= 0) {
        modalErrorMsg.textContent = 'Menu ei ole saatavilla. Yritä myöhemmin uudestaan';
        return;
    }

    const dailyMenuDiv = document.getElementById('dailyDiv');

    while (dailyMenuDiv.firstChild) {
        dailyMenuDiv.removeChild(dailyMenuDiv.firstChild);
    }

    const title = document.createElement('h1');
    title.textContent = 'RUOKALISTA';
    dailyMenuDiv.appendChild(title);

    const courseCard = document.createElement('div');
    courseCard.classList.add('menucard');

    const courses = dailyMenu.courses;
    courses.forEach(course => {
        const pName = document.createElement('h4');
        pName.textContent = course.name;

        const pPrice = document.createElement('p');
        pPrice.textContent = course.price;

        const pDiets = document.createElement('p');
        pDiets.textContent = course.diets;

        courseCard.appendChild(pName);
        courseCard.appendChild(pPrice);
        courseCard.appendChild(pDiets);        
    });
    dailyMenuDiv.appendChild(courseCard);


    const weeklyMenu = await getWeeklyMenu(id, language);
    try {
        if (weeklyMenu) {
            await displayWeeklyMenu(weeklyMenu);
        }
    } catch (err) {
        console.error('Failed to render menu:', err);
    }
}

export async function displayError(message){
    errorMsg.textContent = message;
}