import React, { Component } from 'react';
import firebase from 'firebase';
import * as DB from '../Firebase/DB';
import MatchmakingClass from './MatchmakingClass';

/* This class searches throughout the Matchmaking collection for at least two non-matched
   players.  Once found it removes them from the Matchmaking collection and adds them to
   a newly created match within the Matches db. 
   
   TODO: Send the receipt to each of the players to inform them that the match has been
   created.  Also, move the Board creation information to this matchmaking server so that
   the player-side server does not have to do that.  */

class Matchmaking extends Component {
    constructor(){
        super()
        this.db = firebase.firestore()
        
        this.playerList = new MatchmakingClass()
        this.changeType = ''
        this.state = {
            newestPlayer: 'added',
            droppedPlayer: 'removed',
            newMatchPlayers: {
                p1:null,
                p2:null
            }
        }
    }
    state = {  }

    //Sets the subscription to the matchmaking database
    componentDidMount() {
        this.docSubscription()
    }

    //reruns the matchmaking method anytime there is an addition to the matchmaking db
    componentDidUpdate(){
        //gives the subscription time to run
        setTimeout(() => {
            this.matchmaking()
        }, 200);
    }

    //a subscription method used to add/remove players from the LFG queue
    docSubscription(){
        return new Promise((resolve) => 
            this.db.collection(DB.MATCHMAKING)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        var addedPlayer = change.doc.data().player
                        console.log("Player added to queue: ", addedPlayer)
                        this.setState({
                            newestPlayer: addedPlayer
                        })
                        resolve(this.playerList.addPlayerToList(addedPlayer,change.doc.id))
                    }
                    if (change.type === "modified") {
                        console.log("Modified Data shouldn't be happening?");
                    }
                    if (change.type === "removed") {
                        var docDroppedPlayer = change.doc.data().player
                        console.log("Player removed from queue: ", docDroppedPlayer);
                        this.setState({
                            droppedPlayer:docDroppedPlayer
                        })
                        resolve(this.playerList.removePlayerFromList(docDroppedPlayer))
                    }
                });
            })
        )
    }

    addToMatches(player1,player2){
        return new Promise((resolve) => 
            this.db.collection(DB.MATCHES).add({
                p1:player1,
                p2:player2
            }).then(function(){
                console.log('Match Made!',player1,player2)
                resolve()
            })
        )
    }

    removeFromMatchmakingList(player){
        this.db.collection(DB.MATCHMAKING).doc(player.id).delete().then(function(){
            console.log(player.player, "Has been placed into a match!")
        })
    }

    async matchmaking(){
        var players = this.playerList.getPlayersList()
        while(players.length>1){
            var frontOfQueue = players[0]
            var nextInLine = players[1];

            this.playerList.removePlayerFromList(frontOfQueue)
            this.playerList.removePlayerFromList(nextInLine)
            await this.removeFromMatchmakingList(frontOfQueue)
            await this.removeFromMatchmakingList(nextInLine)

            this.setState({
                newMatchPlayers:{
                    p1:frontOfQueue.player,
                    p2:nextInLine.player
                }
            })

            await this.addToMatches(frontOfQueue,nextInLine)
            players = this.playerList.getPlayersList()
        }
        
    }

    render() { 
        return (  
            <ul>
                <li>Newest Player: {this.state.newestPlayer}</li>
                <li>Last Dropped Player: {this.state.removedPlayer}</li>
                <ul>Newest Match:
                    <li>Player One: {this.state.newMatchPlayers.p1}</li>
                    <li>Player Two: {this.state.newMatchPlayers.p2}</li>
                </ul>
            </ul>
        );
    }
}
 
export default Matchmaking;