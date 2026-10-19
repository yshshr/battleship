import { Ship, GameBoard } from "./battleship.js";

describe("Ship hit", () => {
  test("one hit", () => {
    let ship = new Ship(1);
    ship.hit();
    expect(ship.hitNum).toBe(1);
    expect(ship.isSunk()).toBe(true);
  });

  test("multihit", () => {
    let ship = new Ship(2);
    ship.hit();
    expect(ship.hitNum).toBe(1);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.hitNum).toBe(2);
    expect(ship.isSunk()).toBe(true);
  });
});

describe("placeShip", () => {
  test("normal placeship", () => {
    let gameBoard = new GameBoard();
    gameBoard.placeShip([5, 5], 0, 3);
    let shipsLength = gameBoard.ships.length;
    expect(gameBoard.board[5][5].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[5][6].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[5][7].shipIndex).toBe(shipsLength - 1);
    let newShip = gameBoard.ships[shipsLength - 1];
    expect(newShip.placeCoordinates).toEqual([
      [5, 5],
      [5, 7],
    ]);
  });

  test("side horizontal place", () => {
    let gameBoard = new GameBoard();
    gameBoard.placeShip([5, 0], 1, 4);
    let shipsLength = gameBoard.ships.length;
    expect(gameBoard.board[5][0].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[6][0].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[7][0].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[8][0].shipIndex).toBe(shipsLength - 1);
    let newShip = gameBoard.ships[shipsLength - 1];
    expect(newShip.placeCoordinates).toEqual([
      [5, 0],
      [8, 0],
    ]);
  });

  test("dierection 2", () => {
    let gameBoard = new GameBoard();
    gameBoard.placeShip([5, 6], 2, 3);
    let shipsLength = gameBoard.ships.length;
    expect(gameBoard.board[5][6].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[5][5].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[5][4].shipIndex).toBe(shipsLength - 1);
    let newShip = gameBoard.ships[shipsLength - 1];
    expect(newShip.placeCoordinates).toEqual([
      [5, 4],
      [5, 6],
    ]);
  });

  test("direction 3", () => {
    let gameBoard = new GameBoard();
    gameBoard.placeShip([6, 8], 3, 3);
    let shipsLength = gameBoard.ships.length;
    expect(gameBoard.board[6][8].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[5][8].shipIndex).toBe(shipsLength - 1);
    expect(gameBoard.board[4][8].shipIndex).toBe(shipsLength - 1);
    let newShip = gameBoard.ships[shipsLength - 1];
    expect(newShip.placeCoordinates).toEqual([
      [4, 8],
      [6, 8],
    ]);
  });

  test("short ship", () => {
    let gameBoard = new GameBoard();
    gameBoard.placeShip([5, 6], 3, 1);
    let shipsLength = gameBoard.ships.length;
    expect(gameBoard.board[5][6].shipIndex).toBe(shipsLength - 1);
    let newShip = gameBoard.ships[shipsLength - 1];
    expect(newShip.placeCoordinates).toEqual([
      [5, 6],
      [5, 6],
    ]);
  });

  test("out board", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([-1, 2], 1, 4)).toThrow(
      "coordinates must greater than or equal 0",
    );
    expect(() => gameBoard.placeShip([2, 12], 1, 4)).toThrow(
      "coordinates must less than 10",
    );
  });

  test("too large for right", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([7, 2], 1, 4)).toThrow(
      "coordinates must less than 10",
    );
  });

  test("too large for bottom", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([3, 1], 2, 3)).toThrow(
      "coordinates must greater than or equal 0",
    );
  });

  test("too large for left", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([0, 6], 3, 2)).toThrow(
      "coordinates must greater than or equal 0",
    );
  });

  test("too large for top", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([6, 8], 0, 3)).toThrow(
      "coordinates must less than 10",
    );
  });
});

describe("replaceShip", () => {
  describe("origin horizontal", () => {
    let gameBoard;
    beforeEach(() => {
      gameBoard = new GameBoard();
      let newShip = new Ship(3);
      newShip.place([5, 6], [7, 6]);
      gameBoard.ships.push(newShip);
      gameBoard.board[5][6].place(0);
      gameBoard.board[6][6].place(0);
      gameBoard.board[7][6].place(0);
    });

    test("normal", () => {
      gameBoard.replaceShip(0, [6, 8], 1);
      expect(gameBoard.board[6][8].shipIndex).toBe(0);
      expect(gameBoard.board[7][8].shipIndex).toBe(0);
      expect(gameBoard.board[8][8].shipIndex).toBe(0);
      expect(gameBoard.board[5][6].shipIndex).toBeNull();
      expect(gameBoard.board[6][6].shipIndex).toBeNull();
      expect(gameBoard.board[7][6].shipIndex).toBeNull();
      expect(gameBoard.ships[0].placeCoordinates).toEqual([
        [6, 8],
        [8, 8],
      ]);
    });

    test("horizontal to vertical", () => {
      gameBoard.replaceShip(0, [5, 4], 0);
      expect(gameBoard.board[5][6].shipIndex).toBe(0);
      expect(gameBoard.board[5][5].shipIndex).toBe(0);
      expect(gameBoard.board[5][4].shipIndex).toBe(0);
      expect(gameBoard.board[6][6].shipIndex).toBeNull();
      expect(gameBoard.board[7][6].shipIndex).toBeNull();
      expect(gameBoard.ships[0].placeCoordinates).toEqual([
        [5, 4],
        [5, 6],
      ]);
    });

    test("out board", () => {
      expect(() => gameBoard.replaceShip(0, [-1, 4], 0)).toThrow(
        "coordinates must greater than or equal 0",
      );
      expect(() => gameBoard.replaceShip(0, [10, 4], 0)).toThrow("c");
    });

    test("too large for right", () => {
      expect(() => gameBoard.replaceShip(0, [8, 8], 1)).toThrow(
        "coordinates must less than 10",
      );
    });
  });

  describe("origin vertical", () => {
    let gameBoard;
    beforeEach(() => {
      gameBoard = new GameBoard();
      let newShip = new Ship(3);
      newShip.place([5, 6], [5, 8]);
      gameBoard.ships.push(newShip);
      gameBoard.board[5][6].place(0);
      gameBoard.board[5][7].place(0);
      gameBoard.board[5][8].place(0);
    });

    test("normal", () => {
      gameBoard.replaceShip(0, [8, 6], 0);
      expect(gameBoard.board[8][6].shipIndex).toBe(0);
      expect(gameBoard.board[8][7].shipIndex).toBe(0);
      expect(gameBoard.board[8][8].shipIndex).toBe(0);
      expect(gameBoard.board[5][6].shipIndex).toBeNull();
      expect(gameBoard.board[5][7].shipIndex).toBeNull();
      expect(gameBoard.board[5][8].shipIndex).toBeNull();
      expect(gameBoard.ships[0].placeCoordinates).toEqual([
        [8, 6],
        [8, 8],
      ]);
    });

    test("vertical to horizontal", () => {
      gameBoard.replaceShip(0, [5, 8], 1);
      expect(gameBoard.board[5][8].shipIndex).toBe(0);
      expect(gameBoard.board[6][8].shipIndex).toBe(0);
      expect(gameBoard.board[7][8].shipIndex).toBe(0);
      expect(gameBoard.board[5][7].shipIndex).toBeNull();
      expect(gameBoard.board[5][6].shipIndex).toBeNull();
      expect(gameBoard.ships[0].placeCoordinates).toEqual([
        [5, 8],
        [7, 8],
      ]);
    });

    test("too large for top", () => {
      expect(() => gameBoard.replaceShip(0, [5, 8], 0)).toThrow(
        "coordinates must less than 10",
      );
    });
  });
});

describe("checkShipArea", () => {
  test("normal", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([5, 5], 1, 3);
    expect(result).toEqual([
      [4, 4],
      [8, 6],
    ]);
  });

  test("normal vertical", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([6, 6], 2, 3);
    expect(result).toEqual([
      [5, 3],
      [7, 7],
    ]);
  });

  test("out board", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.checkShipArea([-1, 6], 2, 3)).toThrow(
      "coordinates must greater than or equal 0",
    );
    expect(() => gameBoard.checkShipArea([1, 10], 2, 3)).toThrow(
      "coordinates must less than 10",
    );
  });

  test("side", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([5, 0], 1, 4);
    expect(result).toEqual([
      [4, 0],
      [9, 1],
    ]);
  });

  test("right side,too large", () => {
    let gameBoard = new GameBoard();
    expect(gameBoard.checkShipArea([9, 6], 2, 3)).toEqual([
      [8, 3],
      [9, 7],
    ]);
    expect(() => gameBoard.checkShipArea([9, 1], 2, 3)).toThrow(
      "coordinates must greater than or equal 0",
    );
  });

  test("top side,too large", () => {
    let gameBoard = new GameBoard();
    expect(gameBoard.checkShipArea([6, 9], 3, 4)).toEqual([
      [2, 8],
      [7, 9],
    ]);
    expect(() => gameBoard.checkShipArea([2, 9], 3, 4)).toThrow(
      "coordinates must greater than or equal 0",
    );
  });

  test("left side", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([0, 5], 0, 4);
    expect(result).toEqual([
      [0, 4],
      [1, 9],
    ]);
  });
});

describe("receiveAttack", () => {
  test("missed shot", () => {
    let gameBoard = new GameBoard();
    gameBoard.receiveAttack([6, 8]);
    expect(gameBoard.board[6][8].hitState).toBe(0);
  });

  test("hit", () => {
    let gameBoard = new GameBoard();
    let ships = gameBoard.ships;
    ships.push(new Ship(1));
    gameBoard.board[5][4].place(0);
    gameBoard.receiveAttack([5, 4]);
    expect(gameBoard.board[5][4].hitState).toBe(1);
    expect(ships[0].isSunk()).toBe(true);
  });

  test("out board", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.receiveAttack([-1, 8])).toThrow(
      "coordinates must greater than or equal 0",
    );
    expect(() => gameBoard.receiveAttack([6, 11])).toThrow(
      "coordinates must less than 10",
    );
  });
});

describe("getSurroundArea", () => {
  let gameBoard;
  beforeAll(() => {
    gameBoard = new GameBoard();
  });
  test("normal", () => {
    expect(gameBoard.getSurroundArea([5, 6])).toEqual([
      [4, 5],
      [6, 7],
    ]);
  });

  test("top side and corner", () => {
    expect(gameBoard.getSurroundArea([6, 9])).toEqual([
      [5, 8],
      [7, 9],
    ]);
    expect(gameBoard.getSurroundArea([0, 9])).toEqual([
      [0, 8],
      [1, 9],
    ]);
  });

  test("left side and corner", () => {
    expect(gameBoard.getSurroundArea([0, 6])).toEqual([
      [0, 5],
      [1, 7],
    ]);
    expect(gameBoard.getSurroundArea([0, 0])).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  test("right side and corner", () => {
    expect(gameBoard.getSurroundArea([9, 5])).toEqual([
      [8, 4],
      [9, 6],
    ]);
    expect(gameBoard.getSurroundArea([9, 9])).toEqual([
      [8, 8],
      [9, 9],
    ]);
  });

  test("bottom side and corner", () => {
    expect(gameBoard.getSurroundArea([3, 0])).toEqual([
      [2, 0],
      [4, 1],
    ]);
    expect(gameBoard.getSurroundArea([9, 0])).toEqual([
      [8, 0],
      [9, 1],
    ]);
  });

  test("out board", () => {
    expect(() => gameBoard.getSurroundArea([-1, 6])).toThrow(
      "coordinates must greater than or equal 0",
    );
    expect(() => gameBoard.getSurroundArea([5, 10])).toThrow(
      "coordinates must less than 10",
    );
  });
});
