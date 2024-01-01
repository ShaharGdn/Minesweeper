'use strict'


function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    console.log('gGamge.shownCount:', gGame.shownCount)


    if (gGame.isMegaHint) {
        gGame.megaHintRange++
        return handleMegaHint(elCell, i, j)
    }


    if (gBoard[i][j].isShown) return
    if (gGame.shownCount === 0 && gGame.markedCount === 0) startTimer()
    if (gGame.isHint) return revealNegs(gBoard, i, j)

    if (!gBoard[i][j].isShown && gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) return expandShown(gBoard, i, j)


    gGame.shownCount++
    revealCell(i, j)
    checkBomb(i, j)
    checkGameOver()
    handleSmiley()
    // captureBoard(gBoard)

}

function onCellMarked(elCell, i, j, event) {
    event.preventDefault()
    if (gGame.shownCount === 0 && gGame.markedCount === 0) startTimer()
    if (gBoard[i][j].isShown) return

    if (gBoard[i][j].isMarked) {
        if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
            return
        }
        gBoard[i][j].isMarked = false
        elCell.innerText = EMPTY
        gGame.markedCount--
        checkGameOver()
        return
    }

    //update model
    gBoard[i][j].isMarked = true
    //update dom
    elCell.innerText = FLAG
    gGame.markedCount++
    checkGameOver()
    handleSmiley()
    captureBoard(gBoard)
}

function revealCell(i, j) {

    var elCell = document.querySelector(getClassName({ i, j }))

    if (gGame.isHint || gGame.isMegaHint) {
        if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
            return
        } else {
            elCell.classList.toggle("cell")
            elCell.classList.add("shown")
            handleInnerCell(i, j, elCell)

            return
        }
    }

    gBoard[i][j].isShown = true
    // gGame.shownCount++

    elCell.classList.toggle("cell")
    elCell.classList.add("shown")
    handleInnerCell(i, j, elCell)
    checkGameOver()

}

function hideCell(i, j) {
    var elCell = document.querySelector(getClassName({ i, j }))

    if (gBoard[i][j].isMarked) return elCell.innerText = FLAG

    if (gGame.isHint || gGame.isMegaHint) {
        // elCell.classList.toggle("shown")
        elCell.classList.add("cell")
        if (gBoard[i][j].isShown) return
        if (gBoard[i][j].isMine && gBoard[i][j].isShown || gBoard[i][j].isMarked || gBoard[i][j].isShown) {
            return
        } else {
            elCell.innerText = EMPTY
            return
        }
    }
    gBoard[i][j].isShown = false
    elCell.innerText = EMPTY
    gGame.shownCount--
}

function revealNegs(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            const currCell = board[i][j]
            if (currCell.isShown) continue
            // if (gBoard[i][j].minesAroundCount > 0) continue
            revealCell(i, j)
        }
    }
    setTimeout(() => {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= board[0].length) continue
                const currCell = board[i][j]
                if (currCell.isShown) continue
                hideCell(i, j)
            }
        }
        gGame.isHint = false
    }, 1000)
}

function handleInnerCell(i, j, elCell) {
    if (gBoard[i][j].isMine) return elCell.innerText = MINE
    if (gBoard[i][j].minesAroundCount === 0) return elCell.innerText = EMPTY
    if (gBoard[i][j].minesAroundCount === 1)  {
        elCell.id = ""
        elCell.id = "one"
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
    if (gBoard[i][j].minesAroundCount === 2)  {
        elCell.id = ""
        elCell.id = "two"
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
    if (gBoard[i][j].minesAroundCount === 3)   {
        elCell.id = ""
        elCell.id = "three"
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
    if (gBoard[i][j].minesAroundCount === 4)    {
        elCell.id = ""
        elCell.id = "four"
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
    // else elCell.innerText = gBoard[i][j].minesAroundCount
    // if (gBoard[i][j].isMine) return elCell.innerText = MINE
    // if (gBoard[i][j].minesAroundCount === 0) return elCell.innerText = EMPTY
    // else elCell.innerText = gBoard[i][j].minesAroundCount
}

function revealBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) revealCell(i,j)
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = 0; j < board[i].length; j++) {
            if (j < 0 || j >= board[0].length) continue
            const elCell = document.querySelector(getClassName({i,j}))
            const currCell = board[i][j]
            currCell.minesAroundCount = countNegs(board, i, j)
            if(currCell.isShown && !currCell.coverBlown) handleInnerCell(i,j,elCell)
        }
    }
}