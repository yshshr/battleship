function DomStuff() {
  const renderBoard = (game, boardIndex, clickBoardHandler) => {
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
          btnContent = "*";
        } else {
          btnContent = "X";
        }

        const btn = document.createElement("button");
        btn.textContent = btnContent;
        btn.dataset.coordinates = [i, j];
        btn.addEventListener("click", clickBoardHandler);
        boardDiv.appendChild(btn);
      }
    }
  };

  const updateTurnMsg = (game) => {
    const turnMsgdiv = document.querySelector(".turn-msg");
    let turnMsg = `轮到玩家${game.getActivePlayer().name}的回合了`;
    turnMsgdiv.textContent = turnMsg;
  };

  const gameOver = (game) => {
    const turnMsgdiv = document.querySelector(".turn-msg");
    const gameOverMsg = `游戏结束，赢家为${game.getWinner().name}!`;
    turnMsgdiv.textContent = gameOverMsg;
  };
  return { renderBoard, updateTurnMsg, gameOver };
}
let domStuff = DomStuff();

export { domStuff };
