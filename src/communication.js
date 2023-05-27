
export class CommunicationInstance {
    constructor() {
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

    completed(success) {
        if(success)
            this.successFN.forEach(s=>s());
        else
            this.errorFN.forEach(s=>s());
    }
}

export class Communication {
    post(command, formData) {
        // Must return an object that accepts handlers on .success and .error
    }
}

export class APICommunication extends Communication {
    constructor(targetURL, domain) {
        super();
        this.domain = domain;
        this.targetURL = targetURL;
    }

    post(command, formData) {
        formData.append("domain", this.domain);
        formData.append("command", command);

        const fd = new FormData();
        formData.each((v,k) => fd.append(k,v));

        if(command === 'fetch') {
            return window.Skyline.API.get(this.targetURL+"?fetch&domain="+encodeURIComponent(this.domain));
        } else {
            return window.Skyline.API.post(this.targetURL, fd);
        }
    }
}

class WS_Instance {
    constructor() {
        this._success = [];
        this._error = [];
    }

    success(fn) {
        this._success.push(fn);
        return this;
    }

    succeeded(msg) {
        this._success.forEach(fn=>fn(msg));
        this._success = [];
    }

    failed(err) {
        this._error.forEach(fn=>fn(err));
        this._error = [];
    }

    error(fn) {
        this._error.push(fn);
        return this;
    }
}

export class WebSocketCommunication extends Communication {
    constructor(socketServerURL, domain) {
        super();
        this.domain = domain;
        this.ready = 0;

        this.stack = [];
        this.msg = {response:{}};

        this.socket = new WebSocket(socketServerURL, 'IKARUS_HOOK');
        this.socket.onmessage = m=>{this.ready=1;this.postMessage(JSON.parse( m.data ))};
        this.socket.onerror = m=>{this.ready=-1;this.visualizer.trigger('error', m)};
        this.socket.onopen = ()=>{
            this.ready = 1;
            this.socket.send("HOOK "+JSON.stringify([[], [], [], domain]));
            this.visualizer.trigger('fetch', {conn_stat:"WebSocket",conn_msg:"Verbindung läuft über "+socketServerURL+"."});
        }
        this.socket.onclose = ()=>{
            this.ready=-1;this.visualizer.trigger('error', {title:"WebSocket",message:"Die Verbindung zum Speicherregister wurde unterbrochen."});
        }
    }

    postMessage(msg) {
        this.msg = msg;
        if(msg.hasOwnProperty("D"))
            msg = msg.D;

        if(typeof msg === 'boolean') {
            const i = this.stack.shift();
            if(msg)
                i.succeeded(msg);
            else
                i.failed(msg);
        }
        else if(this.visualizer)
            this.visualizer.updateFromJSON(msg);
    }

    postError(err) {
        const i = this.stack.shift();
        if(i)
            i.failed(err);
    }

    pushStack(instance, delay) {
        this.stack.push(instance);
        window.setTimeout(() => {
            if(this.stack[0] === instance) {
                const i = this.stack.shift();
                console.warn('Anfrage ist abgelaufen.', instance);
            }
        }, delay);
    }

    post(command, formData) {
        if(this.ready===0) {
            const msg = this.msg;
            return {success(fn) {window.setTimeout(()=>fn(msg), 100); return this;},error(fn){return this;}};
        }
        if(this.ready===-1) {
            const msg = this.msg;
            return {success(fn) {return this;},error(fn){window.setTimeout(()=>fn({title:"Verbinden fehlgeschlagen:",message:"Ikarus SPS Speicherregister kann nicht erreicht werden."}), 100);return this;}};
        }

        let inst = undefined;

        switch (command) {
            case 'fetch':
                return {success(){return this;},error(){return this;}};
            default:
                inst = new WS_Instance();
                const data = {};
                formData.each((v,k)=>data[k]=v);
                command = command+" "+JSON.stringify(data);
                this.socket.send(command);
                this.pushStack(inst, 100);
        }
        return inst;
    }
}