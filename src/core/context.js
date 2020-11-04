
import { Emitter } from "./emitter"


export  class Context extends Emitter {
    constructor(id, events) {
        super(events);
        this.id = id;
        this.components = new Map();
        this.plugins = new Map();
    }

    use(plugin, params) {
        if(plugin.name && this.plugins.has(plugin.name)) throw new Error(`Plugin ${plugin.name} already in use`)
        plugin.install(this, params || {});
        this.plugins.set(plugin.name, params)
    }

    register(component) {
        if (this.components.has(component.name))
            throw new Error(`Component ${component.name} already registered`);
        this.components.set(component.name, component);
        this.trigger('componentregister', component);
    }

    destroy() {
        this.trigger('destroy')
    }
}
