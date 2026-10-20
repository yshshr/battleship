function DomStuff() {
  const gameBoardSelectors = [".gameBoardOne", ".gameBoardTwo"];

  /**
   *
   * @param {*} board 棋盘
   * @param {*} boardIndex 棋盘坐标 0-玩家 1-电脑
   * @param {*} clickBoardHandler
   * @param {*} boardDisabled 棋盘是否禁用
   * @param {*} lastMove 上一步棋的坐标
   * @param {*} visible 是否可见 true:全部可见 false:部分可见
   */
  const renderBoard = (
    board,
    boardIndex,
    clickBoardHandler,
    boardDisabled,
    lastMove,
    visible = true,
  ) => {
    const boardDiv = document.querySelector(gameBoardSelectors[boardIndex]);
    boardDiv.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = board[i][j];
        let btnContent;
        let btnDisabled = false;
        if (cell.hitState === null) {
          btnContent = "-";
        } else if (cell.hitState === 0) {
          btnContent = "O";
          btnDisabled = true;
        } else {
          btnContent = "X";
          btnDisabled = true;
        }
        if (cell.shipIndex != null) {
          btnContent += ":S";
        }

        const btn = document.createElement("button");
        btn.textContent = btnContent;
        btn.dataset.coordinates = [i, j];
        // i+1,j+1  =>  10-j,i+1
        btn.style.gridArea = `${10 - j}/${i + 1}/${11 - j}/${i + 2}`;
        if (boardDisabled || btnDisabled) {
          btn.setAttribute("disabled", "");
        } else {
          btn.addEventListener("click", clickBoardHandler);
        }
        if (lastMove && lastMove[0] === i && lastMove[1] === j) {
          btn.classList.add("last-move");
        }
        boardDiv.appendChild(btn);
      }
    }
  };

  const arrangeBoard = (
    board,
    boardIndex,
    ships,
    rotateShipHandler,
    dropShipHandler,
  ) => {
    const boardDiv = document.querySelector(gameBoardSelectors[boardIndex]);
    boardDiv.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = board[i][j];
        const cellDiv = document.createElement("div");
        cellDiv.dataset.coordinates = [i, j];
        cellDiv.classList.add("arrange-board-div");
        if (cell.shipIndex !== null) {
          const shipDivClass = `ship${cell.shipIndex}-div`;
          let shipDiv = document.querySelector(`.${shipDivClass}`);
          cellDiv.dataset.shipIndex = cell.shipIndex;
          if (!shipDiv) {
            shipDiv = document.createElement("div");
            shipDiv.dataset.shipIndex = cell.shipIndex;
            shipDiv.classList.add(shipDivClass);
            const shipPalceCoordinates = ships[cell.shipIndex].placeCoordinates;
            // [[i1,j1],[i2,j2]] => 11-j1/i1+1/10-j2/i2+2
            shipDiv.style.gridArea = `${11 - shipPalceCoordinates[0][1]}/${shipPalceCoordinates[0][0] + 1}/${10 - shipPalceCoordinates[1][1]}/${shipPalceCoordinates[1][0] + 2}`;
            shipDiv.classList.add("arrange-board-ship");
            shipDiv.setAttribute("draggable", "true");
            shipDiv.addEventListener("click", rotateShipHandler);
            shipDiv.addEventListener("drag", (e) => {
              const target = e.target;
              console.log(target.dataset.shipIndex);
            });
            shipDiv.addEventListener("dragstart", (e) => {
              const target = e.target;
              target.classList.add("ship-dragging");
              // e.dataTransfer.setData();
            });
            shipDiv.addEventListener("dragend", (e) => {
              const target = e.target;
              target.classList.remove("ship-dragging");
            });
            shipDiv.appendChild(cellDiv);
            boardDiv.appendChild(shipDiv);
          } else {
            shipDiv.appendChild(cellDiv);
          }
        } else {
          cellDiv.style.gridArea = `${10 - j}/${i + 1}/${11 - j}/${i + 2}`;
          cellDiv.addEventListener("dragover", (e) => {
            e.preventDefault();
          });
          cellDiv.addEventListener("drop", dropShipHandler);
          boardDiv.appendChild(cellDiv);
        }
      }
    }
  };

  const updateTurnMsg = (player) => {
    const turnMsgdiv = document.querySelector(".turn-msg");
    let turnMsg = `轮到玩家${player.name}的回合了`;
    turnMsgdiv.textContent = turnMsg;
  };

  const autoClick = (coordinates) => {
    const btn = document.querySelector(
      `.gameBoardOne button:nth-of-type(${coordinates[0] * 10 + coordinates[1] + 1})`,
    );
    let clickEvent = new MouseEvent("click");
    btn.dispatchEvent(clickEvent);
  };

  const gameOver = (game) => {
    const turnMsgdiv = document.querySelector(".turn-msg");
    const gameOverMsg = `游戏结束，赢家为${game.getWinner().name}!`;
    turnMsgdiv.textContent = gameOverMsg;
    renderBoard(game.gameBoards[0], 0, null, true);
    renderBoard(game.gameBoards[1], 1, null, true);
  };

  const showNewGameBtn = (playAgain) => {
    const newGameBtn = document.querySelector(".new-game");
    newGameBtn.removeAttribute("hidden");
    newGameBtn.addEventListener("click", playAgain);
  };

  const hideNewGameBtn = () => {
    const newGameBtn = document.querySelector(".new-game");
    newGameBtn.setAttribute("hidden", "");
  };

  const placeCoordinatesRemark = (boardIndex) => {
    const leftRemarkDiv = document.querySelector(
      `${gameBoardSelectors[boardIndex]} + div`,
    );
    for (let i = 10; i > 0; i--) {
      const span = document.createElement("span");
      span.textContent = i;
      leftRemarkDiv.appendChild(span);
    }
    const rightRemarkDiv = document.querySelector(
      `${gameBoardSelectors[boardIndex]} + div +div`,
    );
    for (let i = 1; i <= 10; i++) {
      const span = document.createElement("span");
      span.textContent = i;
      rightRemarkDiv.appendChild(span);
    }
  };

  const showPlaceShipBtn = (placeShipHandler) => {
    const placeShipBtn = document.querySelector(".place-ship");
    placeShipBtn.addEventListener("click", placeShipHandler);
    placeShipBtn.removeAttribute("hidden");
  };

  const showStartGameBtn = (startGamehandler) => {
    const startGameBtn = document.querySelector(".start-game");
    startGameBtn.addEventListener("click", startGamehandler);
    startGameBtn.removeAttribute("hideen");
  };

  return {
    renderBoard,
    updateTurnMsg,
    gameOver,
    autoClick,
    showNewGameBtn,
    hideNewGameBtn,
    placeCoordinatesRemark,
    showPlaceShipBtn,
    showStartGameBtn,
    arrangeBoard,
  };
}
let domStuff = DomStuff();

export { domStuff };
