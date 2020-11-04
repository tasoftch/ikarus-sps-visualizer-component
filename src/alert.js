
export class Alert {
    constructor(id, code, brick, message, date, level) {
        if(typeof id !== 'string') {
            [code, brick, message, date, level] = [id.code, id.brick, id.message, id.date, id.level];
            id = id.uid;
        }
        this.uid = id;
        this.code = code;
        this.brick = brick;
        this.message = message;
        this.date = date;
        this.level = level;
        this.quitCallback = undefined;
    }
}