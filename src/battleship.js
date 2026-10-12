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

  place(coordinates, endCoordinates) {
    this.placeCoordinates = [coordinates, endCoordinates];
  }
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

  placeShip(coordinates, direction, length) {
    this.#checkCoordinates(coordinates);
    let endCoordinates;
    if (direction % 2 === 0) {
      endCoordinates = [
        coordinates[0],
        coordinates[1] - (direction - 1) * (length - 1),
      ];
    } else {
      endCoordinates = [
        coordinates[0] - (direction - 2) * (length - 1),
        coordinates[1],
      ];
    }
    this.#checkCoordinates(endCoordinates);
    let ship = new Ship(length);
    this.ships.push(ship);
    const shipIndex = this.ships.length - 1;
    for (let i = 0; i < length; i++) {
      if (direction % 2 === 0) {
        this.board[coordinates[0]][coordinates[1] - (direction - 1) * i].place(
          shipIndex,
        );
      } else {
        this.board[coordinates[0] - (direction - 2) * i][coordinates[1]].place(
          shipIndex,
        );
      }
    }
    ship.place(coordinates, endCoordinates);
  }

  #checkCoordinates(coordinates) {
    if (coordinates[0] < 0 || coordinates[1] < 0) {
      throw new Error("coordinates must greater than or equal 0");
    }
    if (coordinates[0] >= 10 || coordinates[1] >= 10) {
      throw new Error("coordinates must less than 10");
    }
  }

  checkShipArea(coordinates, direction, length) {}

  receiveAttack(coordinates) {}

  isAllSunk() {}
}

class Cell {
  constructor() {
    this.shipIndex = null;
    this.hit = null;
  }

  place(shipIndex) {
    this.shipIndex = shipIndex;
  }

  hit() {}
}

class Player {
  constructor() {
    this.gameBoard = new GameBoard();
  }
}

export { Ship, GameBoard };
