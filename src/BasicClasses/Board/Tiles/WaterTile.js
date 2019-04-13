import TileAbstract from './TileAbstract'

export default class WaterTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "blue";
        this.classType = 'Water';
        this.surrounding = {
            left:false,
            right:false,
            top:false,
            bottom:false
        }
    }

    setSurrounding(surrounding){
        this.surrounding = surrounding;
    }

}