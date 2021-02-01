type Comparable<T> = {
    equals(b: T): boolean
};


class ObjectSet<T> {

    private _set: Set<T & Comparable<T>>;

    constructor(values: (T & Comparable<T>)[]) {
        // console.log(values);
        this._set = new Set();
        values.forEach(v => this.add(v));
    }

    add(value: T & Comparable<T>) {
        if (!this.has(value)) {
            this._set.add(value);
        }
        return this;
    }

    delete(value: T & Comparable<T>) {
        let found = false;
        this._set.forEach(obj => {
            if (obj.equals(value)) {
                this._set.delete(obj);
                found = true;
                return;
            }
        })
        
        return found;
    }
    
    has(value: T & Comparable<T>) {
        let found = false;
        this._set.forEach(obj => {
            if (obj.equals(value)) {
                found = true;
                return;
            }
        });

        return found;
    }

    size() {
        return this._set.size;
    }

    forEach(callback: (value1: T & Comparable<T>, value2: T & Comparable<T>, set: Set<T & Comparable<T>>) => void) {
        this._set.forEach(callback);
    }

    clear() {
        this._set.clear();
    }

}

export {
    Comparable,
    ObjectSet
};