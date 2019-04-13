import BoardRNG from './BoardRNG';

/* Basic Class for Instantiating a new Board */
export default class BoardClass{

    constructor(boardID, size){
        this.boardID = boardID;
        this.size = size;
        this.units = [];
        this.tiles = [];

        this.initBoard();
    }

    initBoard(){
        //generates a board of random tiles out of the tileCollection array above
        var rng = new BoardRNG(this.size);        
        this.tiles = rng.BoardDecision();
        this.tiles = this.getSurroundingTiles(this.tiles)
    }

    //run at the end of the board rng to determine which sides next to water tiles are non-water
    getSurroundingTiles(board){
        for(var i = 0;i<board.length;i++){
            var tile = board[i]

            if(tile.getClassType() === "Water"){

                var surroundingOutput = [false,
                                         false,
                                         false,
                                         false]

                var surroundingX = [tile.getPosition().x-1, //left
                                    tile.getPosition().x+1, //right
                                    tile.getPosition().x,  //above
                                    tile.getPosition().x]  //below

                var surroundingY = [tile.getPosition().y, //left
                                    tile.getPosition().y, //right
                                    tile.getPosition().y-1,  //above
                                    tile.getPosition().y+1]  //below


                for(var j = 0;j<surroundingX.length;j++){
                    var tileTarget = board.filter(tile =>
                        tile.getPosition().x === surroundingX[j] && tile.getPosition().y === surroundingY[j] && tile.getClassType() !== "Water"
                    )[0]

                    if(tileTarget){
                        surroundingOutput[j] = true
                    }
                }
                board[i].setSurrounding(surroundingOutput)
            }
    
        }
        return board
    }

    //gets random index position of input
    getRandomTile(input){
        return Math.floor(Math.random()*input.length);
    }

    getBoardID(){
        return this.boardID;
    }

    setBoardID(input){
        this.boardID = input;
    }

    //Gets unit based on unitID
    getUnit(input){
        return this.units.find(x =>{
            return x.unitID === input;
        })
    }

    getUnits(){
        return this.units;
    }

    addUnit(input){
        this.units.push(input);
    }

    removeUnit(input){
        this.units.splice(this.units.indexOf(input),1);
    }

    clearUnits(){
        this.units = [];
    }

    getTiles(){
        return this.tiles;
    }

    addTile(input){
        this.tiles.push(input);
    }

    removeTile(input){
        this.tiles.splice(this.tiles.indexOf(input),1);
    }

    clearTiles(){
        this.tiles = [];
    }

}