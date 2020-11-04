
export class Communication {
    constructor() {
        this.successFN = [];
        this.errorFN = [];
    }
    post(command, formData) {
        this.errorFN = [];
        this.successFN = [];
    }
    success(fn) {
        this.successFN.push(fn);
        return this;
    }
    error(fn) {
        this.errorFN.push(fn);
    }

    _trigger(callbacks, ...args) {
        callbacks.forEach(d=>{
            d(...args);
        })
    }
}

const API = window.Skyline.API;

export class APICommunication extends Communication {
    constructor(targetURL, domain) {
        super();
        this.domain = domain;
        this.targetURL = targetURL;
    }

    post(command, formData) {
        formData.append("domain", this.domain);
        formData.append("command", command);
        return API.post(this.targetURL, formData)
    }
}