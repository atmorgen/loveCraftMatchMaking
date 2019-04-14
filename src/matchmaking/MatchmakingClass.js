export default class Matchmaking{
    constructor(){
        this.playersList = []
    }

    getPlayersList(){
        return this.playersList.filter(id => id.qID!=='holder')
    }

    addPlayerToList(p,i,queueID){
        this.playersList.push(
            {
                player:p,
                id:i,
                qID:queueID,
                ping:null,
                resources:{
                    Food:10,
                    Gold:0,
                    Wood:0,
                    Metal:0
                }
            }
        )
    }

    removePlayerFromList(input){
        this.playersList.splice(this.playersList.indexOf(input),1)
    }

    clearList(){
        this.playersList = []
    }
}