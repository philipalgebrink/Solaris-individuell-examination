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

function searchForBody() {
    console.log("bodies in get bodies:", bodies);
    const searchValue = input.value.toLowerCase();
    console.log(searchValue);
    openPlanetByName(searchValue);
}

function openPlanetByName(name) {
    let foundBody = null;
    bodies.forEach(body => {
        const bodyName = body.name.toLowerCase();
        console.log(bodyName, " is equal to ", name, ": ", bodyName == name);
        if (bodyName == name) {
            foundBody = body;
        }
    });
    if (foundBody) {
        console.log("found body:", foundBody);
        openFoundPlanet(foundBody)
    } else {
        alert("Finns ingen planet med detta namn");
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

            // Add margin between list items
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
    console.log("open body");
}
function closeFoundPlanet() {
    document.querySelector("body").classList.remove("popup-open");
    document.querySelector(".selected-planet").classList.remove("selected-planet--open");
    console.log("close body");
}

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchForBody();
    }
});

/* Hover effect */

document.addEventListener("DOMContentLoaded", function () {
    const planets = document.querySelectorAll(".planet");

    planets.forEach(planet => {
        const planetName = planet.id;
        let tooltip;

        planet.addEventListener("mouseover", function (event) {
            if (event.target === planet) {
                tooltip = document.createElement("div");
                tooltip.className = "planet-tooltip";
                tooltip.textContent = planetName;

                /* Position the tooltip directly on the cursor */
                tooltip.style.top = event.clientY + "px";
                tooltip.style.left = event.clientX + "px";

                document.body.appendChild(tooltip);
            }
        });

        planet.addEventListener("mouseout", function () {
            if (tooltip && tooltip.parentElement === document.body) {
                document.body.removeChild(tooltip);
            }
        });
    });
});

start();

/* Star canvas */

const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const numStars = 200;

function drawStar(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function generateRandomCoordinates() {
    const x = Math.random() * width;
    const y = Math.random() * height;
    return { x, y };
}

function generateRandomRadius() {
    return Math.random() * 2;
}

function generateRandomColor() {
    const shades = ['white', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)'];
    const randomIndex = Math.floor(Math.random() * shades.length);
    return shades[randomIndex];
}

function createStarField() {
    for (let i = 0; i < numStars; i++) {
        const { x, y } = generateRandomCoordinates();
        const radius = generateRandomRadius();
        const color = generateRandomColor();
        drawStar(x, y, radius, color);
    }
}

createStarField();
