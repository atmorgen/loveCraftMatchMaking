import React, { Component } from 'react';
import firebase from 'firebase';
import * as DB from '../Firebase/DB';
import MatchmakingClass from './MatchmakingClass';
import BoardClass from '../BasicClasses/Board/BoardClass';
import Matches from '../matches/matches';

/* This class searches throughout the Matchmaking collection for at least two non-matched
   players.  Once found it removes them from the Matchmaking collection and adds them to
   a newly created match within the Matches db.  */

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
        this.matchmakingSubscription()
    }

    //reruns the matchmaking method anytime there is an addition to the matchmaking db
    componentDidUpdate(){
        //gives the subscription time to run
        setTimeout(() => {
            this.matchmaking()
        }, 200);
    }

    //a subscription method used to add/remove players from the LFG queue
    matchmakingSubscription(){
        return new Promise((resolve) => 
            this.db.collection(DB.MATCHMAKING)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        var addedPlayer = change.doc.data().player
                        var addedPlayerID = change.doc.data().id
                        console.log("Player added to queue: ", addedPlayer)
                        this.setState({
                            newestPlayer: addedPlayer
                        })
                        resolve(this.playerList.addPlayerToList(addedPlayer,addedPlayerID,change.doc.id))
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

    addToMatches(player1,player2,generatedMap){
        return new Promise((resolve) => 
            this.db.collection(DB.MATCHES).doc(generatedMap.boardID).set({
                p1:player1,
                p2:player2,
                board:{
                    size:generatedMap.size,
                    tiles:JSON.stringify(generatedMap.tiles),
                    units:JSON.stringify(generatedMap.units)
                },
                turnSubmission:{
                    p1:null,
                    p2:null
                },
                host:null
            }).then(function(){
                console.log('Match Made!',player1,player2)
                resolve()
            })
        )
    }

    addMatchToUser(uid,matchID){
        console.log(uid,"Added to:",matchID)
        return new Promise((resolve)=>{
            this.db.collection(DB.USERS).doc(uid).update({
                match:matchID
            })
            resolve()
        })
    }

    removeFromMatchmakingList(player){
        this.db.collection(DB.MATCHMAKING).doc(player.qID).delete().then(function(){
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
            var generatedBoard = this.generateBoard()
            console.log(generatedBoard)
            await this.addToMatches(frontOfQueue,nextInLine,generatedBoard)
            await this.addMatchToUser(frontOfQueue.id,generatedBoard.boardID)
            await this.addMatchToUser(nextInLine.id,generatedBoard.boardID)
            players = this.playerList.getPlayersList()
        }  
    }

    generateBoard(){
        return new BoardClass(this.getRandomID(),20)
    }

    getRandomID(){
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    render() { 
        return (
            <React.Fragment> 
                <ul>
                    <li>Newest Player: {this.state.newestPlayer}</li>
                    <li>Last Dropped Player: {this.state.removedPlayer}</li>
                    <ul>Newest Match:
                        <li>Player One: {this.state.newMatchPlayers.p1}</li>
                        <li>Player Two: {this.state.newMatchPlayers.p2}</li>
                    </ul>
                </ul>
                <Matches />
            </React.Fragment>
        );
    }
}
 
export default Matchmaking;