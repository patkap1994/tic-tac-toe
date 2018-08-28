//jshint esversion: 6
let player;
let aiPlayer;
let turn;
let computer = true;

let board = null;
let boardContent = [];

const POSSIBLE_WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let squares = document.querySelectorAll('.square');
let overlay = document.querySelector(".overlay");
let togglePlayers = document.querySelector(".toggle-btn");
let nowPlaying = document.querySelector(".now-playing");

window.addEventListener('load', startGame);

togglePlayers.addEventListener('click', toggleGame);

function toggleGame() {
    if (computer) {
        computer = false;
    } else {
        computer = true;
    }

    togglePlayers.firstElementChild.classList.toggle("active");

    startGame();
}

function startGame() {
    player = "X";

    nowPlaying.innerHTML = `Now playing ${player}`;

    overlay.style.display = "none";

    boardContent = ["", "", "", "", "", "", "", "", ""];

    turn = 0;

    for (let i = 0; i < squares.length; i++) {
        squares[i].innerHTML = "";
        squares[i].addEventListener('click', makeMove);
    }

    if (computer) {
        aiPlayer = "O";
        player = "X";

        nowPlaying.innerHTML = "You are X, play first.";
    }
}

function makeMove() {
    if (this.innerHTML == "") {
        this.innerHTML = player;
        turn++;

        if (!computer) {
            if (player == "X") {
                player = "O";
            } else {
                player = "X";
            }

            nowPlaying.innerHTML = `Now playing ${player}`;
        }



        if (checkWinner(squares)) {
            announceWinner();
        } else if (computer) {
            computerMove();
        }
    }
}

function computerMove() {
    let counter = 1;

    for (let i = 0; i < boardContent.length; i++) {
        if (boardContent[4] == "") {
            squares[4].innerHTML = aiPlayer;
            turn++;
        } else if (boardContent[i] == "" && counter > 0) {
            squares[i].innerHTML = aiPlayer;
            counter--;
            turn++;
        }
    }

    if (checkWinner(squares)) {
        announceWinner();
    }
}

function checkWinner(squares) {
    board = Array.prototype.slice.call(squares);

    boardContent = board.map((elem) => {
        return elem.innerHTML;
    });

    let x = POSSIBLE_WINS.find((elem) => {
        return (boardContent[elem[0]] !== "" && boardContent[elem[1]] !== "" && boardContent[elem[2]] !== "" &&
            boardContent[elem[0]] === boardContent[elem[1]] && boardContent[elem[1]] === boardContent[elem[2]]);
    });

    if (!x) {
        x = "draw";

        for (let elem of boardContent) {
            if (elem == "") {
                x = undefined;
            }
        }
    }

    return x;
}

function announceWinner() {
    let winner = document.querySelector(".result");
    let restart = document.querySelector(".btn");

    if (checkWinner(squares) == "draw") {
        winner.innerHTML = "It's a draw!";
    } else if (turn % 2 == 0) {
        winner.innerHTML = "Player O won!";
    } else if (turn % 2 != 0) {
        winner.innerHTML = "Player X won!";
    }

    overlay.style.display = "flex";

    restart.addEventListener("click", startGame);
}