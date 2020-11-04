export class Selection {
    constructor(items) {
        this.list = [];
        if(items instanceof Array)
            items.forEach(i=>this.add(i, true));
        else if(typeof items === 'object')
            this.add(items);
    }

    add(item, accumulate) {
        if (!accumulate)
            this.list = [item];
        else if (!this.contains(item))
            this.list.push(item);
        return this;
    }

    clear() {
        this.list = [];
    }

    remove(item) {
        this.list.splice(this.list.indexOf(item), 1);
    }

    contains(item) {
        return this.list.indexOf(item) !== -1;
    }

    each(callback) {
        this.list.forEach(i=>{callback.call(i, i)});
    }

    get count() {
        return this.list.length;
    }
}