import { game } from "./gameController.js";
import { domStuff } from "./domStuff.js";

function DisplayController() {
  const updateScreen = (lastMove) => {
    let boradOneDisabled = false;
    let boardTwoDisabled = false;
    let boardOneLastMove = null;
    let boardTwoLastMove = null;
    if (game.getActivePlayer().number === 1) {
      boradOneDisabled = true;
      boardOneLastMove = lastMove;
    } else {
      boardTwoDisabled = true;
      boardTwoLastMove = lastMove;
    }

    domStuff.renderBoard(
      game.gameBoards[0],
      0,
      clickBoardHandler,
      boradOneDisabled,
      boardOneLastMove,
    );
    domStuff.renderBoard(
      game.gameBoards[1],
      1,
      clickBoardHandler,
      boardTwoDisabled,
      boardTwoLastMove,
    );
    domStuff.updateTurnMsg(game.getActivePlayer());
  };

  const clickBoardHandler = (e) => {
    const target = e.target;
    if (target.dataset.coordinates) {
      console.log(
        `${game.getActivePlayer().name}点击了${target.dataset.coordinates}`,
      );
      let coordinates = target.dataset.coordinates.split(",");
      coordinates = coordinates.map((value) => Number(value));
      game.playRound(coordinates);
      if (game.getWinner()) {
        domStuff.gameOver(game);
        domStuff.showNewGameBtn(playAgain);
        return;
      }
      updateScreen(coordinates);
      if (game.getActivePlayer().number === 2) {
        const move = game.autoMove();
        setTimeout(() => {
          domStuff.autoClick(move);
        }, 800);
      }
    }
  };

  const playAgain = () => {
    game.playAgain();
    domStuff.renderBoard(game.gameBoards[0], 0, dragShipHandler, false);
    domStuff.renderBoard(game.gameBoards[1], 1, dragShipHandler, true);
    domStuff.hideNewGameBtn();
  };

  const dragShipHandler = (e) => {
    const target = e.target;
    console.log(target.classList);
  };

  const rotateShipHandler = (e) => {
    const target = e.target;
    const shipIndex = Number(target.dataset.shipIndex);
    const ship = game.getShips(0)[shipIndex];
    const shipStartCoordinates = ship.placeCoordinates[0];
    const shipEndCoordinates = ship.placeCoordinates[1];
    let newStartCoordinates;
    let newDirection;
    if (shipStartCoordinates[0] < shipEndCoordinates[0]) {
      newStartCoordinates = [
        shipStartCoordinates[0],
        shipStartCoordinates[1] - ship.length + 1,
      ];
      newDirection = 0;
    } else if (shipStartCoordinates[1] < shipEndCoordinates[1]) {
      newStartCoordinates = [shipEndCoordinates[0], shipEndCoordinates[1]];
      newDirection = 1;
    } else {
      return;
    }
    if (
      game.checkReplaceShip(0, shipIndex, newStartCoordinates, newDirection)
    ) {
      game.replaceShip(0, shipIndex, newStartCoordinates, newDirection);
      domStuff.arrangeBoard(
        game.gameBoards[0],
        0,
        game.getShips(0),
        rotateShipHandler,
        dropShipHandler,
      );
    }
  };

  const dropShipHandler = (e) => {
    e.preventDefault();
    const target = e.target;
    const data = e.dataTransfer.getData("text/plain");
    const shipIndex = Number(data);
    const shipPlaceCoordinates = game.getShips(0)[shipIndex].placeCoordinates;
    let shipDirection = 0;
    if (shipPlaceCoordinates[0][0] < shipPlaceCoordinates[1][0]) {
      shipDirection = 1;
    }
    const dropCoordinates = target.dataset.coordinates.split(",");
    dropCoordinates[0] = Number(dropCoordinates[0]);
    dropCoordinates[1] = Number(dropCoordinates[1]);
    console.log(dropCoordinates);
    if (game.checkReplaceShip(0, shipIndex, dropCoordinates, shipDirection)) {
      game.replaceShip(0, shipIndex, dropCoordinates, shipDirection);
      domStuff.arrangeBoard(
        game.gameBoards[0],
        0,
        game.getShips(0),
        rotateShipHandler,
        dropShipHandler,
      );
    }
  };

  const placeShipHandler = () => {
    game.placeShips([0]);
    domStuff.arrangeBoard(
      game.gameBoards[0],
      0,
      game.getShips(0),
      rotateShipHandler,
      dropShipHandler,
    );
  };

  const startGamehandler = () => {
    if (game.haveShips(0)) {
      game.placeShips([1]);
      updateScreen();
    }
  };

  const init = () => {
    // updateScreen();
    domStuff.arrangeBoard(
      game.gameBoards[0],
      0,
      game.getShips(0),
      rotateShipHandler,
      dropShipHandler,
    );
    domStuff.renderBoard(game.gameBoards[1], 1, dragShipHandler, true);
    domStuff.placeCoordinatesRemark(0);
    domStuff.placeCoordinatesRemark(1);
    domStuff.showPlaceShipBtn(placeShipHandler);
    domStuff.showStartGameBtn(startGamehandler);
  };

  init();
}

const displayController = DisplayController();

export { displayController };
