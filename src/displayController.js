import { game } from "./gameController.js";
import { domStuff } from "./domStuff.js";

function DisplayController() {
  const updateScreen = () => {
    domStuff.renderBoard(game, 0, clickBoardHandler);
    domStuff.renderBoard(game, 1, clickBoardHandler);
    domStuff.updateTurnMsg(game);
  };

  const clickBoardHandler = (e) => {
    const target = e.target;
    if (target.dataset.coordinates) {
      let coordinates = target.dataset.coordinates.split(",");
      coordinates = coordinates.map((value) => Number(value));
      game.playRound(coordinates);
      updateScreen();
      if (game.getWinner()) {
        domStuff.gameOver(game);
      }
      if (game.getActivePlayer().number === 2) {
        game.autoMove();
      }
    }
  };

  updateScreen();
}

const displayController = DisplayController();

export { displayController };
