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
    expect(() => gameBoard.placeShip([-1, 2], 1, 4)).toThrow();
    expect(() => gameBoard.placeShip([2, 12], 1, 4)).toThrow();
  });

  test("too large for right", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([7, 2], 1, 4)).toThrow();
  });

  test("too large for bottom", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([3, 1], 2, 3)).toThrow();
  });

  test("too large for left", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([0, 6], 3, 2)).toThrow();
  });

  test("too large for top", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip([6, 8], 0, 3)).toThrow();
  });
});

describe.only("checkShipArea", () => {
  test.only("normal", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([5, 5], 1, 3);
    expect(result).toEqual([4, 4], [8, 6]);
  });

  test("normal vertical", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([6, 6], 2, 3);
    expect(result).toEqual([5, 3], [7, 7]);
  });

  test("out board", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.checkShipArea([-1, 6], 2, 3)).toThrow();
    expect(() => gameBoard.checkShipArea([1, 10], 2, 3)).toThrow();
  });

  test("side", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([5, 0], 1, 4);
    expect(result).toEqual([4, 0], [9, 1]);
  });

  test("right side,too large", () => {
    let gameBoard = new GameBoard();
    expect(gameBoard.checkShipArea([9, 6], 2, 3)).toEqual([8, 3], [9, 7]);
    expect(() => gameBoard.checkShipArea([9, 1], 2, 3)).toThrow();
  });

  test("top side,too large", () => {
    let gameBoard = new GameBoard();
    expect(gameBoard.checkShipArea([6, 9], 3, 4)).toEqual([2, 8], [7, 9]);
    expect(() => gameBoard.checkShipArea([2, 9], 3, 4)).toThrow();
  });

  test("left side", () => {
    let gameBoard = new GameBoard();
    let result = gameBoard.checkShipArea([0, 5], 0, 4);
    expect(result).toEqual([0, 4], [1, 9]);
  });
});

describe("receiveAttack", () => {
  test("missed shot", () => {
    let gameBoard = new GameBoard();
    gameBoard.receiveAttack([6, 8]);
    expect(gameBoard.board[6][8].hit).toBe(0);
  });

  test("hit", () => {
    let gameBoard = new GameBoard();
    let ships = gameBoard.ships;
    ships.push(new Ship(1));
    gameBoard[5][4].place(0);
    gameBoard.receiveAttack([5, 4]);
    expect(gameBoard.board[5][4].hit).toBe(1);
    expect(ships[0].isSunk()).toBe(true);
  });

  test("out board", () => {
    let gameBoard = new GameBoard();
    expect(() => gameBoard.receiveAttack([-1, 8])).toThrow();
    expect(() => gameBoard.receiveAttack([6, 11])).toThrow();
  });
});
