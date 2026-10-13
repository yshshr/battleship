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
    let endCoordinates = this.#getEndCoordinates(
      coordinates,
      direction,
      length,
    );
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

  #getEndCoordinates(coordinates, direction, length) {
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
    return endCoordinates;
  }

  checkShipArea(coordinates, direction, length) {
    this.#checkCoordinates(coordinates);
    let endCoordinates = this.#getEndCoordinates(
      coordinates,
      direction,
      length,
    );
    this.#checkCoordinates(endCoordinates);
    let shipArea = [];
    if (
      endCoordinates[0] < coordinates[0] ||
      endCoordinates[1] < coordinates[1]
    ) {
      shipArea.push([endCoordinates[0] - 1, endCoordinates[1] - 1]);
      shipArea.push([coordinates[0] + 1, coordinates[1] + 1]);
    } else {
      shipArea.push([coordinates[0] - 1, coordinates[1] - 1]);
      shipArea.push([endCoordinates[0] + 1, endCoordinates[1] + 1]);
    }
    for (let i = 0; i < shipArea.length; i++) {
      for (let j = 0; j < shipArea[i].length; j++) {
        if (shipArea[i][j] < 0) {
          shipArea[i][j] = 0;
        } else if (shipArea[i][j] > 9) {
          shipArea[i][j] = 9;
        }
      }
    }
    return shipArea;
  }

  placeShipWithCheckAndRes(coordinates, direction, length) {
    try {
      let shipArea = this.checkShipArea(coordinates, direction, length);
      for (let i = shipArea[0][0]; i <= shipArea[1][0]; i++) {
        for (let j = shipArea[0][1]; j <= shipArea[1][1]; j++) {
          if (this.board[i][j].shipIndex != null) {
            return false;
          }
        }
      }
      this.placeShip(coordinates, direction, length);
    } catch (error) {
      return false;
    }
    return true;
  }

  receiveAttack(coordinates) {
    this.#checkCoordinates(coordinates);
    let hitState = this.board[coordinates[0]][coordinates[1]].hit();
    if (hitState === 1) {
      let shipIndex = this.board[coordinates[0]][coordinates[1]].shipIndex;
      this.ships[shipIndex].hit();
    }
  }

  isAllSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  printBoard() {
    const boardCellValues = this.board.map((row) => {
      return row.map((cell) => {
        return `${cell.hitState != null ? cell.hitState : "-"},${cell.shipIndex != null ? cell.shipIndex : "-"}`;
      });
    });
    console.log(boardCellValues);
  }
}

class Cell {
  constructor() {
    this.shipIndex = null;
    this.hitState = null;
  }

  place(shipIndex) {
    this.shipIndex = shipIndex;
  }

  hit() {
    this.hitState = this.shipIndex != null ? 1 : 0;
    return this.hitState;
  }
}

class Player {
  constructor(name, number) {
    this.name = name;
    this.number = number;
    this.gameBoard = new GameBoard();
  }
}

export { Ship, GameBoard, Player };
