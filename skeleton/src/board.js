// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  return Array.from({length: 8}, () => new Array(8).fill(undefined))
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
  this.grid[3][4] = new Piece("black");
  this.grid[4][4] = new Piece("white");
  this.grid[4][3] = new Piece("black");
  this.grid[3][3] = new Piece("white");
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

Board.prototype.atPos = function(pos) {
  return this.grid[pos[0]][pos[1]];
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if ((pos[0] >= 0 && pos[0] < 8) && (pos[1] >= 0 && pos[1] < 8)){
    return true;
  } else {
    return false;
  };
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)){
    return this.atPos(pos);
  } else {
    throw new Error('Not valid pos!');
  };
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if(!this.atPos(pos)){
    return false;
  } else {
    return this.getPiece(pos).color === color;
  };
  
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return (this.atPos(pos) instanceof Piece);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){

  if (piecesToFlip === undefined) {
    piecesToFlip = [];
  }

  let nextPos = this.nextPos(pos, dir);

  // end if current pos is not valid
  if (!this.isValidPos(nextPos)) {
    return [];
  // 
  } else if(!this.isOccupied(nextPos)) {
    return [];
  // takes care of landing on your own color (ends)
  } else if (this.isMine(nextPos, color)) {
      return piecesToFlip;
  // takes care of landing on an empty space (ends it)
  } else {
    piecesToFlip.push(nextPos);
    return this._positionsToFlip(nextPos, color, dir, piecesToFlip);
  };
};
  
Board.prototype.nextPos = function (pos, dir) {
  return [(pos[0] + dir[0]),(pos[1] + dir[1])];
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  let valid = false;
  
  if (this.isOccupied(pos)){
    return valid;
  } else {
    Board.DIRS.forEach(element => {
      let flippy = this._positionsToFlip(pos, color, element)
      if (flippy.length > 0){
        valid = true;
        return valid;
      };
    });
    return valid;
  };
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  let that = this;
  if (this.validMove(pos, color)){
    this.grid[pos[0]][pos[1]] = new Piece(color);
    Board.DIRS.forEach(element => {
      let flippings = that._positionsToFlip(pos, color, element);
      flippings.forEach(element => {
        this.getPiece(element).flip();
      });
    });
  } else {
    throw new Error("Invalid move!");
  };
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {

  let moves = [];

  for (let row = 0; row < this.grid.length; row++) {
    for (let col = 0; col < this.grid.length; col++) {
      if (this.validMove([row,col], color)){
        moves.push([row,col]);
      };
    };
  };

  return moves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return (this.validMoves(color).length > 0);
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!this.hasMove("black") && !this.hasMove("white"));
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for (let row = 0; row < this.grid.length; row++) {
    let rowString = ""
    for (let col = 0; col < this.grid.length; col++) {
      
      let piece = this.atPos([row,col]);

      if (!piece) {
        rowString += " _ ";
      } else {
        rowString += ` ${piece.toString()} `;
      };
    };
    console.log(rowString);
  };
  
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE