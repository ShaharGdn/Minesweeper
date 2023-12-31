'use strict'

var gNoMinesAroundCount = []
var capturedBoards = []
var firstRange
var secondRange

// function setMinesNegsCount(board) {
//     var negs = []
//     for (var i = 0; i < board.length; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = 0; j < board[i].length; j++) {
//             if (j < 0 || j >= board[0].length) continue
//             var currCell = board[i][j]
//             currCell.minesAroundCount = countNegs(board, i, j)
//         }
//         if (currCell.minesAroundCount === 0) negs.push({ i, j })
//     }
//     return negs
// }

function expandShown(board, i, j) {
    expandShownAround(board, i, j)
    checkGameOver(i, j)
}

function expandShownAround(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isShown) continue
            if (board[i][j].isMarked) continue
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].minesAroundCount === 0) gNoMinesAroundCount.push({ i, j })
            revealCell(i, j)
        }
    }

    for (var i = 0; i < gNoMinesAroundCount.length; i++) {
        var locationI = gNoMinesAroundCount[i].i
        var locationJ = gNoMinesAroundCount[i].j

        gNoMinesAroundCount.splice(i, 1)
        expandShownAround(board, locationI, locationJ)
    }

    // console.log('gNoMinesAroundCount:', gNoMinesAroundCount)

}

function updateLives() {
    var elLives = document.querySelector(".lives")
    elLives.innerText = `LIVES: ${gGame.lives}`
}

function onHint(elHintBtn) {
    console.log('hi:')
    elHintBtn.innerText = HINTUSED
    gGame.isHint = true
}

function onSafe() {
    if (gGame.safeClicks === 0) return

    const location = getRandomSafe(gBoard)
    const elSafeCell = document.querySelector(getClassName(location))
    elSafeCell.classList.add("safe")

    setTimeout(() => {
        elSafeCell.classList.remove("safe")
    }, 1500)
}

function revealNegs(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            // if (gBoard[i][j].minesAroundCount > 0) continue
            revealCell(i, j)
        }
    }
    setTimeout(() => {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= board[0].length) continue
                hideCell(i, j)
            }
        }
        gGame.isHint = false
    }, 1000)
}

function saveBestScore() {
    if (!localStorage.getItem("bestScore")) {
        localStorage.setItem("bestScore", "9999")
    }
    const storedScore = localStorage.getItem("bestScore")
    var score = `${gGame.secsPassed}`
    if (gGame.secsPassed < +storedScore) {
        localStorage.setItem("bestScore", `${score}`)
    }
}

function getRandomSafe(board) {
    // console.log("hello")
    var randomI = getRandomIntInclusive(0, board.length - 1)
    var randomJ = getRandomIntInclusive(0, board.length - 1)

    while (board[randomI][randomJ].isMine || board[randomI][randomJ].isMarked || board[randomI][randomJ].isShown && !(gGame.shownCount >= (gLevel.SIZE ** 2 - gLevel.MINES))) {
        randomI = getRandomIntInclusive(0, board.length - 1)
        randomJ = getRandomIntInclusive(0, board.length - 1)

    }
    if ((gGame.shownCount >= (gLevel.SIZE ** 2 - gLevel.MINES))) return

    // console.log(randomI, randomJ)
    gGame.safeClicks--
    return { i: randomI, j: randomJ }
}

function onExterminate() {
    var randomIdxs = []
    while (randomIdxs.length < gMines.length && randomIdxs.length < 3) {
        var randomIdx = getRandomIntInclusive(0, gMines.length - 1)
        if (!randomIdxs.includes(randomIdx)) {
            randomIdxs.push(randomIdx)
        }
    }

    for (let i = 0; i < randomIdxs.length; i++) {
        const currLocation = gMines[i]
        const currMine = gBoard[currLocation[0]][currLocation[1]]
        const location = { i: currLocation[0], j: currLocation[1] }
        const elMine = document.querySelector(getClassName(location))

        currMine.isMine = false
        currMine.isShown = false
        currMine.isMarked = false
        gMines.splice(i, 1)

        console.log('elMine:', elMine)
        console.log('currMine:', currMine)
        elMine.innerText = "💥"

        gLevel.MINES--

        setMinesNegsCount(gBoard)

        setTimeout(() => {
            elMine.innerText = EMPTY
        }, 1500)
    }
    console.log('gBoard:', gBoard)
    console.log('gLevel:', gLevel)

}

function onDarkMode() {
    const elBody = document.querySelector("body")
    const elbtns = document.querySelectorAll("button")
    // console.log('elBody:',elBody )
    elBody.classList.toggle("dark")
    elbtns.forEach(btn => {
        btn.classList.toggle("dark")
    })
}

function onMegaHint() {
    if (gGame.megaHintRange >= 2) return gGame.isMegaHint = false

    gGame.isMegaHint = true
}

function handleMegaHint(elCell, i, j) {
    elCell.classList.add("highlight")

    if (gGame.megaHintRange === 1) {
        firstRange = { i, j ,elCell}
        return
    }
    if (gGame.megaHintRange === 2) {
        secondRange = { i, j ,elCell}
        console.log('firstRange:', firstRange.i)
        console.log('secondRange:', secondRange.i)
        console.log('firstRange:', firstRange)
        console.log('secondRange:', secondRange)
    }

    if (gGame.megaHintRange < 2) return
    if (gGame.megaHintRange > 2) return

    for (var i = firstRange.i; i <= secondRange.i; i++) {
        for (var j = firstRange.j; j <= secondRange.j; j++) {
            const elCurrCell = document.querySelector(getClassName({i,j}))
            elCurrCell.classList.add("highlight")
            revealCell(i, j)
        }
    }
    setTimeout(() => {
        for (var i = firstRange.i; i <= secondRange.i; i++) {
            for (var j = firstRange.j; j <= secondRange.j; j++) {
                const elCurrCell = document.querySelector(getClassName({i,j}))
                elCurrCell.classList.remove("highlight")
                hideCell(i, j)
            }
        }
        gGame.isMegaHint = false
        console.log('gGame:', gGame)
    }, 2000)
}

// function captureBoard(board) {
//     var currBoard = board.slice()
//     console.log('currBoard:', currBoard)
//     capturedBoards.push(currBoard)
//     console.log('capturedBoards:',capturedBoards )
// }

// function expandShownAround(board, rowIdx, colIdx) {
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j >= board[0].length) continue
//             if (board[i][j].isShown) continue
//             if (board[i][j].isMarked) continue
//             if (gBoard[i][j].isMine) continue
//             if (gBoard[i][j].minesAroundCount === 0) gNoMinesAroundCount.push({ i, j })
//             revealCell(i, j)
//         }
//     }

//     for (var i = 0; i < gNoMinesAroundCount.length; i++) {
//         var locationI = gNoMinesAroundCount[i].i
//         var locationJ = gNoMinesAroundCount[i].j

//         gNoMinesAroundCount.splice(i, 1)
//         expandShownAround(board, locationI, locationJ)
//     }

//     // console.log('gNoMinesAroundCount:', gNoMinesAroundCount)

// }