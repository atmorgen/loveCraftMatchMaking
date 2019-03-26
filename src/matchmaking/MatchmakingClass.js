export default class Matchmaking{
    constructor(){
        this.playersList = []
    }

    getPlayersList(){
        return this.playersList
    }

    addPlayerToList(p,i){
        this.playersList.push(
            {
                player:p,
                id:i
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