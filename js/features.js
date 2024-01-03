'use strict'

var gNoMinesAroundCount = []
var capturedBoards = []
var firstRange
var secondRange


function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            const currCell = board[i][j]
            if (currCell.isShown || currCell.isMarked || currCell.isMine) continue
            if (currCell.minesAroundCount === 0) {
                gGame.shownCount++
                revealCell(i, j)
                expandShown(board, i, j)
            } else {
                gGame.shownCount++
                revealCell(i, j)
            }
        }
    }
}

    // function expandShown(board, rowIdx, colIdx) {
    //     if (board[rowIdx][colIdx].isMine) return
    //     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    //         if (i < 0 || i >= board.length) continue
    //         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
    //             if (j < 0 || j >= board[0].length) continue
    //             const currCell = board[i][j]
    //             if (currCell.isShown) continue
    //             if (currCell.isMarked) continue
    //             if (currCell.isMine) continue
    //             if (currCell.minesAroundCount === 0) gNoMinesAroundCount.push({ i, j })
    //             gGame.shownCount++
    //             revealCell(i, j)
    //         }
    //     }

    //     for (var i = 0; i < gNoMinesAroundCount.length; i++) {
    //         var locationI = gNoMinesAroundCount[i].i
    //         var locationJ = gNoMinesAroundCount[i].j

    //         gNoMinesAroundCount.splice(i, 1)
    //         expandShown(board, locationI, locationJ)
    //     }
    // }


    // function expandShown(board, i, j) {
    //     expandShownAround(board, i, j)
    // }

    // function expandShownAround(board, rowIdx, colIdx) {
    //     // console.log('expending')

    //     if (board[rowIdx][colIdx].isMine) return
    //     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    //         if (i < 0 || i >= board.length) continue
    //         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
    //             if (j < 0 || j >= board[0].length) continue
    //             const currCell = board[i][j]
    //             if (currCell.isShown) continue
    //             if (currCell.isMarked) continue
    //             if (currCell.isMine) continue
    //             if (currCell.minesAroundCount === 0) gNoMinesAroundCount.push({ i, j })
    //             gGame.shownCount++
    //             revealCell(i, j)
    //         }
    //     }

    //     for (var i = 0; i < gNoMinesAroundCount.length; i++) {
    //         var locationI = gNoMinesAroundCount[i].i
    //         var locationJ = gNoMinesAroundCount[i].j

    //         gNoMinesAroundCount.splice(i, 1)
    //         expandShownAround(board, locationI, locationJ)
    //     }
    // }

    function updateLives() {
        var elLives = document.querySelector(".lives")
        elLives.innerText = `LIVES: ${gGame.lives}`
    }

    function onHint(elHintBtn) {
        console.log('hi:')
        elHintBtn.innerHTML = "<img src='assets/img/clouds/buttons/hint-used.png'>"
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
        // while (randomIdxs.length < 3 || randomIdxs.length < gMines.length) {
        while (randomIdxs.length < gMines.length && randomIdxs.length < 3) {
            var randomIdx = getRandomIntInclusive(0, gMines.length - 1)
            if (!randomIdxs.includes(randomIdx)) {
                randomIdxs.push(randomIdx)
            }
        }

        for (let i = 0; i < randomIdxs.length; i++) {
            const currLocation = gMines[i]
            const currMine = gBoard[currLocation[0]][currLocation[1]]
            if (currMine.isShown) continue
            const location = { i: currLocation[0], j: currLocation[1] }
            const elMine = document.querySelector(getClassName(location))


            elMine.innerText = "💥"
            elMine.classList.remove("cell")
            elMine.classList.add("shown")

            gMines.splice(i, 1)

            // gLevel.MINES--

            // setMinesNegsCount(gBoard)
            // renderBoard(gBoard, ".main-container")

            setTimeout(() => {
                currMine.isMine = false
                currMine.coverBlown = true
                currMine.isShown = true
                currMine.isMarked = false
                elMine.innerText = MINE
                gGame.shownCount++
                console.log('gGame.shownCount:', gGame.shownCount)
                setMinesNegsCount(gBoard)
            }, 1500)
        }
        // console.log('gBoard:', gBoard)
        // console.log('gLevel:', gLevel)

    }

    function onDarkMode(elDarkBtn) {
        const elBody = document.querySelector("body")
        const NIGHTBTNIMG = "<img src='assets/img/clouds/buttons/night.png'>"
        const DAYBTNIMG = "<img src='assets/img/clouds/buttons/day.png'>"
        // const elbtns = document.querySelectorAll("button")

        elBody.classList.toggle("dark")
        // elbtns.forEach(btn => {
        //     btn.classList.toggle("dark")
        // })

        elDarkBtn.innerHTML = elBody.classList.contains("dark") ? DAYBTNIMG : NIGHTBTNIMG
        handleSmiley()
    }

    function onMegaHint() {
        if (gGame.megaHintRange >= 2) return gGame.isMegaHint = false

        gGame.isMegaHint = true
    }

    function handleMegaHint(elCell, i, j) {
        elCell.classList.add("highlight")

        if (gGame.megaHintRange === 1) {
            firstRange = { i, j, elCell }
            return
        }
        if (gGame.megaHintRange === 2) {
            secondRange = { i, j, elCell }
        }

        if (gGame.megaHintRange < 2) return
        if (gGame.megaHintRange > 2) return

        for (var i = firstRange.i; i <= secondRange.i; i++) {
            for (var j = firstRange.j; j <= secondRange.j; j++) {
                const elCurrCell = document.querySelector(getClassName({ i, j }))
                elCurrCell.classList.add("highlight")
                revealCell(i, j)
            }
        }
        setTimeout(() => {
            for (var i = firstRange.i; i <= secondRange.i; i++) {
                for (var j = firstRange.j; j <= secondRange.j; j++) {
                    const elCurrCell = document.querySelector(getClassName({ i, j }))
                    elCurrCell.classList.remove("highlight")
                    hideCell(i, j)
                }
            }
            gGame.isMegaHint = false
            // console.log('gGame:', gGame)
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