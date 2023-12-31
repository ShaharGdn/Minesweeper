'use strict'


function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return


    if (gGame.isMegaHint) {
        gGame.megaHintRange++
        return handleMegaHint(elCell, i, j)
    }


    if (gBoard[i][j].isShown) return
    if (gGame.shownCount === 0 && gGame.markedCount === 0) startTimer()
    if (gGame.isHint) return revealNegs(gBoard, i, j)

    if (!gBoard[i][j].isShown && gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) expandShown(gBoard, i, j)

    revealCell(i, j)
    checkBomb(i, j)
    checkGameOver(i, j)
    handleSmiley()
    captureBoard(gBoard)
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
    if (gBoard[i][j].isShown) return
    if (gGame.isHint) {
        if (gBoard[i][j].isMine && gBoard[i][j].isShown || gBoard[i][j].isMarked) {
            return
        } else {
            elCell.innerText = gBoard[i][j].isMine ? MINE : gBoard[i][j].minesAroundCount

            // if(gBoard[i][j].isMine) elCell.innerText = MINE
            // if (gBoard[i][j].minesAroundCount === 0) elCell.innerText = EMPTY
            // else elCell.innerText = gBoard[i][j].minesAroundCount
            elCell.classList.add("shown")

            return
        }
    }

    gBoard[i][j].isShown = true
    elCell.innerText = gBoard[i][j].isMine ? MINE : gBoard[i][j].minesAroundCount
    // if (gBoard[i][j].isMine) elCell.innerText = MINE
    // if (gBoard[i][j].minesAroundCount === 0) elCell.innerText = EMPTY
    // else elCell.innerText = gBoard[i][j].minesAroundCount
    elCell.classList.add("shown")
    gGame.shownCount++
}

function hideCell(i, j) {
    var elCell = document.querySelector(getClassName({ i, j }))
    if (gGame.isHint) {
        if (gBoard[i][j].isMine && gBoard[i][j].isShown || gBoard[i][j].isMarked || gBoard[i][j].isShown) {
            return
        } else {
            elCell.innerText = EMPTY
            // gBoard[i][j].isShown = false
            // gGame.shownCount--
            return
        }
    }
    gBoard[i][j].isShown = false
    elCell.innerText = EMPTY
    gGame.shownCount--
}
