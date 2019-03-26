import React, { Component } from 'react';
import firebase from 'firebase';
import Firebase from '../Firebase/firebase';
import * as DB from '../Firebase/Firestore/DB';


class Matchmaking extends Component {
    constructor(){
        super()
        this.db = firebase.firestore()
    }
    state = {  }

    componentDidMount() {
        this.matchmaking();
    }

    async matchmaking(){
        var players = await this.checkForPlayers();
        console.log(players)
    }

    checkForPlayers(){

        return new Promise((resolve) => {
            this.db.collection(DB.MATCH).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.id, " => ", doc.data());
                    resolve(doc.data())
                })
            })
        })
    }

    docSubscription(docName){
            this.db.collection(DB.MATCH)
                .onSnapshot(function(doc){
                    return(doc.data())
                })
                 
    }

    render() { 
        return (  
            <div>asdf</div>
        );
    }
}
 
export default Matchmaking;