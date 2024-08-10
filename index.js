let currentMoleTile;
let currentPlantTiles = [];
let score = 0;
let gameOver = false;
let timer = 60;
let moleInterval;
let plantInterval;

window.onload = function () {
    setGame();
    startTimer();
}

function setGame() {
    const board = document.getElementById("board");
    if (!board) {
        console.error("Board element not found!");
        return;
    }

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.classList.add("tile");
        tile.addEventListener("click", selectTile);
        board.appendChild(tile);
    }
    moleInterval = setInterval(setMole, 1000);
    plantInterval = setInterval(setPlant, 2000);
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currentMoleTile) {
        currentMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./taupe.png";
    mole.alt = "Mole";

    let num;
    do {
        num = getRandomTile();
    } while (currentPlantTiles.some(tile => tile.id === num));

    currentMoleTile = document.getElementById(num);
    currentMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }

    currentPlantTiles.forEach(tile => {
        tile.innerHTML = "";
    });
    currentPlantTiles = [];

    let numberOfPlants = timer <= 30 ? 3 : 1;

    for (let i = 0; i < numberOfPlants; i++) {
        let plant = document.createElement("img");
        plant.src = "./plant.png";
        plant.alt = "Plant";

        let num;
        do {
            num = getRandomTile();
        } while (
            (currentMoleTile && currentMoleTile.id === num) ||
            currentPlantTiles.some(tile => tile.id === num)
            );

        let tile = document.getElementById(num);
        tile.appendChild(plant);
        currentPlantTiles.push(tile);
    }
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this === currentMoleTile) {
        score += 1;
        document.getElementById("score").innerHTML = score.toString();
    } else if (currentPlantTiles.includes(this)) {
        document.getElementById("score").innerHTML = "GAME OVER: " + score.toString();
        gameOver = true;
        clearIntervals();
    }
}

function clearIntervals() {
    clearInterval(moleInterval);
    clearInterval(plantInterval);
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    const interval = setInterval(() => {
        if (gameOver) {
            clearInterval(interval);
            return;
        }

        timer--;
        if (timerElement) {
            timerElement.innerText = `Time: ${timer}s`;
        }

        if (timer <= 0) {
            clearInterval(interval);
            document.getElementById("score").innerHTML = "TIME UP: " + score.toString();
            gameOver = true;
            clearIntervals();
        }

        if (timer === 30) {
            clearInterval(plantInterval);
            plantInterval = setInterval(setPlant, 1000);
        }
    }, 1000);
}

function reloadGame() {
    window.location.reload();
}
