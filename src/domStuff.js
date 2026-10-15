function DomStuff() {
  const renderBoard = (game, boardIndex, clickBoardHandler, boardDisabled) => {
    const gameBoardSelectors = [".gameBoardOne", ".gameBoardTwo"];
    const board = game.gameBoards[boardIndex];
    const boardDiv = document.querySelector(gameBoardSelectors[boardIndex]);
    boardDiv.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = board[i][j];
        let btnContent;
        if (cell.hitState === null) {
          btnContent = "-";
        } else if (cell.hitState === 0) {
          btnContent = "O";
        } else {
          btnContent = "X";
        }

        const btn = document.createElement("button");
        btn.textContent = btnContent;
        btn.dataset.coordinates = [i, j];
        if (boardDisabled) {
          btn.setAttribute("disabled", "");
        } else {
          btn.addEventListener("click", clickBoardHandler);
        }

        boardDiv.appendChild(btn);
      }
    }
  };

  const updateTurnMsg = (game) => {
    const turnMsgdiv = document.querySelector(".turn-msg");
    let turnMsg = `轮到玩家${game.getActivePlayer().name}的回合了`;
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
    renderBoard(game, 0, null, true);
    renderBoard(game, 1, null, true);
  };
  return { renderBoard, updateTurnMsg, gameOver, autoClick };
}
let domStuff = DomStuff();

export { domStuff };
