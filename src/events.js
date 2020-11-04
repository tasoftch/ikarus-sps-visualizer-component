import { Events } from './core/events'

export class VisualEvents extends Events {
    constructor() {
        super({
            beforeupdate: [],
            afterupdate: [],

            updatestatus: [],

            removealert: [],
            createalert: [],
            quitalert:[],

            sendcontrol:[],
            sentcontrol:[],

            sendcommand: [],
            sentcommand: [],

            sendvalue:[],
            sentvalue:[],

            callprocedure: [],
            procedurecalled: []
        });
    }
}
