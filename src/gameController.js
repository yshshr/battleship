import { Player } from "./battleship.js";

function GameController() {
  const players = [new Player("real", 1), new Player("computer", 2)];
  let curPlayer = players[0];
  let gameWinner = null;

  const switchPlayer = () => {
    curPlayer = curPlayer.number === 1 ? players[1] : players[0];
  };

  const getActivePlayer = () => {
    return curPlayer;
  };

  const getOpponentPlayer = () => {
    return getActivePlayer().number === 1 ? players[1] : players[0];
  };

  const getWinner = () => {
    return gameWinner;
  };

  const printGameBoard = () => {
    console.log(`玩家${players[0].name}的棋盘：`);
    players[0].gameBoard.printBoard();
    console.log(`玩家${players[1].name}的棋盘：`);
    players[1].gameBoard.printBoard();
    console.log(`轮到玩家${getActivePlayer().name}的回合了！`);
  };

  const getGameBoards = () => {
    return [players[0].gameBoard.board, players[1].gameBoard.board];
  };

  const placeShips = (autoShipPlayer) => {
    const shipLength = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    // const shipLength = [4, 1];
    // const autoShipPlayer = [0, 1];
    autoShipPlayer.forEach((playerIndex) => {
      const gameBoard = players[playerIndex].gameBoard;
      gameBoard.clear();
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

  const replaceShip = (playerIndex, shipIndex, coordinates, direction) => {
    const gameBoard = players[playerIndex].gameBoard;
    gameBoard.replaceShip(shipIndex, coordinates, direction);
  };

  const checkReplaceShip = (playerIndex, shipIndex, coordinates, direction) => {
    const gameBoard = players[playerIndex].gameBoard;
    const shipLength = gameBoard.ships[shipIndex].length;
    try {
      const shipArea = gameBoard.checkShipArea(
        coordinates,
        direction,
        shipLength,
      );
      for (let i = shipArea[0][0]; i <= shipArea[1][0]; i++) {
        for (let j = shipArea[0][1]; j <= shipArea[1][1]; j++) {
          if (
            gameBoard.board[i][j].shipIndex != null &&
            gameBoard.board[i][j].shipIndex !== shipIndex
          ) {
            return false;
          }
        }
      }
    } catch (error) {
      return false;
    }
    return true;
  };

  const randomNumber = (number) => {
    return Math.floor(Math.random() * number);
  };

  const playRound = (coordinates) => {
    const enemyGameBoard = getOpponentPlayer().gameBoard;
    if (enemyGameBoard.board[coordinates[0]][coordinates[1]].hitState != null) {
      throw new Error("invalid move");
    }
    console.log(`${getActivePlayer().name}在${coordinates}执行攻击操作`);
    enemyGameBoard.receiveAttack(coordinates);
    if (enemyGameBoard.isAllSunk()) {
      gameOver(getActivePlayer());
    } else {
      switchPlayer();
      printGameBoard();
      /* if (getActivePlayer().number === 2) {
        autoMove();
      } */
    }
  };

  const autoMove = () => {
    const gameBoard = getOpponentPlayer().gameBoard;
    const unhitBoard = gameBoard.unhitBoard();
    const move = unhitBoard[randomNumber(unhitBoard.length)];
    // playRound(move);
    return move;
  };

  const gameOver = (winner) => {
    console.log(`玩家${players[0].name}的棋盘：`);
    players[0].gameBoard.printBoard();
    console.log(`玩家${players[1].name}的棋盘：`);
    players[1].gameBoard.printBoard();
    console.log(`游戏结束，赢家为${winner.name}!`);
    gameWinner = winner;
  };

  const playAgain = () => {
    players.forEach((player) => {
      player.gameBoard.clear();
    });
    curPlayer = players[0];
    gameWinner = null;
    // placeShips();
    printGameBoard();
  };

  const haveShips = (gameBoardIndex) => {
    return players[gameBoardIndex].gameBoard.ships.length > 0;
  };

  const getShips = (gameBoardIndex) => {
    return players[gameBoardIndex].gameBoard.ships;
  };

  // placeShips();
  printGameBoard();

  return {
    playRound,
    gameBoards: getGameBoards(),
    getActivePlayer,
    getWinner,
    autoMove,
    playAgain,
    placeShips,
    haveShips,
    getShips,
    replaceShip,
    checkReplaceShip,
  };
}

const game = GameController();

export { game };
