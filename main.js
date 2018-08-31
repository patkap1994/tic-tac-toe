//jshint esversion: 6
let player;
let aiPlayer = "O";
let turn;

let playingWithComputer = true;

let board = [];
const WINNING_COMBINATIONS = [
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
    playingWithComputer = !playingWithComputer;

    togglePlayers.firstElementChild.classList.toggle("active");

    startGame();
}

function startGame() {
    player = "X";

    nowPlaying.innerHTML = playingWithComputer ? "You are X, play first." : `Now playing ${player}`;

    overlay.style.display = "none";

    board = [...Array(9)].fill("");

    turn = 0;

    for (let i = 0; i < squares.length; i++) {
        squares[i].innerHTML = "";
        squares[i].addEventListener('click', makeMove);
    }
}

function makeMove(e) {
    if (e.target.innerHTML == "") {
        e.target.innerHTML = player;
        turn++;

        if (!playingWithComputer) {
            player = player == "X" ? "O" : "X";
            nowPlaying.innerHTML = `Now playing ${player}`;
        }

        if (checkWinner(squares)) {
            announceWinner();
        } else if (playingWithComputer) {
            computerMove();
        }
    }
}



function computerMove() {
    let counter = 1;
    let boardCopy = board.slice();

    function findElement(elem) {
        return (boardCopy[elem[0]] !== "" && boardCopy[elem[1]] !== "" && boardCopy[elem[2]] !== "" &&
            boardCopy[elem[0]] === boardCopy[elem[1]] && boardCopy[elem[1]] === boardCopy[elem[2]]);
    }

    function makeBestMove(iterator) {
        let bestComputerMove = WINNING_COMBINATIONS.find(findElement);

        if (bestComputerMove && counter > 0) {
            squares[iterator].innerHTML = aiPlayer;
            counter--;
        }

        boardCopy = board.slice();
    }

    for (let k = 0; k < boardCopy.length; k++) {

        if (boardCopy[k] == "") {
            boardCopy[k] = aiPlayer;
        }

        makeBestMove(k);
    }

    for (let j = 0; j < boardCopy.length; j++) {

        if (boardCopy[j] == "") {
            boardCopy[j] = player;
        }

        makeBestMove(j);

    }

    if (board[4] == "" && counter > 0) {
        squares[4].innerHTML = aiPlayer;
    } else if (counter > 0) {
        let possibleMoves = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                possibleMoves.push(i);
            }
        }

        let randomSquare = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        squares[randomSquare].innerHTML = aiPlayer;
    }

    turn++;

    if (checkWinner(squares)) {
        announceWinner();
    }
}

function checkWinner(squares) {
    board = Array.prototype.slice.call(squares).map((elem) => {
        return elem.innerHTML;
    });

    let x = WINNING_COMBINATIONS.find((elem) => {
        return (board[elem[0]] !== "" && board[elem[1]] !== "" && board[elem[2]] !== "" &&
            board[elem[0]] === board[elem[1]] && board[elem[1]] === board[elem[2]]);
    });

    if (!x) {
        x = "draw";
        for (let elem of board) {
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