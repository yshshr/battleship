import { Player } from "./battleship.js";

function GameController() {
  const players = [new Player("real", 1), new Player("computer", 2)];
  let curPlayer = players[0];

  const switchPlayer = () => {
    curPlayer = curPlayer.number === 1 ? players[1] : players[0];
  };

  const getActivePlayer = () => {
    return curPlayer;
  };

  const getOpponentPlayer = () => {
    return getActivePlayer().number === 1 ? players[1] : players[0];
  };

  const printGameBoard = () => {
    console.log(`玩家${players[0].name}的棋盘：`);
    players[0].gameBoard.printBoard();
    console.log(`玩家${players[1].name}的棋盘：`);
    players[1].gameBoard.printBoard();
    console.log(`轮到玩家${getActivePlayer().name}的回合了！`);
  };

  const placeShips = () => {
    const shipLength = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    const autoShipPlayer = [0, 1];
    autoShipPlayer.forEach((playerIndex) => {
      const gameBoard = players[playerIndex].gameBoard;
      for (const length of shipLength) {
        let placeResult = false;
        while (!placeResult) {
          const coordinates = [randomNumber(10), randomNumber(10)];
          const direction = randomNumber(4);
          placeResult = gameBoard.placeShipWithCheckAndRes(
            coordinates,
            direction,
            length,
          );
        }
      }
    });
  };

  const randomNumber = (number) => {
    return Math.floor(Math.random() * number);
  };

  const playRound = (coordinates) => {
    const enemyGameBoard = getOpponentPlayer().gameBoard;
    console.log(`${getActivePlayer().name}在${coordinates}执行攻击操作`);
    enemyGameBoard.receiveAttack(coordinates);
    if (enemyGameBoard.isAllSunk()) {
      gameOver(getActivePlayer());
    } else {
      switchPlayer();
      printGameBoard();
      if (getActivePlayer().number === 2) {
        autoMove();
      }
    }
  };

  const autoMove = () => {
    const gameBoard = getActivePlayer().gameBoard;
    const unhitBoard = gameBoard.unhitBoard();
    const move = unhitBoard[randomNumber(unhitBoard.length)];
    playRound(move);
  };

  const gameOver = (winner) => {
    console.log(`玩家${players[0].name}的棋盘：`);
    players[0].gameBoard.printBoard();
    console.log(`玩家${players[1].name}的棋盘：`);
    players[1].gameBoard.printBoard();
    console.log(`游戏结束，赢家为${winner.name}!`);
  };

  placeShips();
  printGameBoard();

  return { playRound };
}

const game = GameController();

export { game };
