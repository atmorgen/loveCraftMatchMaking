import UpkeepClass from './phases/UpkeepClass';
import MovementPhaseClass from './phases/MovementPhaseClass';
import TurnResolution from './phases/TurnResolution';

export default class MatchClass{

    constructor(){
        this.phase = null
        this.phases = [
            new UpkeepClass(),
            new MovementPhaseClass(),
            new TurnResolution()
        ]
        this.phaseCount = 0;
    }

    getPhase(){
        return this.phase
    }

    moveToNextPhase(){
        this.phase = this.phases[(this.phaseCount++)%3]
        console.log(this.getPhase())
    }




}