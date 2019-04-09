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
                ping:null
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