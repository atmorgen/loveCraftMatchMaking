import React, { Component } from 'react';
import firebase from 'firebase'
import * as DB from '../Firebase/DB'

//for creating a submission to the TurnResolution
import Submission from './submission'
import TurnResolution from './phases/TurnResolution'

/* This Class is responsible for subscribing to match changes and for preparing the data to push the the TurnResolution.js file for turn resolution */

class Matches extends Component {

    constructor(){
        super()
        this.db = firebase.firestore()
    }

    componentDidMount() {
        this.matchesSubscription()
    }

    matchesSubscription(){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES)
                .onSnapshot((snapshot)=>{
                        snapshot.docChanges().forEach((change)=>{
                            if(change.type === "modified"){
                                var matchData = change.doc.data()
                                resolve(this.checkForSubmissionUpdate(matchData,change.doc.id))
                            }
                        })
                })
        })
    }

    checkForSubmissionUpdate(matchData,id){
        
        var turnSubmission = matchData.turnSubmission
        //if both players have submitted a turn
        if(turnSubmission.length === 2){
            var player1Sub = JSON.parse(turnSubmission[0])
            var player2Sub = JSON.parse(turnSubmission[1])
            var turnResolution = new TurnResolution(id)
            
            console.log('Found a turn submission for match:',id,'between',player1Sub.uid,'and',player2Sub.uid)
            turnResolution.turnResolution(new Submission(player1Sub,player2Sub))
        }
    }

    render() { 
        return (  
            <React.Fragment>
                <div>Matches Info</div>
            </React.Fragment>
        );
    }
}
 
export default Matches;