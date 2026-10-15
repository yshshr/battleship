import { game } from "./gameController.js";
import { domStuff } from "./domStuff.js";

function DisplayController() {
  const updateScreen = () => {
    let boradOneDisabled = false;
    let boardTwoDisabled = false;
    if (game.getActivePlayer().number === 1) {
      boradOneDisabled = true;
    } else {
      boardTwoDisabled = true;
    }
    domStuff.renderBoard(game, 0, clickBoardHandler, boradOneDisabled);
    domStuff.renderBoard(game, 1, clickBoardHandler, boardTwoDisabled);
    domStuff.updateTurnMsg(game);
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
        return;
      }
      updateScreen();
      if (game.getActivePlayer().number === 2) {
        const move = game.autoMove();
        setTimeout(() => {
          domStuff.autoClick(move);
        }, 800);
      }
    }
  };

  updateScreen();
}

const displayController = DisplayController();

export { displayController };
