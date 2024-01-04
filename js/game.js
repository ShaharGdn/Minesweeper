'use strict'

const MINE = "💣"
const FLAG = "🚩"
const EMPTY = ''
const HINTUSED = '𝘅'

const NORMALSUN = "<img src='assets/img/buttons/normal-sun.png'>"
const HAPPYSUN = "<img src='assets/img/buttons/happy-sun.png'>"
const SADSUN = "<img src='assets/img/buttons/sad-sun.png'>"
const NORMALMOON = "<img src='assets/img/buttons/regular-moon.png'>"
const HAPPYMOON = "<img src='assets/img/buttons/happy-moon.png'>"
const SADMOON = "<img src='assets/img/buttons/sad-moon.png'>"

var gBoard
var gSecInterval
var gMines

const gLevel = {
    SIZE: 4, MINES: 2
}

const gGame = {
    isOn: false,
    isWin: false,
    isHint: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 1,
    lives: 0,
    safeClicks: 3,
    megaHintRange: 0,
    isMegaHint: false,
    hintCount: 3,
    mineCount: gLevel.MINES,
}

function init() {
    gBoard = makeBoard(gLevel.SIZE)
    renderBoard(gBoard, ".main-container")
    resetBoard()
    clearInterval(gSecInterval)
    updateBombs()
}

function resetBoard() {
    const elScore = document.querySelector(".score")
    const elBestScore = document.querySelector(".best-score")
    const elHintBtn = document.querySelector(".hint-btn")

    gGame.isOn = true
    gGame.isWin = false
    gGame.isHint = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 1
    gGame.lives = 3
    gGame.safeClicks = 3
    gGame.megaHintRange = 0
    gGame.isMegaHint = false
    gGame.hintCount = 3
    gGame.mineCount = gLevel.MINES


    updateLives()
    handleSmiley()
    updateBombs()

    elScore.innerText = "TIME PASSED: 0"
    elBestScore.innerText = localStorage.getItem("bestScore") ? `BEST SCORE: ${localStorage.getItem("bestScore")}` : "BEST SCORE: play first:)"
    elHintBtn.innerHTML = "<img src='assets/img/buttons/hint.png'>"
}

function makeBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    placeMines(board, gLevel.MINES)
    setMinesNegsCount(board)
    return board
}

function placeMines(board, mines) {
    gMines = []

    if (gMines.length > gLevel.MINES) return

    for (var i = 0; i < mines; i++) {
        var randomI
        var randomJ

        while (true) {
            randomI = getRandomIntInclusive(0, board.length - 1)
            randomJ = getRandomIntInclusive(0, board.length - 1)

            var isDuplicate = false
            for (var k = 0; k < gMines.length; k++) {
                if (gMines[k][0] === randomI && gMines[k][1] === randomJ) {
                    isDuplicate = true
                    break
                }
            }

            if (!isDuplicate) {
                break
            }
        }

        gMines.push([randomI, randomJ])
        // console.log('gMines:', gMines)
    }
    gMines.forEach(location => {
        board[location[0]][location[1]].isMine = true
    })
}

// function placeMines(board) {
//     gMines = []

//     if(gMines.length > gLevel.MINES) return

//     for (var i = 0; i < gLevel.MINES; i++) {
//         var randomI
//         var randomJ

//         while (true) {
//             randomI = getRandomIntInclusive(0, board.length - 1)
//             randomJ = getRandomIntInclusive(0, board.length - 1)

//             var isDuplicate = false
//             for (var k = 0; k < gMines.length; k++) {
//                 if (gMines[k][0] === randomI && gMines[k][1] === randomJ) {
//                 // if (gMines[k][0] === randomI && gMines[k][1] === randomJ || board[randomI][randomJ] === board[location.i][location.j]) {
//                     isDuplicate = true
//                     break
//                 }
//             }

//             if (!isDuplicate) {
//                 break
//             }
//         }

//         gMines.push([randomI, randomJ])
//         console.log('gMines:', gMines)
//     }
//     gMines.forEach(location => {
//         board[location[0]][location[1]].isMine = true
//     })
//     // console.log('randomNums:', randomNums)
// }

function handleSmiley() {
    const elSmiley = document.querySelector(".smiley-btn")
    const elBody = document.querySelector("body")
    if (gGame.isOn) elSmiley.innerHTML = elBody.classList.contains("dark") ? NORMALMOON : NORMALSUN
    if (!gGame.isOn && !gGame.isWin) elSmiley.innerHTML = elBody.classList.contains("dark") ? SADMOON : SADSUN
    else if (gGame.isWin) elSmiley.innerHTML = elBody.classList.contains("dark") ? HAPPYMOON : HAPPYSUN
}

function startTimer() {
    gSecInterval = setInterval(() => {
        const elScore = document.querySelector(".score")
        elScore.innerText = `TIME PASSED: ${gGame.secsPassed++}`
    }, 1000)
}

function checkBomb(i, j) {
    if (gBoard[i][j].isMine) {
        gGame.lives--
        gGame.mineCount--
        updateLives()
    }
    updateLives()
}

function checkGameOver() {
    updateBombs()

    if (!gGame.lives || gLevel.MINES === 2 && gGame.lives < 2) {
        console.log("Game Over")
        gGame.isOn = false
        clearInterval(gSecInterval)
        saveBestScore()
        revealBombs()
        handleSmiley()
        gMines = []
        return
    }

    if (gGame.shownCount !== (gLevel.SIZE ** 2 - gGame.markedCount)) return
    if (gGame.shownCount === (gLevel.SIZE ** 2)) return

    console.log("WON")
    gGame.isWin = true
    gGame.isOn = false
    clearInterval(gSecInterval)
    saveBestScore()
    handleSmiley()
    gMines = []
    return
}

function handleLevelChange(elLevel) {
    if (elLevel.value === "beginner") {
        console.log('hello:')
        gLevel.SIZE = 4
        gLevel.MINES = 2
        init()
    }
    if (elLevel.value === "intermediate") {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        init()
    }
    if (elLevel.value === "expert") {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        init()
    }
}

function updateBombs() {
    const elBombsCount = document.querySelector(".bombs-count")
    elBombsCount.innerText = `BOMBS: ${gGame.mineCount}`
}