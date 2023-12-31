'use strict'

const MINE = "💣"
const FLAG = "🚩"
const EMPTY = ''
const HINTUSED = '𝘅'

const NORMAL = "😁"
const HAPPY = "🤠"
const SAD = "👹"

var gBoard
var gSecInterval
var gMines

const gGame = {
    isOn: false,
    isWin: false,
    isHint: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 1,
    lives: 0,
    safeClicks: 3,
    megaHintRange: 0
}

const gLevel = {
    SIZE: 8, MINES: 14
}

function init() {
    gBoard = makeBoard(gLevel.SIZE)
    // console.log('gBoard:', gBoard)
    renderBoard(gBoard, ".main-container")
    resetBoard()
    clearInterval(gSecInterval)
}

function resetBoard() {
    const elSmiley = document.querySelector(".smiley-btn")
    const elScore = document.querySelector(".score")
    const elBestScore = document.querySelector(".best-score")
    const elHintBtns = document.querySelectorAll(".hint-btn")

    gGame.isOn = true
    gGame.isWin = false
    gGame.isHint = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 1
    gGame.lives = 3
    gGame.safeClicks = 3
    gGame.megaHintRange = 0

    updateLives()

    elSmiley.innerText = NORMAL
    elScore.innerText = "TIME PASSED: 0"
    elBestScore.innerText = localStorage.getItem("bestScore") ? `BEST SCORE: ${localStorage.getItem("bestScore")}` : "BEST SCORE: play first:)"

    elHintBtns.forEach(btn => {
        btn.innerText = "💡"
    })
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
    placeMines(board)

    // board[0][0].isMine = true
    // board[0][1].isMine = true

    setMinesNegsCount(board)
    return board
}

function placeMines(board) {
    gMines = []

    for (var i = 0; i < gLevel.MINES; i++) {
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
    }
    gMines.forEach(location => {
        board[location[0]][location[1]].isMine = true
    })
    // console.log('randomNums:', randomNums)
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = 0; j < board[i].length; j++) {
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            currCell.minesAroundCount = countNegs(board, i, j)
        }
    }
}

function expandShown(board, elCell, i, j) {

}

function handleSmiley() {
    const elSmiley = document.querySelector(".smiley-btn")
    if (!gGame.isOn && !gGame.isWin) elSmiley.innerText = SAD
    else if (gGame.isWin) elSmiley.innerText = HAPPY
}

function startTimer() {
    gSecInterval = setInterval(() => {
        const elScore = document.querySelector(".score")
        elScore.innerText = `TIME PASSED: ${gGame.secsPassed++}`
    }, 1000)
}

function checkBomb(i, j) {
    if (gBoard[i][j].isMine) gGame.lives--
    updateLives()
}

function checkGameOver() {
    // console.log("checking game over")
    if (!gGame.lives) {
        console.log("Game Over")
        gGame.isOn = false
        clearInterval(gSecInterval)
        saveBestScore()
        return
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            console.log('gGame.shownCount:', gGame.shownCount)
            if (gGame.shownCount === (gLevel.SIZE ** 2)) break
            if (currCell.isMine && !currCell.isMarked) return
            if (gGame.shownCount !== (gLevel.SIZE ** 2 - gLevel.MINES)) return
        }
    }
    console.log("WON")
    gGame.isWin = true
    gGame.isOn = false
    clearInterval(gSecInterval)
    saveBestScore()
    return
}

// function handleLevelChange(elLevel) {
//     console.log('elLevel:', elLevel.value)
//     if(elLevel.value === "Beginner") {
//         gLevel.SIZE = 4
//         gLevel.MINES = 2   
//         // init()
//     }
//     if(elLevel.value === "Intermediate") {
//         gLevel.SIZE = 8
//         gLevel.MINES = 14
//         // init()
//     }
//     if(elLevel.value === "Expert"){
//         gLevel.SIZE = 12
//         gLevel.MINES = 32
//         // init()
//     }
// }

