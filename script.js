let main = document.querySelector(".main");
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const nextTetroElem = document.getElementById("next-tetro");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const gameOver = document.getElementById("game-over");
const gameOverScore = document.getElementById("game-over-score");
const gameOverScoreElem = document.getElementById("score-over");
// let playfield = Array(20).fill(Array(10).fill(0));

let playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
];
// let gameSpeed = 400;
let score = 0;
let gameTimerId;
let currentLevel = 1;
let isPaused = true; 
let possibleLevels = {
    1: {
        scorePerLine: 10,
        speed: 500,
        nextLevelScore: 200,
    },
    2: {
        scorePerLine: 15,
        speed: 400,
        nextLevelScore: 500,
    },
    3: {
        scorePerLine: 20,
        speed: 300,
        nextLevelScore: 1000,
    },
    4: {
        scorePerLine: 30,
        speed: 200,
        nextLevelScore: 2000,
    },
    5: {
        scorePerLine: 50,
        speed: 100,
        nextLevelScore: Infinity,
    },
};

let figures = {
    O: [
        [1, 1],
        [1, 1],
    ],
    I: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    K: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
};

let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

function draw() {
    let mainInnerHTML = "";
for (let y = 0; y < playfield.length; y++) {    
    for (let x = 0; x < playfield[y].length; x++ ) {
        if (playfield[y][x] === 1) {
            mainInnerHTML += '<div class="cell movingCell"></div>';
        } else if (playfield[y][x] === 2) {
            mainInnerHTML += '<div class="cell fixedCell"></div>';
        } else  {
            mainInnerHTML += '<div class="cell"></div>';
        } 
    }
}
main.innerHTML = mainInnerHTML;
}


function drawNextTetro() {
    let nextTetroInnerHTML = "";
    for (let y = 0; y < nextTetro.shape.length; y++) {    
        for (let x = 0; x < nextTetro.shape[y].length; x++ ) {
            if (nextTetro.shape[y][x]) {
                nextTetroInnerHTML += '<div class="cell movingCell"></div>';
            } else {
                nextTetroInnerHTML += '<div class="cell"></div>';
            }
        }
        nextTetroInnerHTML += "<br/>";
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML;
}

function removePrevActiveTetro() {
    for (let y = 0; y < playfield.length; y++) {    
        for (let x = 0; x < playfield[y].length; x++ ) {
            if ( playfield[y][x] === 1) {
                playfield[y][x] = 0;                
            }
        }
    }
}

function addActiveTetro() {
    removePrevActiveTetro();
    for (let y = 0; y < activeTetro.shape.length ; y++ ) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x]) {
                playfield[activeTetro.y +y][activeTetro.x +x] = activeTetro.shape[y][x];
            }
        }
    }
}

function rotateTetro() {
    const prevTetroState = activeTetro.shape;

    activeTetro.shape = activeTetro.shape[0].map((val, index) => 
    activeTetro.shape.map((row) => row[index]).reverse()
    );

    if (hasCollisions()) {
        activeTetro.shape = prevTetroState;
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length ; y++ ) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if ( activeTetro.shape[y][x] && ( playfield[activeTetro.y + y] === undefined || playfield[activeTetro.y + y][activeTetro.x + x] === undefined || playfield[activeTetro.y + y][activeTetro.x + x] === 2)
                ) {
                return true;
            }
        }
    }
    return false;
}

function canTetroMoveDown() {
    for (let y = 0; y < playfield.length ; y++ ) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                if ( y === playfield.length - 1 || playfield[y + 1][x] === 2) {
                    return false;
                }
            }
        }
    }
    return true;
}

function removeFullLines() {
    let canRemoveLine = true,
        filledLines = 0;
    for (let y = 0; y < playfield.length ; y++ ) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canRemoveLine = false;
                break;
            } 
        }
        if (canRemoveLine) {
            playfield.splice(y, 1); 
            playfield.splice(0, 0, [0, 0, 0, 1, 1, 0, 0, 0, 0, 0]); 
            filledLines += 1;            
        }
        canRemoveLine = true;
    }

    switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine; 
            break;
        case 2: 
        score += possibleLevels[currentLevel].scorePerLine * 3;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 6; 
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 12; 
            break;       
    }
     
    scoreElem.innerHTML = score; 
    gameOverScoreElem.innerHTML = score;
    
    if (score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel ++ ;
        levelElem.innerHTML = currentLevel;
    }
}

function getNewTetro() {
    const possibleFigures = 'IOLJSTZK';
    const rand = Math.floor(Math.random() * 7);
    const newTetro =figures[possibleFigures[rand]];
    return {
        x: Math.floor((10 - newTetro[0].length) / 2),
        y: 0,
        shape: newTetro,
    };
}

function fixTetro() {
    for (let y = 0; y < playfield.length ; y++ ) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 2;
            }
        }
    }       
}

function moveTetroDown() {    
            activeTetro.y += 1;
        if (hasCollisions()) {
            activeTetro.y -= 1;
            fixTetro();
            removeFullLines();
            activeTetro = nextTetro;
            if (hasCollisions()) {
                reset();
            }
            nextTetro = getNewTetro();         
    }
}  

function dropTetro() {
    for (let y = activeTetro.y; y < playfield.length; y++) {
        activeTetro.y += 1;
        if (hasCollisions()) {
            activeTetro.y -= 1;
            break;
        }
    }    
}

function reset() {
    isPaused = true;
    clearTimeout(gameTimerId);
    gameOverScoreElem.innerHTML = score;
    
    playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
    ];
    draw();
    
    gameOver.style.display = "block";
    gameOverScore.style.display = "block";
    
}

document.onkeydown = function (e) { 
    if (!isPaused) {   
    if (e.keyCode === 37 || e.keyCode === 65) {
       activeTetro.x -= 1;
       if (hasCollisions()) {
        activeTetro.x += 1;
    }
    } else if (e.keyCode === 39 || e.keyCode === 68) {
        activeTetro.x += 1;
        if (hasCollisions()) {
            activeTetro.x -= 1;
        }
    } else if (e.keyCode === 40 || e.keyCode === 83) {
        moveTetroDown();
    } else if (e.keyCode === 38 || e.keyCode === 87) {
        rotateTetro();
    } else if (e.keyCode === 32) {
        dropTetro();
    }
    updateGameState();
 }
};

function updateGameState() {
    if (!isPaused) {
        addActiveTetro();
        draw();
        drawNextTetro();
    }    
}

pauseBtn.addEventListener("click", (e) => {
    if (e.target.innerHTML === 'Pause') {
        e.target.innerHTML = "Keep Playing...";
        clearTimeout(gameTimerId);
    } else {
        e.target.innerHTML = "Pause";
        gameTimerId = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
    isPaused = !isPaused;
});

startBtn.addEventListener('click', (e) => {
    e.target.innerHTML = 'Start again';
    isPaused = false;
    gameTimerId = setTimeout(startGame, possibleLevels[currentLevel].speed);
    gameOver.style.display = "none";
    gameOverScore.style.display = "none";
})

scoreElem.innerHTML = score;
gameOverScoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

// addActiveTetro();
 draw();
// drawNextTetro();

function startGame() {
    moveTetroDown(); 
    if (!isPaused) {             
    updateGameState();
    gameTimerId = setTimeout(startGame, possibleLevels[currentLevel].speed); 
}       
}
// setTimeout(startGame, possibleLevels[currentLevel].speed);

