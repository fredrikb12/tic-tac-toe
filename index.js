const gameBoard = (() => {
    let board = [];
    initialize();

    function _initBoard() {
        for (let i = 0; i < 9; i++) {
            board[i] = "";
        }
    }
    function getBoardState() {
        const currentBoard = board;
        return currentBoard;
    }

    function initialize() {
        _initBoard();
        cacheDOM();
        bindClickEvents();
        render();
    }


    function cacheDOM() {
        this.domSquares = [...document.querySelectorAll(".square")];
        this.startButton = document.querySelector("#start-button");
        this.playerNameInput = document.querySelector("#name-input");
        this.computerName = document.querySelector("#computer");
        this.vsParagraph = document.querySelector("#vs");
        this.playerName = document.querySelector("#player");
    }

    function bindClickEvents() {
        domSquares.forEach(square => {
            square.addEventListener("click", (e) => {
                addMarker(e.target);
            });
        });
        startButton.addEventListener("click", (e) => {
            console.log("click");
            if (playerNameInput.value !== "" && !game.getGameStarted()) {
                renderPlayerNames(playerNameInput.value);
                game.addPlayer(Player(playerName.textContent, "X"));
                game.addPlayer(Player(computerName.textContent, "O"));
            }
        });
    }

    function addMarker(target) {
        if (game.getGameOver()) {
            return;
        }
        const player = game.getPlayerToPlay();
        console.log(player);
        if (target.innerText) {
            return;
        } else {
            target.innerText = player.marker;
            const targetSquare = target.id;
            const targetNumber = targetSquare.slice(targetSquare.length - 1);
            board[targetNumber] = player.marker;
            game.updatePlayerToPlay();
            if (game.checkIfGameOver(targetNumber)) {
                this.gameOver = true;
                const winner = game.getWinner();
                if (winner === "tie") {
                    alert("It's a tie!");
                } else {
                    alert(`${winner.name} wins!`)
                }
            }
        }
    }

    function renderPlayerNames(name) {
        playerNameInput.remove();
        computerName.textContent = "Computer";
        vsParagraph.textContent = "VS";
        playerName.textContent = name;
    }

    function render() {
        const boardToRender = board;
        console.dir(boardToRender);
        for (let i = 0; i < 9; i++) {
            this.domSquares[i].innerText = boardToRender[i];
        }
    }

    return {
        getBoardState,
    };
})();

const game = (() => {
    let players = [];
    let gameStarted = false;
    let gameOver = false;
    let playerToPlay;
    let gameWinner;

    bindClickEvents();

    function addPlayer(player) {
        if (typeof player !== "object") {
            console.log("player is not an object");
            return;
        }
        if (player.getName() && player.getMarker() && players.length < 2) {
            players.push({ name: player.getName(), marker: player.getMarker() });
        } else {
            alert("Adding faulty player, or there are already two players.");
        }
        if (players.length === 2) {
            startGame();
        }
    }

    function bindClickEvents() {
        const startButton = document.querySelector("#start-button");
        startButton.addEventListener("click", (e) => {
            if (!gameStarted) {
                setTimeout(() => {
                    gameStarted = true;
                }, 200);
                e.target.remove();
            }
    });
}

    function updatePlayerToPlay() {
    const board = gameBoard.getBoardState();
    let totalX = 0;
    let totalO = 0;
    board.forEach(square => {
        if (square === "X") {
            totalX++;
        } else if (square === "O") {
            totalO++;
        } else {
            return;
        }
    });

    if (totalO === 0 && totalX === 0) {
        return;
    }

    if (totalO >= totalX) {
        playerToPlay = players.find(player => player.marker === "X");
    } else {
        playerToPlay = players.find(player => player.marker === "O");
    }
}

function startGame() {
    if (players.length < 2 || gameStarted) {
        return;
    } else {
        if (players[0].marker === "X") {
            playerToPlay = players[0];
        } else {
            playerToPlay = players[1];
        }
    }
}

function getPlayerToPlay() {
    if (!gameStarted) {
        return;
    }
    const returnValue = playerToPlay;
    return returnValue;
}

function checkIfGameOver(lastMove) {
    console.log("Last move index is: " + lastMove);
    const board = gameBoard.getBoardState();
    if (board.find(square => square === "") === undefined) {
        gameOver = true;
        gameWinner = "tie";
        return true;

    }
    const lastMoveCol = getColumn(lastMove);
    console.log(`lastMoveCol is`);
    console.log(lastMoveCol);
    const lastMoveRow = getRow(lastMove);
    console.log(`lastMoveRow is`);
    console.log(lastMoveRow);
    if (lastMove == 4) {
        console.log("last move is 4");
        if (checkThreeInRow([board[0], board[4], board[8]]) || checkThreeInRow([board[2], board[4], board[6]])) {
            endGame();
            return true;
        }
    } else if (lastMove == 0 || lastMove == 8) {
        console.log("Last move is 0 or 8");
        if (checkThreeInRow([board[0], board[4], board[8]])) {
            endGame();
            return true;
        }
    } else if (lastMove == 2 || lastMove == 6) {
        console.log("last move is 2 or 6");
        if (checkThreeInRow([board[2], board[4], board[6]])) {
            endGame();
            return true;
        }
    }

    if (checkThreeInRow(lastMoveCol)) {
        console.log("Inside checkThreeInRow(lastmovecol)")
        endGame();
        return true;
    } else if (checkThreeInRow(lastMoveRow)) {
        console.log("Inside checkThreeInRow(lastMoveRow)");
        endGame();
        return true;
    }
}

function checkThreeInRow(array) {
    if (!array || array == undefined) {
        return false;
    }
    if (array[0] === array[1] && array[0] === array[2]) {
        console.log(array);
        return true;
    }
}

function getColumn(index) {
    const board = gameBoard.getBoardState();
    if (index == 0 || index == 3 || index == 6) {
        return [board[0], board[3], board[6]];
    } else if (index == 1 || index == 4 || index == 7) {
        return [board[1], board[4], board[7]];
    } else if (index == 2 || index == 5 || index == 8) {
        return [board[2], board[5], board[8]];
    } else {
        return undefined;
    }
}

function getRow(index) {
    const board = gameBoard.getBoardState();
    if (index == 0 || index == 1 || index == 2) {
        return [board[0], board[1], board[2]];
    } else if (index == 3 || index == 4 || index == 5) {
        return [board[3], board[4], board[5]];
    } else if (index == 6 || index == 7 || index == 8) {
        return [board[6], board[7], board[8]];
    } else {
        return [];
    }
}

function endGame() {
    gameOver = true;
    gameWinner = getLastMover();
}

function getGameOver() {
    return gameOver;
}

function getGameStarted() {
    return gameStarted;
}

function getWinner() {
    return gameWinner;
}

function getLastMover() {
    if (players[0] === playerToPlay) {
        return players[1]
    } else {
        return players[0];
    }
}

return {
    addPlayer,
    updatePlayerToPlay,
    getPlayerToPlay,
    checkIfGameOver,
    getGameOver,
    getGameStarted,
    getWinner,
};
}) ();

const Player = (name, marker) => {
    if (!name || typeof name !== "string") {
        return;
    }
    if (marker !== "X" && marker !== "O" && marker !== "x" && marker !== "o") {
        return;
    }
    const getName = () => name;
    const getMarker = () => {
        return marker.toUpperCase();
    };
    return { getName, getMarker };
};

