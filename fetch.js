
export async function fetchData(url, options) {
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

export async function getRestaurants() {
    try{
        const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants'; 
        const options =  {
       method: 'GET',
     }

     const restaurants = await fetchData(url, options);
     return restaurants;

    }
    catch(error) {
        console.log(error);
    }
}

export async function getRestaurantById(id) {
    try{
        const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/${id}`;
        const options = {
            method: 'GET',
        }
        const restaurant = await fetchData(url, options);
        return restaurant;
    }
    catch(error) {
        console.log(error);
    }    
}
 
export async function getDailyMenu(id, lang) {
    try{
        const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${id}/${lang}`;
        const options = {
            method: 'GET',
        }
        const dailyData = fetchData(url, options);
        //console.log(dailyData.courses)
        return (dailyData);
    }
    catch(error) {
        console.log(error);
    }   
    
}

export async function getWeeklyMenu(id, lang) {
    try{
        const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/weekly/${id}/${lang}`;
        const options = {
            method: 'GET',
        }
        const weeklyData = await fetchData(url, options);
        console.log(weeklyData);
        return weeklyData;
    }
    catch(error) {
        console.log(error);
    }   
}


export async function getUsernameAvailability(username) {
    try{
        const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${username}`;
        const options = {
            method: 'GET',
        }
        let isAvailable = await fetchData(url, options);
        return isAvailable;
    }
    catch(error) {
        console.log(error);
    }   
    
}

export async function postNewUser(uname, psswrd, email) {
    try{
        const user = {
            "username": `${uname}`,
            "password": `${psswrd}`,
            "email":  `${email}`,
        }
        const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1/users';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }
        console.log(options);
        const msg = await fetchData(url, options);
        return msg;
    }
    catch(error) {
        console.log(error);
    }   
    
}


export async function logIn() {       //käyttäjätunnusta varten
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


//delete and update ainakai ja upload avatar