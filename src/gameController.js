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

  /* const printGameBoard = () => {
    console.log(`玩家${players[0].name}的棋盘：`);
    players[0].gameBoard.printBoard();
    console.log(`玩家${players[1].name}的棋盘：`);
    players[1].gameBoard.printBoard();
    console.log(`轮到玩家${getActivePlayer().name}的回合了！`);
  }; */

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
    // console.log(`${getActivePlayer().name}在${coordinates}执行攻击操作`);
    enemyGameBoard.receiveAttack(coordinates);
    getActivePlayer().lastMove = coordinates;
    let ifHitShip = false;
    if (
      enemyGameBoard.board[coordinates[0]][coordinates[1]].shipIndex !== null
    ) {
      ifHitShip = true;
    }
    if (enemyGameBoard.isAllSunk()) {
      gameOver(getActivePlayer());
    } else {
      if (!ifHitShip) {
        switchPlayer();
      }
      // printGameBoard();
      /* if (getActivePlayer().number === 2) {
        autoMove();
      } */
    }
  };

  const autoMove = () => {
    const move = smartMoveStrategy(getActivePlayer(), getOpponentPlayer());
    // playRound(move);
    return move;
  };

  const smartMoveStrategy = (player, opponentPlayer) => {
    const board = opponentPlayer.gameBoard.board;
    const lastMove = player.lastMove;
    // 处理上回合命中的棋
    if (lastMove && board[lastMove[0]][lastMove[1]].shipIndex !== null) {
      const lastHit = [lastMove[0], lastMove[1]];
      if (player.hittingShipCoor) {
        if (
          lastHit[0] < player.hittingShipCoor[0][0] ||
          lastHit[1] < player.hittingShipCoor[0][1]
        ) {
          player.hittingShipCoor.unshift(lastHit);
        } else {
          player.hittingShipCoor.push(lastHit);
        }
      } else {
        player.hittingShipCoor = [lastHit];
      }
    }

    const smartMove = [];
    let adjacentSlots = [];
    let hittingShipIndex;
    // 优先尝试相邻的格子
    if (player.hittingShipCoor) {
      const hittingShipCoor = player.hittingShipCoor;
      hittingShipIndex =
        board[hittingShipCoor[0][0]][hittingShipCoor[0][1]].shipIndex;
      if (hittingShipCoor.length === 1) {
        adjacentSlots.push([hittingShipCoor[0][0] - 1, hittingShipCoor[0][1]]);
        adjacentSlots.push([hittingShipCoor[0][0] + 1, hittingShipCoor[0][1]]);
        adjacentSlots.push([hittingShipCoor[0][0], hittingShipCoor[0][1] + 1]);
        adjacentSlots.push([hittingShipCoor[0][0], hittingShipCoor[0][1] - 1]);
      } else if (hittingShipCoor.length >= 2 && hittingShipCoor.length <= 3) {
        if (
          hittingShipCoor[0][0] < hittingShipCoor[hittingShipCoor.length - 1][0]
        ) {
          adjacentSlots.push([
            hittingShipCoor[0][0] - 1,
            hittingShipCoor[0][1],
          ]);
          adjacentSlots.push([
            hittingShipCoor[hittingShipCoor.length - 1][0] + 1,
            hittingShipCoor[hittingShipCoor.length - 1][1],
          ]);
        } else {
          adjacentSlots.push([
            hittingShipCoor[0][0],
            hittingShipCoor[0][1] - 1,
          ]);
          adjacentSlots.push([
            hittingShipCoor[hittingShipCoor.length - 1][0],
            hittingShipCoor[hittingShipCoor.length - 1][1] + 1,
          ]);
        }
      } else {
        player.hittingShipCoor = null;
      }
    }

    for (let slotIndex = 0; slotIndex < adjacentSlots.length; slotIndex++) {
      const slot = adjacentSlots[slotIndex];
      try {
        if (slot[0] < 0 || slot[0] > 9 || slot[1] < 0 || slot[1] > 9) {
          continue;
        }
        if (board[slot[0]][slot[1]].hitState !== null) {
          continue;
        }
        const moveValid = checkMoveValid(opponentPlayer, slot, [
          hittingShipIndex,
        ]);
        if (moveValid) {
          smartMove.push(slot[0]);
          smartMove.push(slot[1]);
          break;
        }
      } catch (error) {
        console.error(error);
      }
    }

    // 相邻的格子不可尝试，清除hittingShipCoor
    if (adjacentSlots.length > 0 && smartMove.length === 0) {
      player.hittingShipCoor = null;
    }

    // 随机尝试
    if (smartMove.length === 0) {
      const unhitBoard = opponentPlayer.gameBoard.unhitBoard();
      while (unhitBoard.length > 0) {
        const randomIndex = randomNumber(unhitBoard.length);
        const move = unhitBoard[randomIndex];
        if (checkMoveValid(opponentPlayer, move)) {
          smartMove.push(move[0]);
          smartMove.push(move[1]);
          break;
        } else {
          unhitBoard.splice(randomIndex, 1);
        }
      }
    }
    return smartMove;
  };

  const checkMoveValid = (player, move, excludeShipIndexs) => {
    const board = player.gameBoard.board;
    const surroundArea = player.gameBoard.getSurroundArea(move);
    let moveValid = true;
    outer: for (let i = surroundArea[0][0]; i <= surroundArea[1][0]; i++) {
      for (let j = surroundArea[0][1]; j < surroundArea[1][1]; j++) {
        if (board[i][j].hitState !== null && board[i][j].hitState === 1) {
          if (
            !excludeShipIndexs ||
            !excludeShipIndexs.includes(board[i][j].shipIndex)
          ) {
            moveValid = false;
            break outer;
          }
        }
      }
    }
    return moveValid;
  };

  const gameOver = (winner) => {
    /* console.log(`玩家${players[0].name}的棋盘：`);
    players[0].gameBoard.printBoard();
    console.log(`玩家${players[1].name}的棋盘：`);
    players[1].gameBoard.printBoard();
    console.log(`游戏结束，赢家为${winner.name}!`); */
    gameWinner = winner;
  };

  const playAgain = () => {
    players.forEach((player) => {
      player.reset();
    });
    curPlayer = players[0];
    gameWinner = null;
    // printGameBoard();
  };

  const haveShips = (gameBoardIndex) => {
    return players[gameBoardIndex].gameBoard.ships.length > 0;
  };

  const getShips = (gameBoardIndex) => {
    return players[gameBoardIndex].gameBoard.ships;
  };

  // printGameBoard();

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
