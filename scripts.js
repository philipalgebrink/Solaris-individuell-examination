let bodies = null;
const input = document.getElementById("search-bar-input");

async function start() {
    /* Get API key */
    const response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
        method: 'GET',
        headers: { 'x-zocom': 'solaris-2ngXkR6S02ijFrTP' }
    }).then((response) => response.json())
        .then((response) => response.bodies);

    bodies = await response;

}

start();

/* This function is called when searching for a celestial body by name
It logs the current list of bodies and the search value to the console
then calls the openPlanetByName function with the search value */
function searchForBody() {
    console.log("bodies in get bodies:", bodies); /* Log the current list of bodies */
    const searchValue = input.value.toLowerCase(); /* Get the lowercase search value from the input (So you get the right planet even if you search for "JoRdEN") */
    openPlanetByName(searchValue); /* Call the function to open the planet by name */
}

/* This function is responsible for opening a planet by its name
 It iterates through the list of bodies, compares the lowercase names
 and if a match is found calls the openFoundPlanet function */
function openPlanetByName(name) {
    let foundBody = null; /* Initialize a variable to store the found body */
    bodies.forEach(body => {
        const bodyName = body.name.toLowerCase(); /* Get the lowercase name of the current body (Same as explained above) */
        if (bodyName == name) {
            foundBody = body; /* Set the foundBody variable if a match is found */
        }
    });
    if (foundBody) {
        openFoundPlanet(foundBody); /* Call the function to open the found planet */
    } else {
        alert("Finns ingen planet med detta namn"); /* Alert if no planet with the given name is found */
    }
}


function openFoundPlanet(body) {
    /* Make div's in html be filled by info from body json */
    const selectedPlanetElement = document.querySelector(".selected-planet");

    const planetName = body.name;
    const planetDesc = body.desc;
    const planetLatin = body.latinName;
    const planetCircumference = body.circumference;
    const planetMinTemp = body.temp.night;
    const planetMaxTemp = body.temp.day;

    selectedPlanetElement.querySelector(".selected-planet__name").innerHTML = planetName.toUpperCase();
    selectedPlanetElement.querySelector(".selected-planet__latinname").innerHTML = planetLatin.toUpperCase();
    selectedPlanetElement.querySelector(".selected-planet__description").innerHTML = planetDesc;
    selectedPlanetElement.querySelector(".selected-planet__circumference").innerHTML = planetCircumference + " km";
    selectedPlanetElement.querySelector(".selected-planet__mintemp").innerHTML = planetMinTemp + " C";
    selectedPlanetElement.querySelector(".selected-planet__maxtemp").innerHTML = planetMaxTemp + " C";

    /* Do not show km from sun if it's the sun */
    const planetDistance = body.distance;
    const selectedPlanetDistanceElement = selectedPlanetElement.querySelector(".selected-planet__distance");

    if (planetDistance > 0) {
        selectedPlanetDistanceElement.innerHTML = planetDistance + " km";

        /* Do show */
        selectedPlanetElement.querySelector(".selected-planet__distanceheader").style.display = "block";
        selectedPlanetDistanceElement.style.display = "block";
    } else {
        /* Do not show */
        selectedPlanetElement.querySelector(".selected-planet__distanceheader").style.display = "none";
        selectedPlanetDistanceElement.style.display = "none";
    }

    /* Do not show moons if it's null */
    const planetMoons = body.moons;
    const selectedPlanetMoonsElement = selectedPlanetElement.querySelector(".selected-planet__moons");

    if (planetMoons.length > 0) {
        /* Create a list element */
        const moonsList = document.createElement("ul");

        /* Remove dots so it looks cleaner */
        moonsList.style.listStyleType = "none";

        /* Loop through the array and make a listitem for each moon */
        planetMoons.forEach(moon => {
            const listItem = document.createElement("li");
            listItem.textContent = moon;

            /* Add margin between list items */
            listItem.style.marginBottom = "10px";

            moonsList.appendChild(listItem);
        });

        /* Add list to html */
        selectedPlanetMoonsElement.innerHTML = "";
        selectedPlanetMoonsElement.appendChild(moonsList);

        /* Remove padding so it aligns good with header */
        moonsList.style.padding = "0";

        /* Show the moons */
        selectedPlanetElement.querySelector(".selected-planet_moonsheader").style.display = "block";
        selectedPlanetMoonsElement.style.display = "block";
    } else {
        /* Hide moons if no moons exist (hide whole header) */
        selectedPlanetElement.querySelector(".selected-planet_moonsheader").style.display = "none";
        selectedPlanetMoonsElement.style.display = "none";
    }

    document.querySelector("body").classList.add("popup-open");
    document.querySelector(".selected-planet").classList.add("selected-planet--open");
}
function closeFoundPlanet() {
    document.querySelector("body").classList.remove("popup-open");
    document.querySelector(".selected-planet").classList.remove("selected-planet--open");
}

/* Listen for Ennter key is pressed to search */
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchForBody(); /* Run function like it would when clicking search button */
    }
});

/* Hover effect */

/* This event listener is triggered when the DOM content is fully loaded */
document.addEventListener("DOMContentLoaded", function () {
    /* Select all elements with the class "planet" and store them in the 'planets' list */
    const planets = document.querySelectorAll(".planet");

    /* Iterate over each planet in the list */
    planets.forEach(planet => {
        /* Get the ID of the current planet (Id is the name) */
        const planetName = planet.id;

        /* Initialize a variable to store the tooltip */
        let tooltip;

        /* Add a mouseover event listener to each planet */
        planet.addEventListener("mouseover", function (event) {
            /* Check if the event target is the current planet */
            if (event.target === planet) {
                /* Create a div element for the tooltip and set its class and text content */
                tooltip = document.createElement("div");
                tooltip.className = "planet-tooltip";
                tooltip.textContent = planetName;

                /* Position the tooltip directly on the cursor */
                tooltip.style.top = event.clientY + "px";
                tooltip.style.left = event.clientX + "px";

                /* Append the tooltip to the body element */
                document.body.appendChild(tooltip);
                /* The tooltip is in CSS */
            }
        });

        /* Add a mouseout event listener to each planet */
        planet.addEventListener("mouseout", function () {
            /* Check if the tooltip exists and is a child of the body element */
            if (tooltip && tooltip.parentElement === document.body) {
                /* Remove the tooltip from the body */
                document.body.removeChild(tooltip);
            }
        });
    });
});

/* Star canvas */

/* Get the canvas element with the id 'starCanvas' */
const canvas = document.getElementById('starCanvas');

/* Get the 2D rendering context of the canvas */
const ctx = canvas.getContext('2d');

/* Get the width and height of the window */
const width = window.innerWidth;
const height = window.innerHeight;

/* Set the canvas dimensions to match the window dimensions */
canvas.width = width;
canvas.height = height;

/* Define the number of stars to be drawn */
const numStars = 50;

/* Function to draw a star on the canvas */
function drawStar(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

/* Function to generate random coordinates for a star within the canvas */
function generateRandomCoordinates() {
    const x = Math.random() * width;
    const y = Math.random() * height;
    return { x, y };
}

/* Function to generate a random radius for a star */
function generateRandomRadius() {
    return Math.random() * 2;
}

/* Function to generate a random color for a star */
function generateRandomColor() {
    const shades = ['white', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)'];
    const randomIndex = Math.floor(Math.random() * shades.length);
    return shades[randomIndex];
}

/* Function to create a star field by generating random stars and drawing them on the canvas */
function createStarField() {
    for (let i = 0; i < numStars; i++) {
        // Generate random coordinates, radius, and color for each star.
        const { x, y } = generateRandomCoordinates();
        const radius = generateRandomRadius();
        const color = generateRandomColor();

        // Draw the star on the canvas.
        drawStar(x, y, radius, color);
    }
}

/* Call the function to create the star field when the script is executed */
createStarField();
