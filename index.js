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
     console.log(restaurantData);
     await displayRestaurant(restaurantData);

    }
    catch(error) {
        console.log(error);
    }
}

async function displayRestaurant(data){
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
        let nameOfRestaurant = document.createTextNode(`Name: ${data[i].name}`)

        box.className = "box";

        box.appendChild(nameOfRestaurant);

        container.appendChild(box);
   }
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

getRestaurants();