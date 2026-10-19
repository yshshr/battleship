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
  };

  const placeShipHandler = () => {
    game.placeShips([0]);
    domStuff.renderBoard(game.gameBoards[0], 0, dragShipHandler, false);
  };

  const startGamehandler = () => {
    if (game.haveShips(0)) {
      game.placeShips([1]);
      updateScreen();
    }
  };

  const init = () => {
    // updateScreen();
    domStuff.renderBoard(game.gameBoards[0], 0, dragShipHandler, false);
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
