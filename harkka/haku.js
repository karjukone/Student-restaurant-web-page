async function fetchData() {

    try {

        const pokemonName = document.getElementById("pokemonName").value.toLowerCase(); //jos isot kirjaimet

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if(!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        console.log(data);
        const pokemonSprite = data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite");

        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";


    }
    catch(error) {
        console.log(error);
    }
}