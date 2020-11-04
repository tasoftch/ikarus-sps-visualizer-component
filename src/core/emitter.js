
export class Emitter {
    constructor(events) {
        this.events = events instanceof Emitter ? events.events : events.handlers;
    }

    on(names, handler) {
        const events = typeof names === 'string' ? names.split(' ') : names;
        events.forEach(name=>{
            if (!this.events[name])
                throw new Error(`The event ${name} does not exist`);
            this.events[name].push(handler);
        });
        return this;
    }

    trigger(name, params) {
        if (!(name in this.events))
            throw new Error(`The event ${name} cannot be triggered`);
        let result = true;
        let self = this;
        this.events[name].forEach(fn=>{
            if(typeof fn ==='function') {
                result = fn.call(self, params) && result;
            }
        });
        return result;
    }

    bind(name) {
        if (this.events[name])
            throw new Error(`The event ${name} is already bound`);
        this.events[name] = [];
    }

    exists(name) {
        return Array.isArray(this.events[name]);
    }
}