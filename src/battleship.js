class Ship {
  constructor(length) {
    this.length = length;
    this.hitNum = 0;
    this.sunk = false;
  }

  hit() {
    this.hitNum++;
    if (this.hitNum >= this.length) {
      this.sunk = true;
    }
  }

  isSunk() {
    return this.sunk;
  }

  place(coordinates, direction) {}
}

class GameBoard {
  constructor() {
    this.ships = [];
    this.#init();
  }

  #init() {
    this.board = [];
    for (let i = 1; i <= 10; i++) {
      let rowBoard = [];
      for (let j = 1; j <= 10; j++) {
        rowBoard.push(new Cell());
      }
      this.board.push(rowBoard);
    }
  }

  placeShip(coordinates, direction, length) {}

  checkShipArea(coordinates, direction, length) {}

  receiveAttack(coordinates) {}

  isAllSunk() {}
}

class Cell {
  constructor() {
    this.shipIndex = null;
    this.hit = null;
  }

  place(shipIndex) {}

  hit() {}
}

class Player {
  constructor() {
    this.gameBoard = new GameBoard();
  }
}

export { Ship, GameBoard };
