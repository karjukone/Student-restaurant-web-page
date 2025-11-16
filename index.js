import {fetchData, getRestaurants, getRestaurantById, sendUserData} from './fetch.js';

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementsByClassName('search-input');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];



async function displayRestaurants(data){
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

    let resData = await getRestaurantById(id);
    let restaurantId = document.createElement("p");
    let testi = document.createTextNode(id);

    //restaurantById.appendChild(testi);


    
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
