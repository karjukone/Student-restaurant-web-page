const searchForm = document.getElementById("search-form");
const searchInput = document.getElementsByClassName('search-input');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

async function fetchData(url, options) {
    try{
        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log(error);
    }
}

async function getRestaurants() {
    try{
        const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants'; 
        const options =  {
       method: 'GET',
     }

     const restaurantData = await fetchData(url, options);
     await displayRestaurants(restaurantData);

    }
    catch(error) {
        console.log(error);
    }
}

async function displayRestaurants(data){
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
        box.onclick = function() {
            modal.style.display = "block";
        }

        let nameElement = document.createElement("h3");
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


async function restaurantById(id) {
    modal.style.display = "block";
    
}


async function sendUserData() {       //käyttäjätunnusta varten
 try {
     const user = {
       username : 'example.user',  ///tähä käyttäjä ja salasana
       passwork : 'salasana'
     };
     const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login';
     const options = {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(user)
     }
     const userData = await fetchData(url, options);
     console.log('data:', userData);
   } catch (error) {
     console.error('An error occurred:', error);
   }
}  



span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    
}

getRestaurants();